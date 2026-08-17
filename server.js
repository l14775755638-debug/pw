const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const tls = require("tls");
const os = require("os");
const { execFile, spawn } = require("child_process");

const root = __dirname;
const depsRoot = "/Users/macbook/.cache/codex-runtimes/codex-primary-runtime/dependencies";
const pdftoppmPath = path.join(depsRoot, "bin", "pdftoppm");
const pdfinfoPath = path.join(depsRoot, "bin", "pdfinfo");
const nodeModuleRoot = path.join(depsRoot, "node", "node_modules");
const ticketOcrJobs = new Map();
const maxBatchOcrPages = Number(process.env.TICKET_OCR_MAX_PAGES || 100);
const batchOcrConcurrency = Math.max(1, Math.min(Number(process.env.TICKET_OCR_CONCURRENCY || 3), 5));

function loadLocalEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) return;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  });
}

loadLocalEnv();

const port = Number(process.env.PORT || 4173);
const defaultProxy = "http://127.0.0.1:7897";
const providerConfigs = {
  aliyun: {
    name: "阿里云百炼",
    keyName: "DASHSCOPE_API_KEY",
    model: process.env.ALIYUN_VISION_MODEL || "qwen3-vl-plus",
    endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  },
  openai: {
    name: "OpenAI",
    keyName: "OPENAI_API_KEY",
    model: process.env.OPENAI_VISION_MODEL || "gpt-5.4",
    endpoint: "https://api.openai.com/v1/responses",
  },
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function getProxyUrl() {
  if (getActiveProvider() === "aliyun" && process.env.ALIYUN_USE_PROXY !== "true") return "";
  const explicitProxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY;
  if (explicitProxy) return explicitProxy;
  return getActiveProvider() === "openai" ? defaultProxy : "";
}

function createProxyAgent(proxyUrl) {
  if (!proxyUrl) return null;
  const parsed = new URL(proxyUrl);
  return {
    parsed,
    name: proxyUrl.replace(/\/\/.*@/, "//***@"),
  };
}

const proxyAgent = createProxyAgent(getProxyUrl());

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 180 * 1024 * 1024) {
        reject(new Error("Payload too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function runFile(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function dataUrlToBuffer(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("文件数据格式不正确。");
  return { mimeType: match[1], buffer: Buffer.from(match[2], "base64") };
}

function normalizeRegion(region, index) {
  if (!region || typeof region !== "object") return null;
  const label = String(region.label || "").trim();
  const polygon = Array.isArray(region.polygon) ? region.polygon : [];
  if (polygon.length < 3) return null;
  const normalizedPolygon = polygon
    .map((point) => (Array.isArray(point) ? [Number(point[0]), Number(point[1])] : null))
    .filter((point) => point && Number.isFinite(point[0]) && Number.isFinite(point[1]));
  if (normalizedPolygon.length < 3) return null;
  const rawLabelPoint = region.labelPoint || region.label_point || region.textPoint || region.text_point || region.center || region.point;
  const labelPoint =
    Array.isArray(rawLabelPoint) && Number.isFinite(Number(rawLabelPoint[0])) && Number.isFinite(Number(rawLabelPoint[1]))
      ? [Number(rawLabelPoint[0]), Number(rawLabelPoint[1])]
      : null;
  const safeLabel = /^unknown|^unread|^missing|^未识别|^缺失/i.test(label) ? "" : label;
  return { label: safeLabel, polygon: normalizedPolygon, labelPoint, missingIndex: safeLabel ? null : index + 1 };
}

function requestJson(url, payload, headers = {}) {
  return proxyAgent ? requestJsonViaCurl(url, payload, headers) : requestJsonDirect(url, payload, headers);
}

function parseApiResponse(resolve, apiResponse) {
  let data = "";
  apiResponse.setEncoding("utf8");
  apiResponse.on("data", (chunk) => {
    data += chunk;
  });
  apiResponse.on("end", () => {
    try {
      resolve({ status: apiResponse.statusCode || 500, ok: apiResponse.statusCode >= 200 && apiResponse.statusCode < 300, body: JSON.parse(data || "{}") });
    } catch {
      resolve({ status: apiResponse.statusCode || 500, ok: false, body: { error: "Invalid JSON response", raw: data.slice(0, 800) } });
    }
  });
}

function buildRequestOptions(url, payload, headers) {
  const target = new URL(url);
  const body = JSON.stringify(payload);
  return {
    target,
    body,
    options: {
      method: "POST",
      hostname: target.hostname,
      port: Number(target.port || 443),
      path: `${target.pathname}${target.search}`,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        ...headers,
      },
    },
  };
}

function requestJsonDirect(url, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const { target, body, options } = buildRequestOptions(url, payload, headers);
    const request = https.request(options, (apiResponse) => parseApiResponse(resolve, apiResponse));
    request.setTimeout(25000, () => request.destroy(new Error(`连接 ${target.hostname} 超时，请检查网络或稍后重试。`)));
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

function requestJsonViaCurl(url, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const args = [
      "--silent",
      "--show-error",
      "--max-time",
      String(Number(process.env.AI_REQUEST_TIMEOUT_SECONDS || 120)),
      "--write-out",
      "\n%{http_code}",
      "--proxy",
      proxyAgent.parsed.href,
      "--request",
      "POST",
      url,
      "--header",
      "Content-Type: application/json",
      "--header",
      `Content-Length: ${Buffer.byteLength(body)}`,
      "--data-binary",
      "@-",
    ];

    Object.entries(headers).forEach(([key, value]) => {
      args.push("--header", `${key}: ${value}`);
    });

    const child = spawn("curl", args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `代理请求失败：curl exited ${code}`));
        return;
      }
      const match = stdout.match(/\n(\d{3})$/);
      const status = match ? Number(match[1]) : 500;
      const rawBody = match ? stdout.slice(0, match.index) : stdout;
      try {
        resolve({ status, ok: status >= 200 && status < 300, body: JSON.parse(rawBody || "{}") });
      } catch {
        resolve({ status, ok: false, body: { error: "Invalid JSON response", raw: rawBody.slice(0, 800) } });
      }
    });
    child.stdin.end(body);
  });
}

function requestJsonViaProxy(url, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const { target, body, options } = buildRequestOptions(url, payload, headers);
    const parsed = proxyAgent.parsed;
    const isHttpsProxy = parsed.protocol === "https:";
    const connector = isHttpsProxy ? https : http;
    const connectHeaders = {};
    if (parsed.username || parsed.password) {
      connectHeaders["Proxy-Authorization"] = `Basic ${Buffer.from(`${decodeURIComponent(parsed.username)}:${decodeURIComponent(parsed.password)}`).toString("base64")}`;
    }
    const proxyRequest = connector.request({
      host: parsed.hostname,
      port: Number(parsed.port || (isHttpsProxy ? 443 : 80)),
      method: "CONNECT",
      path: `${target.hostname}:443`,
      headers: connectHeaders,
    });
    proxyRequest.setTimeout(30000, () => proxyRequest.destroy(new Error("连接本地代理超时，请检查代理是否开启。")));
    proxyRequest.once("connect", (res, socket) => {
      if (res.statusCode !== 200) {
        socket.destroy();
        reject(new Error(`代理连接失败：HTTP ${res.statusCode}`));
        return;
      }
      const secureSocket = tls.connect({ socket, servername: target.hostname });
      secureSocket.setTimeout(25000, () => secureSocket.destroy(new Error(`连接 ${target.hostname} 超时，请检查本地代理或网络。`)));
      secureSocket.once("secureConnect", () => {
        const agent = new https.Agent({ keepAlive: false });
        agent.createConnection = () => secureSocket;
        const request = https.request({ ...options, agent }, (apiResponse) => parseApiResponse(resolve, apiResponse));
        request.setTimeout(25000, () => request.destroy(new Error(`连接 ${target.hostname} 超时，请检查本地代理或网络。`)));
        request.once("error", reject);
        request.once("close", () => agent.destroy());
        request.write(body);
        request.end();
      });
      secureSocket.once("error", reject);
    });
    proxyRequest.once("error", reject);
    proxyRequest.end();
  });
}

function formatErrorMessage(error) {
  if (error?.message) return error.message;
  if (error?.code) return error.code;
  const nested = Array.isArray(error?.errors) ? error.errors.find((item) => item?.message || item?.code) : null;
  return nested?.message || nested?.code || "智能识别服务请求失败，请检查本地网络或代理。";
}

function getOutputText(result) {
  if (typeof result.output_text === "string") return result.output_text;
  const content = result.output?.flatMap((item) => item.content || []) || [];
  const outputText = content.find((item) => item.type === "output_text" && typeof item.text === "string");
  return outputText?.text || "";
}

function getActiveProvider() {
  const provider = String(process.env.AI_PROVIDER || "aliyun").toLowerCase();
  return providerConfigs[provider] ? provider : "aliyun";
}

function getProviderConfig() {
  return providerConfigs[getActiveProvider()];
}

function sendStatus(response) {
  const provider = getActiveProvider();
  const config = getProviderConfig();
  sendJson(response, 200, {
    provider,
    providerName: config.name,
    keyName: config.keyName,
    hasKey: Boolean(process.env[config.keyName]),
    model: config.model,
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    proxy: proxyAgent ? proxyAgent.name : "",
  });
}

function buildSeatmapPrompt(width, height) {
  return [
    "你是演唱会票务系统的座位图识别器。",
    width && height ? `这张图片的坐标尺寸是 ${width} x ${height} 像素。所有 polygon 坐标必须落在这个坐标系里。` : "",
    "请识别图中所有可售票座位分区。每个分区通常是闭合色块，可能是黄色、绿色、红色、粉色、紫色或灰色，并带有 101、205、VIP、A区、B区等文字。",
    "请优先读取分区内部或旁边的小数字/字母。不要只找黄色，也不要把整张座位图或大背景当成一个区域。",
    "如果文字读不清但色块明显存在，label 返回空字符串，polygon 返回该色块坐标，让后台进入文本补救清单。",
    "返回 JSON，不要返回 Markdown。",
    "每个区域必须包含 label、labelPoint 和 polygon。",
    "labelPoint 是区号文字中心点或该编号所在色块中心点，格式为 [x,y]，必须贴近真实文字位置，不能放到隔壁色块。",
    "polygon 使用图片原始像素坐标，格式为 [[x,y],...]。如果不能确认精确轮廓，可以返回覆盖该色块的四边形。",
    "不要返回舞台、图例、标题、水印、说明文字。",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildTablePrompt(pageNumber) {
  return [
    "你是票务表格 OCR 识别器。",
    `请读取这张票源表第 ${pageNumber} 页里的真实表格内容。`,
    "只输出可复制到表格里的纯文本，不要解释，不要 Markdown，不要使用代码块。",
    "如果能看到表头，请用制表符分隔列，第一行输出表头。后续每一行也必须用相同列数的制表符分隔。",
    "常见列包括：日期、票价、区域、行、座位、数量、售价、备注。",
    "如果表格中有多条票源，必须全部保留，不要合并、不要省略。",
    "每一张票源一行。不要输出图片标题、水印、页码、空白说明。",
    "如果本页没有票源表格，输出空字符串。",
  ].join("\n");
}

function parseSeatmapRegions(text) {
  let cleaned = String(text || "")
    .replace(/```(?:json)?/gi, "")
    .trim();
  const objectStart = cleaned.indexOf("{");
  const arrayStart = cleaned.indexOf("[");
  const startsWithArray = arrayStart >= 0 && (objectStart < 0 || arrayStart < objectStart);
  const jsonStart = startsWithArray ? arrayStart : objectStart;
  const jsonEnd = startsWithArray ? cleaned.lastIndexOf("]") : cleaned.lastIndexOf("}");
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
  }
  const parsed = JSON.parse(cleaned || "{}");
  const regions = Array.isArray(parsed) ? parsed : parsed.regions || [];
  return regions.map(normalizeRegion).filter(Boolean);
}

function fitRegionsToImage(regions, width, height) {
  if (!width || !height || !regions.length) return regions;
  const points = regions.flatMap((region) => [...region.polygon, region.labelPoint || []]).filter((point) => point.length >= 2);
  const maxX = Math.max(...points.map((point) => point[0]));
  const maxY = Math.max(...points.map((point) => point[1]));
  const scaleX = maxX > width ? width / maxX : 1;
  const scaleY = maxY > height ? height / maxY : 1;
  if (scaleX === 1 && scaleY === 1) return regions;
  return regions.map((region) => ({
    ...region,
    polygon: region.polygon.map(([x, y]) => [Math.round(x * scaleX), Math.round(y * scaleY)]),
    labelPoint: region.labelPoint ? [Math.round(region.labelPoint[0] * scaleX), Math.round(region.labelPoint[1] * scaleY)] : region.labelPoint,
  }));
}

async function recognizeSeatmapWithAliyun(image, prompt) {
  const config = providerConfigs.aliyun;
  const apiResponse = await requestJson(
    config.endpoint,
    {
      model: config.model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      extra_body: { enable_thinking: false },
    },
    {
      Authorization: `Bearer ${process.env[config.keyName]}`,
    },
  );

  if (!apiResponse.ok) {
    console.error("Aliyun request failed", JSON.stringify(apiResponse.body).slice(0, 1200));
    const message = apiResponse.body?.error?.message || apiResponse.body?.message || "阿里云百炼智能识别接口请求失败。";
    const error = new Error(message);
    error.status = apiResponse.status;
    error.detail = apiResponse.body;
    throw error;
  }

  const text = apiResponse.body?.choices?.[0]?.message?.content || "";
  return parseSeatmapRegions(text);
}

async function recognizeImageTextWithAliyun(image, prompt) {
  const config = providerConfigs.aliyun;
  const apiResponse = await requestJson(
    config.endpoint,
    {
      model: config.model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      extra_body: { enable_thinking: false },
    },
    {
      Authorization: `Bearer ${process.env[config.keyName]}`,
    },
  );
  if (!apiResponse.ok) {
    const message = apiResponse.body?.error?.message || apiResponse.body?.message || "阿里云百炼表格识别接口请求失败。";
    const error = new Error(message);
    error.status = apiResponse.status;
    error.detail = apiResponse.body;
    throw error;
  }
  return String(apiResponse.body?.choices?.[0]?.message?.content || "").trim();
}

async function recognizeSeatmapWithOpenAI(image, prompt) {
  const config = providerConfigs.openai;
  const apiResponse = await requestJson(
    config.endpoint,
    {
      model: config.model,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: image },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "seatmap_regions",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              regions: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    label: { type: "string" },
                    labelPoint: {
                      type: "array",
                      minItems: 2,
                      maxItems: 2,
                      items: { type: "number" },
                    },
                    polygon: {
                      type: "array",
                      minItems: 3,
                      items: {
                        type: "array",
                        minItems: 2,
                        maxItems: 2,
                        items: { type: "number" },
                      },
                    },
                  },
                  required: ["label", "labelPoint", "polygon"],
                },
              },
            },
            required: ["regions"],
          },
        },
      },
    },
    {
      Authorization: `Bearer ${process.env[config.keyName]}`,
    },
  );

  if (!apiResponse.ok) {
    console.error("OpenAI request failed", JSON.stringify(apiResponse.body).slice(0, 1200));
    const message = apiResponse.body?.error?.message || "OpenAI 智能识别接口请求失败。";
    const error = new Error(message);
    error.status = apiResponse.status;
    error.detail = apiResponse.body;
    throw error;
  }

  const text = getOutputText(apiResponse.body);
  return parseSeatmapRegions(text);
}

async function recognizeSeatmap(request, response) {
  const config = getProviderConfig();
  if (!process.env[config.keyName]) {
    sendJson(response, 501, {
      error: `${config.keyName} is not configured`,
      message:
        getActiveProvider() === "aliyun"
          ? `未配置阿里云百炼智能识别密钥。请在 .env 里设置 ${config.keyName}。`
          : `未配置智能识别密钥。请在 .env 里设置 ${config.keyName}。`,
    });
    return;
  }

  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const image = payload.image;
  const width = Number(payload.width || 0);
  const height = Number(payload.height || 0);
  if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
    sendJson(response, 400, { error: "Missing image data URL" });
    return;
  }

  const prompt = buildSeatmapPrompt(width, height);
  const rawRegions = getActiveProvider() === "openai" ? await recognizeSeatmapWithOpenAI(image, prompt) : await recognizeSeatmapWithAliyun(image, prompt);
  const regions = fitRegionsToImage(rawRegions, width, height);
  if (!regions) return;
  sendJson(response, 200, { regions, model: config.model, provider: getActiveProvider(), providerName: config.name });
}

function getPdfPageCountFromBuffer(buffer) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-pdf-info-"));
  const pdfPath = path.join(tempDir, "source.pdf");
  fs.writeFileSync(pdfPath, buffer);
  return runFile(pdfinfoPath, [pdfPath])
    .then(({ stdout }) => {
      const match = stdout.match(/^Pages:\s*(\d+)/m);
      return Math.max(1, Number(match?.[1] || 1));
    })
    .finally(() => fs.rm(tempDir, { recursive: true, force: true }, () => {}));
}

async function renderPdfPagesToImages(pdfDataUrl, maxPages = 6) {
  const { buffer } = dataUrlToBuffer(pdfDataUrl);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-pdf-"));
  const pdfPath = path.join(tempDir, "source.pdf");
  const outputPrefix = path.join(tempDir, "page");
  fs.writeFileSync(pdfPath, buffer);
  try {
    await runFile(pdftoppmPath, ["-jpeg", "-r", "150", "-f", "1", "-l", String(maxPages), pdfPath, outputPrefix]);
    const sharp = require(path.join(nodeModuleRoot, "sharp"));
    const files = fs
      .readdirSync(tempDir)
      .filter((file) => /^page-\d+\.jpg$/.test(file))
      .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
    const images = [];
    for (const file of files) {
      const input = path.join(tempDir, file);
      const compressed = await sharp(input).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
      const pageMatch = file.match(/page-(\d+)\.jpg$/);
      images.push({
        page: Number(pageMatch?.[1] || images.length + 1),
        image: `data:image/jpeg;base64,${compressed.toString("base64")}`,
      });
    }
    return images;
  } finally {
    fs.rm(tempDir, { recursive: true, force: true }, () => {});
  }
}

function cleanRecognizedTableText(blocks) {
  return blocks
    .map((block) =>
      String(block || "")
        .replace(/^```(?:tsv|csv|text)?/i, "")
        .replace(/```$/i, "")
        .trim(),
    )
    .filter(Boolean)
    .join("\n\n");
}

function getTicketOcrText(job) {
  const blocks = job.results
    .slice()
    .sort((a, b) => a.page - b.page)
    .filter((item) => item.text)
    .map((item) => item.text);
  return cleanRecognizedTableText(blocks);
}

function publicTicketOcrJob(job) {
  const text = getTicketOcrText(job);
  const failedPages = job.errors.map((item) => item.page);
  return {
    id: job.id,
    status: job.status,
    fileName: job.fileName,
    totalPages: job.totalPages,
    pagesQueued: job.pagesQueued,
    pagesProcessed: job.pagesProcessed,
    pagesSucceeded: job.results.filter((item) => item.text).length,
    pagesFailed: job.errors.length,
    failedPages,
    text: job.status === "done" ? text : "",
    message: job.message,
  };
}

async function runTicketOcrBatch(job, file, maxPages) {
  try {
    const { buffer } = dataUrlToBuffer(file);
    job.totalPages = await getPdfPageCountFromBuffer(buffer).catch(() => maxPages);
    const pagesToRender = Math.max(1, Math.min(maxPages || job.totalPages, job.totalPages, maxBatchOcrPages));
    job.pagesQueued = pagesToRender;
    job.message = `正在把 PDF 转成 ${pagesToRender} 张图片...`;
    const images = await renderPdfPagesToImages(file, pagesToRender);
    if (!images.length) {
      job.status = "error";
      job.message = "PDF 页面渲染失败，请换一个 PDF 再试。";
      return;
    }

    let cursor = 0;
    job.status = "running";
    job.message = `正在批量识别 0/${images.length} 页...`;
    const workers = Array.from({ length: Math.min(batchOcrConcurrency, images.length) }, async () => {
      while (cursor < images.length) {
        const item = images[cursor];
        cursor += 1;
        try {
          const text = await recognizeImageTextWithAliyun(item.image, buildTablePrompt(item.page));
          if (text) job.results.push({ page: item.page, text });
        } catch (error) {
          job.errors.push({ page: item.page, message: formatErrorMessage(error) });
        } finally {
          job.pagesProcessed += 1;
          job.message = `正在批量识别 ${job.pagesProcessed}/${images.length} 页...`;
        }
      }
    });
    await Promise.all(workers);

    const text = getTicketOcrText(job);
    job.status = text ? "done" : "error";
    job.message = text
      ? `已批量识别 ${job.pagesProcessed} 页，其中 ${job.results.filter((item) => item.text).length} 页有票源内容。`
      : `已扫描 ${job.pagesProcessed} 页，但没有识别到可用表格内容。`;
  } catch (error) {
    job.status = "error";
    job.message = formatErrorMessage(error);
  } finally {
    job.finishedAt = Date.now();
    setTimeout(() => ticketOcrJobs.delete(job.id), 30 * 60 * 1000);
  }
}

async function recognizeTicketTables(request, response) {
  const config = getProviderConfig();
  if (getActiveProvider() !== "aliyun") {
    sendJson(response, 400, { error: "Ticket OCR currently requires Aliyun provider", message: "票源 OCR 当前请使用阿里云百炼。"});
    return;
  }
  if (!process.env[config.keyName]) {
    sendJson(response, 501, { error: `${config.keyName} is not configured`, message: `未配置阿里云百炼密钥。请在 .env 里设置 ${config.keyName}。` });
    return;
  }
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const file = String(payload.file || "");
  const fileName = String(payload.fileName || "票源文件");
  const maxPages = Math.max(1, Math.min(Number(payload.maxPages || 6), maxBatchOcrPages));
  if (!file.startsWith("data:application/pdf")) {
    sendJson(response, 400, { error: "Only PDF OCR is supported here", message: "当前自动 OCR 只处理 PDF；图片会作为单张表入库。" });
    return;
  }
  const images = await renderPdfPagesToImages(file, maxPages);
  if (!images.length) {
    sendJson(response, 422, { error: "No pages rendered", message: "PDF 页面渲染失败，请换一个 PDF 再试。" });
    return;
  }
  const blocks = [];
  for (let index = 0; index < images.length; index += 1) {
    const text = await recognizeImageTextWithAliyun(images[index].image, buildTablePrompt(images[index].page));
    if (text) blocks.push(text);
  }
  const text = cleanRecognizedTableText(blocks);
  sendJson(response, 200, {
    text,
    pagesProcessed: images.length,
    fileName,
    message: text ? `已识别 ${images.length} 页票源内容。` : `已扫描 ${images.length} 页，但没有识别到可用表格内容。`,
  });
}

async function startTicketOcrJob(request, response) {
  const config = getProviderConfig();
  if (getActiveProvider() !== "aliyun") {
    sendJson(response, 400, { error: "Ticket OCR currently requires Aliyun provider", message: "票源 OCR 当前请使用阿里云百炼。" });
    return;
  }
  if (!process.env[config.keyName]) {
    sendJson(response, 501, { error: `${config.keyName} is not configured`, message: `未配置阿里云百炼密钥。请在 .env 里设置 ${config.keyName}。` });
    return;
  }
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const file = String(payload.file || "");
  const fileName = String(payload.fileName || "票源文件");
  const maxPages = Math.max(1, Math.min(Number(payload.maxPages || maxBatchOcrPages), maxBatchOcrPages));
  if (!file.startsWith("data:application/pdf")) {
    sendJson(response, 400, { error: "Only PDF OCR is supported here", message: "批量 OCR 当前只处理 PDF。" });
    return;
  }
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const job = {
    id,
    status: "queued",
    fileName,
    totalPages: Number(payload.detectedPages || 0),
    pagesQueued: 0,
    pagesProcessed: 0,
    results: [],
    errors: [],
    message: "已加入批量识别队列。",
    createdAt: Date.now(),
    finishedAt: null,
  };
  ticketOcrJobs.set(id, job);
  runTicketOcrBatch(job, file, maxPages);
  sendJson(response, 202, publicTicketOcrJob(job));
}

function sendTicketOcrJob(request, response) {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  const id = url.searchParams.get("id");
  const job = id ? ticketOcrJobs.get(id) : null;
  if (!job) {
    sendJson(response, 404, { error: "OCR job not found", message: "没有找到这个识别任务，可能已经过期，请重新上传。" });
    return;
  }
  sendJson(response, 200, publicTicketOcrJob(job));
}

function serveStatic(request, response) {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  let filePath = path.join(root, decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname));
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/api/status") {
    sendStatus(response);
    return;
  }
  if (request.method === "POST" && request.url === "/api/seatmap/recognize") {
    recognizeSeatmap(request, response).catch((error) => {
      console.error("Seatmap recognize failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, 500, { error: message, message });
    });
    return;
  }
  if (request.method === "POST" && request.url === "/api/tables/recognize") {
    recognizeTicketTables(request, response).catch((error) => {
      console.error("Ticket table recognize failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
    });
    return;
  }
  if (request.method === "POST" && request.url === "/api/tables/recognize/start") {
    startTicketOcrJob(request, response).catch((error) => {
      console.error("Ticket table OCR job failed to start", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
    });
    return;
  }
  if (request.method === "GET" && request.url.startsWith("/api/tables/recognize/job")) {
    sendTicketOcrJob(request, response);
    return;
  }
  serveStatic(request, response);
});

server.listen(port, () => {
  console.log(`Ticket demo running at http://localhost:${port}/`);
});
