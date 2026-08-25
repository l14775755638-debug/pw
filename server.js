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
const pythonPath = process.env.PYTHON || "/usr/bin/python3";
const rowColorScriptPath = path.join(root, "tools", "detect_ticket_row_colors.py");
const seatmapTemplateDir = path.join(root, "seatmap-templates");
const uploadSourceDir = path.join(root, "uploads");
const ticketOcrJobs = new Map();

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

function readPositiveIntegerEnv(name, fallback = null) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

const maxBatchOcrPages = readPositiveIntegerEnv("TICKET_OCR_MAX_PAGES", Number.POSITIVE_INFINITY);
const batchOcrConcurrency = Math.max(1, Math.min(readPositiveIntegerEnv("TICKET_OCR_CONCURRENCY", 1), 3));
const batchOcrRetries = Math.max(0, Math.min(readPositiveIntegerEnv("TICKET_OCR_RETRIES", 3), 6));
const batchOcrRetryDelayMs = Math.max(300, readPositiveIntegerEnv("TICKET_OCR_RETRY_DELAY_MS", 1800));
const ocrCompletenessCheckEnabled = process.env.TICKET_OCR_COMPLETENESS_CHECK === "1";
const ocrRowColorDuringScanEnabled = process.env.TICKET_OCR_ROW_COLOR_DURING_SCAN === "1";
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
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
  ".json": "application/json; charset=utf-8",
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

function getExtensionForMime(mimeType, fileName = "") {
  const ext = path.extname(fileName).toLowerCase();
  if (ext && /^[.\w-]+$/.test(ext)) return ext;
  if (mimeType === "application/pdf") return ".pdf";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  return ".jpg";
}

function getMimeForExtension(fileName = "") {
  const ext = path.extname(String(fileName || "")).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function safeFileStem(fileName) {
  return path
    .basename(String(fileName || "source"), path.extname(String(fileName || "")))
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "source";
}

async function saveSourceFile(request, response) {
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const { mimeType, buffer } = dataUrlToBuffer(payload.file || payload.dataUrl || "");
  const fileName = String(payload.fileName || "source");
  fs.mkdirSync(uploadSourceDir, { recursive: true });
  const savedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFileStem(fileName)}${getExtensionForMime(mimeType, fileName)}`;
  const filePath = path.join(uploadSourceDir, savedName);
  fs.writeFileSync(filePath, buffer);
  sendJson(response, 200, {
    url: `uploads/${savedName}`,
    fileName: savedName,
    mimeType,
    size: buffer.length,
  });
}

async function parseSpreadsheetPreview(request, response) {
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  if (!payload.file) {
    sendJson(response, 400, { error: "Missing file", message: "请先选择 CSV 或 Excel 文件。" });
    return;
  }
  const { buffer } = dataUrlToBuffer(payload.file);
  const fileName = String(payload.fileName || "spreadsheet.xlsx");
  const ext = path.extname(fileName).toLowerCase() || ".xlsx";
  const tempPath = path.join(os.tmpdir(), `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFileStem(fileName)}${ext}`);
  fs.writeFileSync(tempPath, buffer);
  const python = path.join(depsRoot, "python", "bin", "python3");
  const script = String.raw`
import csv, json, os, sys
path = sys.argv[1]
file_name = sys.argv[2]
ext = os.path.splitext(file_name.lower())[1]

def clean(value):
    if value is None:
        return ""
    text = str(value)
    if text.endswith(".0") and text[:-2].isdigit():
        return text[:-2]
    return text.strip()

rows = []
if ext in [".csv", ".tsv", ".txt"]:
    raw = open(path, "rb").read()
    text = None
    for enc in ("utf-8-sig", "utf-8", "gb18030", "big5"):
        try:
            text = raw.decode(enc)
            break
        except Exception:
            pass
    if text is None:
        text = raw.decode("utf-8", errors="replace")
    sample = text[:4096]
    delimiter = "\t" if "\t" in sample and sample.count("\t") >= sample.count(",") else ","
    for row in csv.reader(text.splitlines(), delimiter=delimiter):
        rows.append([clean(cell) for cell in row])
else:
    from openpyxl import load_workbook
    wb = load_workbook(path, read_only=True, data_only=True)
    ws = wb[wb.sheetnames[0]]
    for row in ws.iter_rows(values_only=True):
        rows.append([clean(cell) for cell in row])

rows = [row for row in rows if any(str(cell).strip() for cell in row)]
width = max([len(row) for row in rows] + [0])
rows = [row + [""] * (width - len(row)) for row in rows]
print(json.dumps({"rows": rows[:1000]}, ensure_ascii=False))
`;
  try {
    const { stdout } = await runFile(python, ["-c", script, tempPath, fileName]);
    const parsed = JSON.parse(stdout || "{}");
    sendJson(response, 200, { rows: Array.isArray(parsed.rows) ? parsed.rows : [] });
  } finally {
    fs.rm(tempPath, { force: true }, () => {});
  }
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

function getApiErrorMessage(apiResponse, fallback, providerName = "") {
  const rawMessage = apiResponse?.body?.error?.message || apiResponse?.body?.message || "";
  const rawCode = apiResponse?.body?.error?.code || apiResponse?.body?.code || "";
  const combined = `${rawCode} ${rawMessage}`.toLowerCase();
  if (combined.includes("overdue-payment") || combined.includes("account is in good standing")) {
    const name = providerName || "当前 AI 服务";
    return `${name}账号/额度异常：接口返回 overdue-payment，请先检查余额、欠费账单或付款方式。`;
  }
  return rawMessage || fallback;
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
      String(Number(process.env.AI_REQUEST_TIMEOUT_SECONDS || 180)),
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
  const raw = String(error?.message || error?.stderr || "");
  if (/timed out after|operation timed out|curl:\s*\(28\)|timeout/i.test(raw)) {
    return "识别接口超时：这一页请求超过时间限制。请点“重试失败页”，或稍后减少页数再识别。";
  }
  if (error?.message) return error.message;
  if (error?.code) return error.code;
  const nested = Array.isArray(error?.errors) ? error.errors.find((item) => item?.message || item?.code) : null;
  return nested?.message || nested?.code || "智能识别服务请求失败，请检查本地网络或代理。";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableOcrError(error) {
  const status = Number(error?.status || 0);
  if (status === 429 || status === 408) return true;
  if (status >= 500) return true;
  const message = String(error?.message || "").toLowerCase();
  return /timeout|超时|network|socket|econn|rate|limit|busy|temporar|稍后|重试/.test(message);
}

function getOutputText(result) {
  if (typeof result.output_text === "string") return result.output_text;
  const content = result.output?.flatMap((item) => item.content || []) || [];
  const outputText = content.find((item) => item.type === "output_text" && typeof item.text === "string");
  return outputText?.text || "";
}

function extractJsonObject(text) {
  const value = String(text || "").trim();
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
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
    "宁可把不确定编号留空，也不要把编号绑定到隔壁色块。",
    "两个相邻区域的 polygon 不能互相重叠；polygon 只覆盖该色块内部，边界要贴着分割线或斜边。",
    "返回 JSON，不要返回 Markdown。",
    "每个区域必须包含 label、labelPoint 和 polygon。",
    "labelPoint 是区号文字中心点或该编号所在色块中心点，格式为 [x,y]，必须贴近真实文字位置，不能放到隔壁色块。",
    "polygon 使用图片原始像素坐标，格式为 [[x,y],...]。如果不能确认精确轮廓，可以返回覆盖该色块的四边形。",
    "不要返回舞台、图例、标题、水印、说明文字，也不要把轮椅席图例线当成可售分区。",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildTablePrompt(pageNumber) {
  return [
    "你是票务表格 OCR 识别器。",
    `请读取这张票源表第 ${pageNumber} 页里的真实表格内容。`,
    "只输出可复制到表格里的纯文本，不要解释，不要 Markdown，不要使用代码块。",
    "如果同一页里有多个真正独立的表格、左右并列表格，必须按视觉上的独立表块拆开；每个表块单独输出一段 TSV，表块之间用一个空行分隔。",
    "但是，如果一张表只是中间用颜色行、空行、日期行、分组标题、横线、说明行隔开，仍然是同一张完整表，不要拆成新表块；继续使用同一个表头按原列输出后续行。",
    "同一张完整表内部不要输出空行；颜色分隔带、日期分隔带、说明分隔行可以跳过，不要把它们单独输出成一段。",
    "如果同一张无表头小表里有多条连续票源行，必须放在同一个 TSV 段里；不能每一条票源单独空一行、不能把每条票拆成一个表块。",
    "不要因为每行之间有横线、浅色分隔、空白间距、日期变化、底色变化就分段；只要列结构一致，就是同一张表。",
    "只有出现新的完整表头并且列结构明显不同，或页面视觉上进入另一张独立表，才允许空一行分成新表块。",
    "只有看到了新的完整表头，或视觉上明显进入另一张独立表，才可以拆块；不要因为底色变化、日期变化、颜色分隔带而拆表。",
    "每个真正独立表块都必须重新输出自己的表头；同一张表的后续分组不能重复/伪造表头，也不能把分组行当表头。",
    "如果原图这张小表没有清晰表头，仍然必须输出第一条可见票源；可以使用原图可见列含义做简短表头，例如“位置\t售价”，但绝对不能把第一条票源当表头吞掉。",
    "识别时先确定每一行属于哪个完整表，再在该表内部按列绑定。不要因为页面上方或左侧有日期/位置文字，就把它写到另一个表块的日期列或座位列。",
    "第一行必须使用原表真实列名和原表列顺序。不要改成系统标准列，不要新增原表没有的列，不要凭空加“票面”“数量”“座位号”“状态”等字段。",
    "后续每一行必须和原表列数一致，用制表符分隔；原表某格没写就留空，不要替它补内容。",
    "如果原表有合并单元格，例如日期跨多行，可以把该日期补到同一列的每一条票源里；但不能因此新增列或移动其它列。",
    "原表写什么就输出什么：座位号写 X/x号/1X/2X/6-9 就照写；没写座位号就留空；原表没有数量/张数列就不要新增数量列，系统后台会按 1 张处理。",
    "如果原表最后一列是价格数字，例如 2400、10500、￥8,000，必须仍然放在原来的价格列，不要放到数量、状态、备注或颜色列。",
    "价格列只能照抄真实价格数字或带货币符号的价格，例如 5400、￥5,400、9400、₩120000、5000원；转寄、配送、送达、送下、自取、面交、过户、电子票、纸质票、酒店地址、可协助、배송、양도、택배、수령、현장 这类交付/说明文字仍按原表列输出，不能挪到价格列。",
    "邮寄票、邮寄、快递、物流、寄送、纸质票、实体票 是交付/配送方式，不是邮件/email；必须原样写在交付/备注列，绝不能识别成“邮件”，也不能放进日期、区域、数量、售价列。",
    "表头含“交付/配送/送达/送下/邮寄/邮寄票/快递/物流/转寄/转赠/自取/面交/过户/备注/说明/delivery/shipping/courier/transfer/pickup/배송/양도/택배/수령/현장/비고/메모”的列，只能输出原来的交付或备注文字，绝不能把它当成数量或售价。",
    "表头含“数量/张数/连坐/count/qty/매수/수량/장수/연석”的列，只能输出 1、2、3、单张、二连、2x 等张数/连坐信息；如果看到 2900、5400、11000、￥5,400 这种价格，必须放回价格列，不能写进数量列。",
    "如果原表没有“票面/席位/类别/类型”列，绝对不要为了对齐系统字段而新增这一列；否则后面的区域、排、座位号、数量、售价都会整体错位。",
    "如果某一格为空，保持为空格，不要用后一列内容补它；不要为了凑齐字段把售价移动到数量，把备注移动到售价，或把配送移动到备注以外的列。",
    "如果原表有“席位/类别/档位/票面”列，例如 FLOOR、VIP、2、CAT 1，请照抄该列；如果原表没有这列，绝对不要新增。",
    "如果表主把区域、排、座位写在同一个格子里，例如“R1区 2排 10-15”、“R2区 9排 1-5号 实际3排”或韩文“101구역 P열”，除非原表本来就是拆开的列，否则不要为了拆字段而新增列；照抄原格内容，后台会另做内部匹配。",
    "如果原格写的是 E1区、B2区、R1、Z2、101구역 这类区域/位置，必须保留完整区域编号；不能把 E1区 截成 E区，也不能把数字 1 写进日期列。",
    "遇到范围必须原样保留，不要只取第一个数字：1-4排、1~4排、1至4排 必须写成完整的“1-4排”；15-16号、1~3号、6-9 必须写成完整的“15-16号/1-3号/6-9”。",
    "如果列名是“票面位置/位置/排数”，内容为“1-4排”，必须输出完整“1-4排”，不能截成 1；如果列名是“票面号段/号段/座位号”，内容为“15-16号”，必须输出完整“15-16号”，不能截成 15。",
    "列名“座位图/座席图/seat map”是原表给买家看的座位方向参考，不是座位号列；不要因为里面有“座位”两个字就把它当成座位号。",
    "例如原表列为：编号、状态、门票时间、席位、区域、票面位置、票面号段、座位图、售价；输出也必须是这些列，不能改成“序号 日期 票面 区域 排 座位号 数量 售价”。",
    "韩文座位词请按中文字段理解：구역/구=区/区域，열=排。例如 101구역 P열 -> 区域 101、排 P；II1구역 2열 -> 区域 I1、排 2。",
    "如果表头叫“位置”或“票面”，但每行内容实际是 101구역 P열、R1구역 3열、211区 A排 这类位置，照抄在原列中，不要把它误判成票价或售价。",
    "如果表头叫“大小号/座位号/号段”，内容是 X、x号、1X、2X、3X，请原样输出，不要改成 1，不要放到排，也不要当数量；没写座位号时留空。",
    "数量列只能照抄张数或连坐说明，例如 1、2、3、单张、二连、2x；价格数字例如 5200、11800 绝不能写到数量列。",
    "如果同一行里有“区域/排/座位号/备注/售价”等清晰表头，必须逐列对照表头读，不能只按数字大小猜字段。交付方式/配送/备注一列即使内容是 X、/、转寄，也仍是备注或交付方式，不能挪到座位号、数量或售价。",
    "如果表格中有多条票源，必须全部保留，不要合并、不要省略。",
    "特别注意表格底部和页面下方：如果序号列能看到 12、13、14 等最后几行，必须输出这些尾部行。不要因为它们靠近截图底部、滚动条、下一张表或页面边界就漏掉。",
    "输出前必须按视觉从上到下再扫一遍每个表格的最后 3 行；如果第一列是序号，检查最大序号并确保所有可见序号行都已输出。",
    "识别顺序必须是：先逐行判断是否明确 sold/已售；不要根据底色在状态列写已售，底色后续由 OpenCV 像素检测接管。",
    "不要输出“行底色/底色/颜色”列，也不要凭视觉猜色；颜色判断由系统 OpenCV 像素检测单独处理。",
    "如果一行明确写 sold/已售，请在原来的单元格里照抄 sold/已售；不要为了它新增状态列。这些已售行后续会先被过滤，不参与颜色不一致审核，也不能作为其他行底色判断的参考。",
    "如果只是底色变化但没有 sold/已售文字，不要把状态写成已售，也不要自动下架。",
    "如果价格/备注/状态文字明确写了已售、已售罄、sold、sold out、SOLD、S/O、售出、售罄、售完、已出、下架、판매완료、매진，请照抄在原表对应列里。",
    "如果单元格里是 not sold、unsold、可售、未售、available、판매중 这类反向含义，不要标已售。",
    "每一张票源一行。不要输出图片标题、水印、页码、空白说明。",
    "如果本页没有票源表格，输出空字符串。",
  ].join("\n");
}

function buildTableCompletenessPrompt(pageNumber, previousText, detectedRows, recognizedRows) {
  return [
    buildTablePrompt(pageNumber),
    "",
    "你上一遍 OCR 可能漏掉了底部票源行，现在请重新完整读取本页。",
    `系统视觉检测到本页可能有约 ${detectedRows} 条表格行，但上一遍 OCR 只输出了 ${recognizedRows} 条数据行。`,
    "请重点检查每个表格的最后几行、靠近下一张表上边缘的行、靠近页面底部的行。",
    "如果第一列是序号，必须从上到下核对所有可见序号；不要停在 11 行，如果原图还有 12、13 行就必须输出。",
    "上一遍 OCR 文本如下，仅供找漏，不要照抄错误：",
    previousText || "",
  ].join("\n");
}

function buildTableBottomSupplementPrompt(pageNumber, previousText) {
  return [
    buildTablePrompt(pageNumber),
    "",
    "这是一张 PDF 页面下半部分/底部裁图，请只读取裁图里可见的票源表格行。",
    "重点补充上一遍 OCR 可能漏掉的下方票源、尾部行、序号跳跃后的行。",
    "如果看到序号 32、33、34、35、36 等行，必须逐行输出；不要因为上方已经有序号 29、30、31 就停止。",
    "如果裁图中表头不完整，但能看到和上一遍相同的列，请沿用同一列顺序输出数据行。",
    "不要输出解释，不要 Markdown。",
    "上一遍 OCR 文本如下，用来避免重复和找漏：",
    previousText || "",
  ].join("\n");
}

function buildTicketReviewAssistPrompt({ instruction, columns, rows, page }) {
  return [
    "你是票务后台人工校对助手。",
    `请根据原始图片/PDF 第 ${page || 1} 页，以及后台已经 OCR 出来的表格行，判断每一行票应该发布还是跳过。`,
    "用户会告诉你颜色、划线、标记等规则。请优先按用户规则判断；如果原图文字明确写 sold、sold out、S/O、已售、已售罄、售出、售罄、售完、已出、下架、판매완료、매진，也应跳过。",
    "如果原图文字是 not sold、unsold、可售、未售、available、판매중 这类反向含义，不要因为包含 sold 字样就跳过。",
    "颜色判断必须逐行观察该行所有单元格的底色，只能在该行底色明显符合用户规则时应用。不要因为整张截图偏黄、压缩偏色、表格边框、标题色、文字颜色或相邻行颜色，就把所有行都判成同一种颜色。",
    "如果用户说某种颜色已售，例如橙色、黄色、红色、蓝色、绿色、紫色、粉色、灰色、黑色或青色，只有整行主要底色明显是该颜色的行才写 skip；白底、浅色未售样本、表头、局部文字颜色不同的行不能按该颜色规则跳过。",
    "如果用户规则是白底未售、其它底色已售，必须先确认同一张表里确实同时存在白底/无填充数据行和其它底色数据行；确认后只跳过其它底色行，白底/无填充行应发布。",
    "对于任何底色规则，请至少对比同页中明显不同底色的几行：如果有白底或其他颜色行存在，必须逐行区分，绝对不要把整页所有 OCR 行都标成同一种底色。",
    "如果用户规则里包含“人工颜色样本”，这些样本是最高优先级：已售样本相近的行才 skip，未售样本相近的行必须 publish；不能无视样本把整页全部 skip。",
    "如果某行颜色边界不清、截图压缩导致难以确认，action 写 publish，status 写“需人工复核”，reason 写明“不确定是否为指定底色”，不要整批跳过。",
    "如果用户要求的是反向校对，例如多数下架、少数上架，也要逐行判断，不能把没有明显售出标记的行一律 skip。",
    "只返回 JSON，不要 Markdown，不要解释。",
    "JSON 格式必须是：{\"decisions\":[{\"row\":1,\"action\":\"publish\",\"status\":\"可发布\",\"reason\":\"简短原因\"}]}",
    "row 使用 OCR 行号，第一条票是 1。",
    "action 只能是 publish 或 skip。要给客户看的写 publish；已售、疑似已售、下架、看不清且风险高的写 skip。",
    "status 只能使用 可发布、已售、疑似已售、下架、需人工复核 之一。",
    "每一行都要给出 decision。",
    `用户规则：${instruction || "没有额外规则，请按图片文字和明显标记判断。"}`,
    `表头：${JSON.stringify(columns || [])}`,
    `OCR 行：${JSON.stringify(rows || [])}`,
  ].join("\n");
}

function parseReviewAssistDecisions(text) {
  let cleaned = String(text || "")
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) cleaned = cleaned.slice(start, end + 1);
  const parsed = JSON.parse(cleaned || "{}");
  return (Array.isArray(parsed) ? parsed : parsed.decisions || [])
    .map((item) => ({
      row: Number(item.row),
      action: String(item.action || "").toLowerCase() === "publish" ? "publish" : "skip",
      status: String(item.status || "").trim() || (String(item.action || "").toLowerCase() === "publish" ? "可发布" : "疑似已售"),
      reason: String(item.reason || "").trim(),
    }))
    .filter((item) => Number.isFinite(item.row) && item.row > 0);
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
    const message = getApiErrorMessage(apiResponse, "阿里云百炼智能识别接口请求失败。", "阿里云百炼");
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
    const message = getApiErrorMessage(apiResponse, "阿里云百炼表格识别接口请求失败。", "阿里云百炼");
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
    const message = getApiErrorMessage(apiResponse, "OpenAI 智能识别接口请求失败。", "OpenAI");
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

function getRequestedTicketOcrPages(value, fallback) {
  const requested = Number(value);
  const base = Number.isFinite(requested) && requested > 0 ? Math.floor(requested) : fallback;
  return Math.max(1, Math.min(base, maxBatchOcrPages));
}

function formatTicketOcrPageLimit() {
  return Number.isFinite(maxBatchOcrPages) ? `，当前上限 ${maxBatchOcrPages} 页` : "";
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

async function renderPdfPageToImage(pdfDataUrl, pageNumber = 1) {
  const { buffer } = dataUrlToBuffer(pdfDataUrl);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-pdf-page-"));
  const pdfPath = path.join(tempDir, "source.pdf");
  const outputPrefix = path.join(tempDir, "page");
  const page = Math.max(1, Math.floor(Number(pageNumber) || 1));
  fs.writeFileSync(pdfPath, buffer);
  try {
    await runFile(pdftoppmPath, ["-jpeg", "-r", "150", "-f", String(page), "-l", String(page), pdfPath, outputPrefix]);
    const sharp = require(path.join(nodeModuleRoot, "sharp"));
    const file = fs
      .readdirSync(tempDir)
      .filter((name) => /^page-\d+\.jpg$/.test(name))
      .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))[0];
    if (!file) return "";
    const compressed = await sharp(path.join(tempDir, file)).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
    return `data:image/jpeg;base64,${compressed.toString("base64")}`;
  } finally {
    fs.rm(tempDir, { recursive: true, force: true }, () => {});
  }
}

async function cropImageDataUrl(imageDataUrl, { topRatio = 0.45, heightRatio = 0.55 } = {}) {
  const { buffer } = dataUrlToBuffer(imageDataUrl);
  const sharp = require(path.join(nodeModuleRoot, "sharp"));
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = Number(metadata.width || 0);
  const height = Number(metadata.height || 0);
  if (!width || !height) return "";
  const top = Math.max(0, Math.min(height - 1, Math.floor(height * topRatio)));
  const cropHeight = Math.max(1, Math.min(height - top, Math.floor(height * heightRatio)));
  const cropped = await sharp(buffer)
    .extract({ left: 0, top, width, height: cropHeight })
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 84 })
    .toBuffer();
  return `data:image/jpeg;base64,${cropped.toString("base64")}`;
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

function splitRecognizedTableLine(line) {
  if (String(line || "").includes("\t")) return String(line || "").split("\t");
  if (String(line || "").includes(",")) return String(line || "").split(",");
  const trimmed = String(line || "").trim();
  const wideSplit = trimmed.split(/\s{2,}/);
  if (wideSplit.length > 1) return wideSplit;
  const trailingPriceMatch = trimmed.match(/^(.+?)\s+([￥¥$₩]?\s*\d{3,6}(?:[,.]\d{3})?(?:\s*(?:cny|rmb|원))?)$/i);
  if (trailingPriceMatch) return [trailingPriceMatch[1].trim(), trailingPriceMatch[2].trim()];
  return [trimmed];
}

function looksLikeRecognizedDataCells(cells = []) {
  const values = cells.map((cell) => String(cell || "").trim()).filter(Boolean);
  if (values.length < 2) return false;
  const joined = values.join(" ");
  const hasPrice = values.some((value) => /(?:^|[^\d])(?:￥|¥|₩|\$)?\s*\d{3,6}(?:[,.]\d{3})?(?:원|cny|rmb)?(?:$|[^\d])/i.test(value));
  const hasDate = /(?:20\d{2}[.\/-]?\d{1,2}[.\/-]?\d{1,2}|\d{1,2}[.\/月-]\d{1,2}日?)/.test(joined);
  const hasZone = /(?:[A-Z]{1,3}\d{0,3}|\d{2,4})\s*(?:区|區|구역|구|section|block|area|zone)?/i.test(joined);
  const hasRow = /(?:\d+\s*排|[A-Z]\s*排|row\s*[A-Z0-9]+|[A-Z]\s*열|\d+\s*열)/i.test(joined);
  const headerCueCount = values.filter((value) => /(序号|编号|日期|区域|位置|售价|价格|price|row|seat|qty|status)/i.test(value)).length;
  return hasPrice && (hasDate || (hasZone && hasRow)) && headerCueCount < Math.max(2, values.length - 1);
}

function isRecognizedColorHeader(cell) {
  const text = String(cell || "").toLowerCase().replace(/[\s/\\（）()·._-]+/g, "");
  return ["行底色", "底色", "背景色", "颜色标记", "颜色", "rowcolor", "background"].includes(text);
}

function stripRecognizedColorColumns(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split(/\r?\n/);
      const headerIndex = lines.findIndex((line) => {
        const trimmed = line.trim();
        return trimmed && !/^-{2,}\s*PDF\s*第\s*\d+\s*页\s*-{2,}$/i.test(trimmed);
      });
      if (headerIndex < 0) return block;
      const headerCells = splitRecognizedTableLine(lines[headerIndex]).map((cell) => cell.trim());
      const colorIndexes = headerCells
        .map((cell, index) => (isRecognizedColorHeader(cell) ? index : -1))
        .filter((index) => index >= 0);
      if (!colorIndexes.length) return block;
      const removeSet = new Set(colorIndexes);
      return lines
        .map((line, index) => {
          if (index < headerIndex || !line.trim()) return line;
          const cells = splitRecognizedTableLine(line);
          return cells.filter((_, cellIndex) => !removeSet.has(cellIndex)).join("\t");
        })
        .join("\n");
    })
    .join("\n\n");
}

function countRecognizedDataRows(text) {
  const cleaned = cleanRecognizedTableText([stripRecognizedColorColumns(text)]);
  if (!cleaned) return 0;
  return cleaned
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !/^-{2,}\s*PDF\s*第\s*\d+\s*页\s*-{2,}$/i.test(line)),
    )
    .reduce((count, lines) => {
      if (lines.length < 2) return count;
      const headerCells = splitRecognizedTableLine(lines[0]).map((cell) => cell.trim()).filter(Boolean);
      if (headerCells.length < 2) return count;
      const firstLineIsData = looksLikeRecognizedDataCells(headerCells);
      const dataRows = lines
        .slice(firstLineIsData ? 0 : 1)
        .map((line) => splitRecognizedTableLine(line).map((cell) => cell.trim()))
        .filter((row) => row.some(Boolean));
      return count + dataRows.length;
    }, 0);
}

async function analyzeTicketRowColorsFromDataUrl(imageDataUrl, expectedRows) {
  if (!fs.existsSync(rowColorScriptPath)) {
    return { source: "opencv", reliable: false, error: "OpenCV 行色脚本不存在", rows: [] };
  }
  const { mimeType, buffer } = dataUrlToBuffer(imageDataUrl);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-row-color-"));
  const ext = getExtensionForMime(mimeType, "page.jpg");
  const imagePath = path.join(tempDir, `page${ext}`);
  fs.writeFileSync(imagePath, buffer);
  try {
    const { stdout } = await runFile(pythonPath, [rowColorScriptPath, imagePath, "--expected-rows", String(expectedRows || 0)]);
    const parsed = JSON.parse(stdout || "{}");
    return {
      source: "opencv",
      expectedRows: Number(parsed.expectedRows || expectedRows || 0),
      detectedRows: Number(parsed.detectedRows || 0),
      selectionMode: parsed.selectionMode || "",
      reliable: Boolean(parsed.reliable),
      contiguous: Boolean(parsed.contiguous),
      maxRowGap: Number(parsed.maxRowGap || 0),
      labels: Array.isArray(parsed.labels) ? parsed.labels : [],
      rows: Array.isArray(parsed.rows) ? parsed.rows : [],
      error: parsed.error || "",
    };
  } catch (error) {
    return { source: "opencv", reliable: false, error: formatErrorMessage(error), rows: [] };
  } finally {
    fs.rm(tempDir, { recursive: true, force: true }, () => {});
  }
}

function getTicketOcrText(job) {
  const blocks = job.results
    .slice()
    .sort((a, b) => a.page - b.page)
    .filter((item) => item.text)
    .map((item) => `--- PDF 第 ${item.page} 页 ---\n${item.text}`);
  return cleanRecognizedTableText(blocks);
}

function publicTicketOcrJob(job) {
  const text = getTicketOcrText(job);
  const failedPages = job.errors.map((item) => item.page);
  const rowColorAnalyses = Object.fromEntries(
    job.results
      .filter((item) => item.rowColorAnalysis)
      .map((item) => [String(item.page), item.rowColorAnalysis]),
  );
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
    errors: job.errors.slice().sort((a, b) => a.page - b.page),
    rowColorAnalyses,
    partialText: text,
    text: job.status === "done" ? text : "",
    message: job.message,
  };
}

async function recognizeTicketPageWithRetry(item, job) {
  let lastError = null;
  for (let attempt = 1; attempt <= batchOcrRetries + 1; attempt += 1) {
    try {
      const checked = await recognizeTicketPageTextWithCompletenessCheck(item);
      const text = checked.text;
      const expectedRows = checked.recognizedRows;
      const rowColorAnalysis = ocrRowColorDuringScanEnabled && expectedRows
        ? await analyzeTicketRowColorsFromDataUrl(item.image, expectedRows)
        : null;
      return { page: item.page, text, attempts: attempt, rowColorAnalysis };
    } catch (error) {
      lastError = error;
      if (attempt > batchOcrRetries || !isRetryableOcrError(error)) break;
      job.message = `第 ${item.page} 页识别失败，正在第 ${attempt + 1}/${batchOcrRetries + 1} 次重试...`;
      await sleep(batchOcrRetryDelayMs * attempt);
    }
  }
  throw lastError;
}

async function recognizeTicketPageTextWithCompletenessCheck(item) {
  const rawText = await recognizeImageTextWithAliyun(item.image, buildTablePrompt(item.page));
  let text = stripRecognizedColorColumns(rawText);
  let recognizedRows = countRecognizedDataRows(text);
  if (!ocrCompletenessCheckEnabled) return { text, recognizedRows, visualAnalysis: null };
  const visualAnalysis = await analyzeTicketRowColorsFromDataUrl(item.image, 0);
  const detectedRows = Number(visualAnalysis.detectedRows || visualAnalysis.rows?.length || 0);
  const suspiciouslyMissingRows = detectedRows >= 8 && recognizedRows > 0 && detectedRows >= recognizedRows + 4;
  if (!suspiciouslyMissingRows) return { text, recognizedRows, visualAnalysis };

  const retryRawText = await recognizeImageTextWithAliyun(
    item.image,
    buildTableCompletenessPrompt(item.page, text, detectedRows, recognizedRows),
  );
  const retryText = stripRecognizedColorColumns(retryRawText);
  const retryRows = countRecognizedDataRows(retryText);
  if (retryRows > recognizedRows) {
    text = retryText;
    recognizedRows = retryRows;
  }
  const bottomImage = await cropImageDataUrl(item.image, { topRatio: 0.45, heightRatio: 0.55 }).catch(() => "");
  if (bottomImage) {
    const bottomRawText = await recognizeImageTextWithAliyun(bottomImage, buildTableBottomSupplementPrompt(item.page, text));
    const bottomText = stripRecognizedColorColumns(bottomRawText);
    const bottomRows = countRecognizedDataRows(bottomText);
    if (bottomRows > recognizedRows) {
      text = bottomText;
      recognizedRows = bottomRows;
    } else if (bottomRows > 0) {
      const combinedText = cleanRecognizedTableText([text, bottomText]);
      const combinedRows = countRecognizedDataRows(combinedText);
      if (combinedRows > recognizedRows) {
        text = combinedText;
        recognizedRows = combinedRows;
      }
    }
  }
  return { text, recognizedRows, visualAnalysis };
}

async function runTicketOcrBatch(job, file, maxPages) {
  try {
    const { buffer } = dataUrlToBuffer(file);
    job.totalPages = await getPdfPageCountFromBuffer(buffer).catch(() => Number(maxPages) || 1);
    const requestedPages = Number.isFinite(Number(maxPages)) && Number(maxPages) > 0 ? Number(maxPages) : job.totalPages;
    const pagesToRender = getRequestedTicketOcrPages(Math.min(requestedPages, job.totalPages), job.totalPages);
    job.pagesQueued = pagesToRender;
    const limitText = pagesToRender < job.totalPages ? formatTicketOcrPageLimit() : "";
    job.message = `正在把 PDF 转成 ${pagesToRender}/${job.totalPages} 张图片${limitText}...`;
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
          const result = await recognizeTicketPageWithRetry(item, job);
          if (result.text) job.results.push(result);
        } catch (error) {
          job.failedImages[item.page] = item.image;
          job.errors.push({ page: item.page, message: formatErrorMessage(error) });
        } finally {
          job.pagesProcessed += 1;
          const success = job.results.filter((result) => result.text).length;
          const failed = job.errors.length;
          job.message = `正在批量识别 ${job.pagesProcessed}/${images.length} 页，已读到 ${success} 页${failed ? `，失败 ${failed} 页` : ""}...`;
        }
      }
    });
    await Promise.all(workers);

    const text = getTicketOcrText(job);
    job.status = text ? "done" : "error";
    job.message = text
      ? `已批量识别 ${job.pagesProcessed} 页，其中 ${job.results.filter((item) => item.text).length} 页有票源内容${job.errors.length ? `，${job.errors.length} 页失败可单独补扫` : ""}。`
      : `已扫描 ${job.pagesProcessed} 页，但没有识别到可用表格内容。`;
  } catch (error) {
    job.status = "error";
    job.message = formatErrorMessage(error);
  } finally {
    job.finishedAt = Date.now();
    setTimeout(() => ticketOcrJobs.delete(job.id), 30 * 60 * 1000);
  }
}

async function retryTicketOcrFailedPages(job) {
  if (!job.errors.length) return;
  const retryItems = job.errors
    .slice()
    .sort((a, b) => a.page - b.page)
    .map((error) => ({ page: error.page, image: job.failedImages[error.page] }))
    .filter((item) => item.image);

  if (!retryItems.length) {
    job.message = "失败页图片缓存已过期，请重新上传 PDF 后再识别。";
    return;
  }

  job.status = "running";
  job.message = `正在重试 ${retryItems.length} 个失败页...`;
  const remainingErrors = [];
  let retryProcessed = 0;
  for (const item of retryItems) {
    try {
      const result = await recognizeTicketPageWithRetry(item, job);
      if (result.text && !job.results.some((existing) => existing.page === item.page)) {
        job.results.push(result);
      }
      delete job.failedImages[item.page];
    } catch (error) {
      remainingErrors.push({ page: item.page, message: formatErrorMessage(error) });
    } finally {
      retryProcessed += 1;
      job.message = `正在重试失败页 ${retryProcessed}/${retryItems.length}...`;
    }
  }

  const untouchedErrors = job.errors.filter((error) => !retryItems.some((item) => item.page === error.page));
  job.errors = [...untouchedErrors, ...remainingErrors].sort((a, b) => a.page - b.page);
  const text = getTicketOcrText(job);
  job.status = text ? "done" : "error";
  job.message = job.errors.length
    ? `失败页重试完成，仍有 ${job.errors.length} 页失败。`
    : `失败页重试完成，已全部读到可用内容。`;
  job.finishedAt = Date.now();
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
  const maxPages = getRequestedTicketOcrPages(payload.maxPages, 6);
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
  const rowColorAnalyses = {};
  for (let index = 0; index < images.length; index += 1) {
    const checked = await recognizeTicketPageTextWithCompletenessCheck(images[index]);
    const text = checked.text;
    if (text) {
      blocks.push(`--- PDF 第 ${images[index].page} 页 ---\n${text}`);
      const expectedRows = checked.recognizedRows;
      if (expectedRows) {
        rowColorAnalyses[String(images[index].page)] = await analyzeTicketRowColorsFromDataUrl(images[index].image, expectedRows);
      }
    }
  }
  const text = cleanRecognizedTableText(blocks);
  sendJson(response, 200, {
    text,
    rowColorAnalyses,
    pagesProcessed: images.length,
    fileName,
    message: text ? `已识别 ${images.length} 页票源内容。` : `已扫描 ${images.length} 页，但没有识别到可用表格内容。`,
  });
}

async function analyzeTicketRowColors(request, response) {
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  let image = String(payload.image || payload.file || "");
  const sourceUrl = String(payload.sourceUrl || "");
  const sourcePage = Math.max(1, Math.floor(Number(payload.sourcePage || 1)));
  const expectedRows = Math.max(0, Math.floor(Number(payload.expectedRows || 0)));
  if (!image && sourceUrl.startsWith("uploads/")) {
    const sourcePath = path.resolve(root, sourceUrl);
    const uploadRoot = path.resolve(uploadSourceDir);
    if (!sourcePath.startsWith(`${uploadRoot}${path.sep}`) || !fs.existsSync(sourcePath)) {
      sendJson(response, 404, { error: "Source image not found", message: "没有找到已保存的原始图片，请重新选择图片。" });
      return;
    }
    const buffer = fs.readFileSync(sourcePath);
    const mimeType = getMimeForExtension(sourcePath);
    if (mimeType === "application/pdf") {
      image = await renderPdfPageToImage(`data:application/pdf;base64,${buffer.toString("base64")}`, sourcePage);
    } else {
      image = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }
  }
  if (image.startsWith("data:application/pdf")) {
    image = await renderPdfPageToImage(image, sourcePage);
  }
  if (!image.startsWith("data:image/")) {
    sendJson(response, 400, { error: "Missing image", message: "请提供要检测行底色的图片。" });
    return;
  }
  const analysis = await analyzeTicketRowColorsFromDataUrl(image, expectedRows);
  sendJson(response, 200, { rowColorAnalysis: analysis });
}

async function resolveRowColorSourceImage(payload) {
  let image = String(payload.image || payload.file || payload.source || "");
  const sourceUrl = String(payload.sourceUrl || "");
  const sourcePage = Math.max(1, Math.floor(Number(payload.sourcePage || 1)));
  if (!image && sourceUrl.startsWith("uploads/")) {
    const sourcePath = path.resolve(root, sourceUrl);
    const uploadRoot = path.resolve(uploadSourceDir);
    if (!sourcePath.startsWith(`${uploadRoot}${path.sep}`) || !fs.existsSync(sourcePath)) {
      const error = new Error("没有找到已保存的原始图片，请重新选择图片。");
      error.status = 404;
      throw error;
    }
    const buffer = fs.readFileSync(sourcePath);
    const mimeType = getMimeForExtension(sourcePath);
    if (mimeType === "application/pdf") {
      image = await renderPdfPageToImage(`data:application/pdf;base64,${buffer.toString("base64")}`, sourcePage);
    } else {
      image = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }
  }
  if (image.startsWith("data:application/pdf")) {
    image = await renderPdfPageToImage(image, sourcePage);
  }
  if (!image.startsWith("data:image/")) {
    const error = new Error("请提供要检测行底色的图片。");
    error.status = 400;
    throw error;
  }
  return image;
}

function buildRowColorVisionPrompt({ columns, rows, page }) {
  const compactRows = (rows || []).slice(0, 80).map((row, index) => ({
    index,
    cells: Array.isArray(row) ? row.map((cell) => String(cell || "").slice(0, 80)) : [],
  }));
  return [
    "你是票务表格行底色审核器。请逐条判断每一条 OCR 行在原图中对应整行的底色，并根据这张表自己的颜色语境判断是否应该发布。",
    `图片是票源原图/PDF 第 ${page || 1} 页。后台已经读出的列名和行如下：`,
    JSON.stringify({ columns, rows: compactRows }, null, 2),
    "请逐条匹配这些行在图片表格中的真实视觉行，判断该行底色和发布动作。",
    "匹配行时必须先核对该行的关键文字，例如日期、区域、排、号、售价；只有文字内容能对应上的那一行，才可以判断该输入行的底色。",
    "同一页可能有多个独立表格、多个相似行、多个颜色块；不能把上一个表格或下一个表格的底色套到当前输入行。",
    "如果找不到与输入行关键文字一致的视觉行，action=uncertain，label=无法确定。",
    "只看数据行整行的背景底色：白底、红底、黄底、绿底、蓝底、灰底、其他、无法确定。",
    "不能预设某个颜色一定可售或一定下架。必须先观察同一张表/同一表块里哪些颜色是正常可售底色，哪些颜色明显是已售/下架/异常标色。",
    "例如浅蓝、灰、紫、黄、绿、红都有可能是正常表格底色，也都有可能是下架标色；必须根据这张表自身上下文判断。",
    "如果一行大部分背景是白色或浅色正常底，哪怕有表格线、文字、局部单元格边框，也不能误判为下架。",
    "如果某一行和同表其它正常可售行底色明显不同，并且像已售/下架/禁售标记，才 action=skip。",
    "如果该行底色和同表正常可售行一致或只是普通表格配色，action=publish。",
    "如果无法判断颜色含义，action=uncertain，不能猜。",
    "不要因为文字颜色、边框、滚动条、截图压缩、选中高亮、页面背景色而判成非白底。",
    "如果单元格文字明确写 sold/已售/售出/下架/판매완료/매진，action=skip；如果明确可售且颜色正常，action=publish。",
    "无法一一对应或看不清的行 label=无法确定 且 action=uncertain。",
    "返回严格 JSON：{\"rows\":[{\"index\":0,\"label\":\"白底\",\"action\":\"publish\",\"confidence\":0.95,\"reason\":\"...\"}]}。",
    "action 只能是 publish、skip、uncertain。",
    "index 必须使用后台给出的 index，必须覆盖每一条输入行。不要返回 Markdown。",
  ].join("\n");
}

async function analyzeTicketRowColorsWithOpenAI(image, { columns, rows, page }) {
  const config = providerConfigs.openai;
  if (!process.env[config.keyName]) {
    const error = new Error(`未配置 OpenAI 密钥。请在 .env 里设置 ${config.keyName}。`);
    error.status = 501;
    throw error;
  }
  const prompt = buildRowColorVisionPrompt({ columns, rows, page });
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
          name: "ticket_row_colors",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              rows: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    index: { type: "integer" },
                    label: { type: "string" },
                    action: { type: "string", enum: ["publish", "skip", "uncertain"] },
                    confidence: { type: "number" },
                    reason: { type: "string" },
                  },
                  required: ["index", "label", "action", "confidence", "reason"],
                },
              },
            },
            required: ["rows"],
          },
        },
      },
    },
    {
      Authorization: `Bearer ${process.env[config.keyName]}`,
    },
  );
  if (!apiResponse.ok) {
    console.error("OpenAI row-color request failed", JSON.stringify(apiResponse.body).slice(0, 1200));
    const message = getApiErrorMessage(apiResponse, "OpenAI 逐行底色识别失败。", "OpenAI");
    const error = new Error(message);
    error.status = apiResponse.status;
    error.detail = apiResponse.body;
    throw error;
  }
  const parsed = extractJsonObject(getOutputText(apiResponse.body));
  if (!parsed || !Array.isArray(parsed.rows)) {
    const error = new Error("OpenAI 逐行底色识别没有返回可用 JSON。");
    error.status = 502;
    throw error;
  }
  const inputRows = Array.isArray(rows) ? rows : [];
  const byIndex = new Map(parsed.rows.map((item) => [Number(item.index), item]));
  const normalizedRows = inputRows.map((_, index) => {
    const item = byIndex.get(index) || {};
    const action = ["publish", "skip", "uncertain"].includes(String(item.action || "")) ? String(item.action) : "uncertain";
    return {
      index,
      label: String(item.label || "无法确定").trim(),
      rawLabel: String(item.label || "").trim(),
      action,
      confidence: Math.max(0, Math.min(1, Number(item.confidence || 0))),
      coloredRatio: 0,
      whiteRatio: /白/.test(String(item.label || "")) ? 1 : 0,
      coverageRatio: /白|无法|不确定/.test(String(item.label || "")) ? 0 : 1,
      strong: Number(item.confidence || 0) >= 0.78,
      reason: String(item.reason || "").slice(0, 160),
    };
  });
  return {
    source: "ai_row_color",
    reliable: true,
    contiguous: true,
    selectionMode: "openai_row_by_row",
    rows: normalizedRows,
    provider: "openai",
    model: config.model,
  };
}

async function analyzeTicketRowColorsWithAliyun(image, { columns, rows, page }) {
  const config = providerConfigs.aliyun;
  if (!process.env[config.keyName]) {
    const error = new Error(`未配置阿里云百炼密钥。请在 .env 里设置 ${config.keyName}。`);
    error.status = 501;
    throw error;
  }
  const prompt = buildRowColorVisionPrompt({ columns, rows, page });
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
    console.error("Aliyun row-color request failed", JSON.stringify(apiResponse.body).slice(0, 1200));
    const message = getApiErrorMessage(apiResponse, "阿里云逐行底色识别失败。", "阿里云百炼");
    const error = new Error(message);
    error.status = apiResponse.status;
    error.detail = apiResponse.body;
    throw error;
  }
  const text = String(apiResponse.body?.choices?.[0]?.message?.content || "").trim();
  const parsed = extractJsonObject(text);
  if (!parsed || !Array.isArray(parsed.rows)) {
    const error = new Error("阿里云逐行底色识别没有返回可用 JSON。");
    error.status = 502;
    throw error;
  }
  const inputRows = Array.isArray(rows) ? rows : [];
  const byIndex = new Map(parsed.rows.map((item) => [Number(item.index), item]));
  const normalizedRows = inputRows.map((_, index) => {
    const item = byIndex.get(index) || {};
    const action = ["publish", "skip", "uncertain"].includes(String(item.action || "")) ? String(item.action) : "uncertain";
    return {
      index,
      label: String(item.label || "无法确定").trim(),
      rawLabel: String(item.label || "").trim(),
      action,
      confidence: Math.max(0, Math.min(1, Number(item.confidence || 0))),
      coloredRatio: 0,
      whiteRatio: /白/.test(String(item.label || "")) ? 1 : 0,
      coverageRatio: /白|无法|不确定/.test(String(item.label || "")) ? 0 : 1,
      strong: Number(item.confidence || 0) >= 0.78,
      reason: String(item.reason || "").slice(0, 160),
    };
  });
  return {
    source: "ai_row_color",
    reliable: true,
    contiguous: true,
    selectionMode: "aliyun_row_by_row",
    rows: normalizedRows,
    provider: "aliyun",
    model: config.model,
  };
}

async function analyzeTicketRowColorsAi(request, response) {
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const image = await resolveRowColorSourceImage(payload);
  const columns = Array.isArray(payload.columns) ? payload.columns : [];
  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  if (!rows.length) {
    sendJson(response, 400, { error: "Missing rows", message: "请提供需要逐行判断底色的票源行。" });
    return;
  }
  const analyzeWithVision = process.env.OPENAI_API_KEY ? analyzeTicketRowColorsWithOpenAI : analyzeTicketRowColorsWithAliyun;
  const analysis = await analyzeWithVision(image, {
    columns,
    rows,
    page: Math.max(1, Math.floor(Number(payload.sourcePage || 1))),
  });
  sendJson(response, 200, { rowColorAnalysis: analysis });
}

async function assistTicketReview(request, response) {
  const config = getProviderConfig();
  if (getActiveProvider() !== "aliyun") {
    sendJson(response, 400, { error: "Ticket review assist currently requires Aliyun provider", message: "票源校对 AI 辅助当前请使用阿里云百炼。" });
    return;
  }
  if (!process.env[config.keyName]) {
    sendJson(response, 501, { error: `${config.keyName} is not configured`, message: `未配置阿里云百炼密钥。请在 .env 里设置 ${config.keyName}。` });
    return;
  }
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const source = String(payload.source || "");
  const sourcePage = Math.max(1, Number(payload.sourcePage || 1));
  const columns = Array.isArray(payload.columns) ? payload.columns : [];
  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  const instruction = String(payload.instruction || "");
  if (!source.startsWith("data:image/") && !source.startsWith("data:application/pdf")) {
    sendJson(response, 400, { error: "Missing source data URL", message: "原图/PDF 数据不可用，请重新上传后再使用 AI 辅助。" });
    return;
  }
  if (!rows.length) {
    sendJson(response, 400, { error: "Missing rows", message: "当前表没有可供 AI 判断的识别行。" });
    return;
  }

  let image = source;
  if (source.startsWith("data:application/pdf")) {
    image = await renderPdfPageToImage(source, sourcePage);
  }
  if (!image) {
    sendJson(response, 422, { error: "No page image rendered", message: "PDF 页面渲染失败，无法生成 AI 校对建议。" });
    return;
  }

  const prompt = buildTicketReviewAssistPrompt({ instruction, columns, rows, page: sourcePage });
  const text = await recognizeImageTextWithAliyun(image, prompt);
  const decisions = parseReviewAssistDecisions(text);
  sendJson(response, 200, { decisions, raw: text, model: config.model, provider: getActiveProvider(), providerName: config.name });
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
  const maxPages = Number(payload.maxPages || 0) > 0 ? getRequestedTicketOcrPages(payload.maxPages, Number(payload.maxPages)) : null;
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
    failedImages: {},
    message: "已加入批量识别队列。",
    createdAt: Date.now(),
    finishedAt: null,
  };
  ticketOcrJobs.set(id, job);
  runTicketOcrBatch(job, file, maxPages);
  sendJson(response, 202, publicTicketOcrJob(job));
}

async function retryFailedTicketOcrJob(request, response) {
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const id = String(payload.id || "");
  const job = id ? ticketOcrJobs.get(id) : null;
  if (!job) {
    sendJson(response, 404, { error: "OCR job not found", message: "没有找到这个识别任务，可能已经过期，请重新上传。" });
    return;
  }
  if (job.status === "running" || job.status === "queued") {
    sendJson(response, 409, { error: "OCR job is still running", message: "当前识别任务还没结束，请等全部扫描结束后再重试失败页。" });
    return;
  }
  if (!job.errors.length) {
    sendJson(response, 200, publicTicketOcrJob(job));
    return;
  }
  retryTicketOcrFailedPages(job).catch((error) => {
    job.status = "error";
    job.message = formatErrorMessage(error);
  });
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

function readSeatmapTemplateFiles() {
  if (!fs.existsSync(seatmapTemplateDir)) return [];
  return fs
    .readdirSync(seatmapTemplateDir)
    .filter((fileName) => fileName.toLowerCase().endsWith(".json"))
    .flatMap((fileName) => {
      const filePath = path.join(seatmapTemplateDir, fileName);
      try {
        const template = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return [{ ...template, sourceFile: fileName }];
      } catch (error) {
        console.error(`Seatmap template skipped: ${fileName}`, error.message || error);
        return [];
      }
    });
}

function sendSeatmapTemplates(response) {
  sendJson(response, 200, { templates: readSeatmapTemplateFiles() });
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
  if (request.method === "GET" && request.url === "/api/seatmap/templates") {
    sendSeatmapTemplates(response);
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
  if (request.method === "POST" && request.url === "/api/source/save") {
    saveSourceFile(request, response).catch((error) => {
      console.error("Source save failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
    });
    return;
  }
  if (request.method === "POST" && request.url === "/api/spreadsheet/preview") {
    parseSpreadsheetPreview(request, response).catch((error) => {
      console.error("Spreadsheet preview failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
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
  if (request.method === "POST" && request.url === "/api/tables/analyze-row-colors") {
    analyzeTicketRowColors(request, response).catch((error) => {
      console.error("Ticket row-color analysis failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
    });
    return;
  }
  if (request.method === "POST" && request.url === "/api/tables/analyze-row-colors-ai") {
    analyzeTicketRowColorsAi(request, response).catch((error) => {
      console.error("Ticket AI row-color analysis failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
    });
    return;
  }
  if (request.method === "POST" && request.url === "/api/tables/review-assist") {
    assistTicketReview(request, response).catch((error) => {
      console.error("Ticket review assist failed", error);
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
  if (request.method === "POST" && request.url === "/api/tables/recognize/retry-failed") {
    retryFailedTicketOcrJob(request, response).catch((error) => {
      console.error("Ticket table OCR failed-pages retry failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
    });
    return;
  }
  serveStatic(request, response);
});

server.listen(port, host, () => {
  console.log(`Ticket demo running at http://localhost:${port}/`);
});
