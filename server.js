const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const tls = require("tls");
const os = require("os");
const { execFile, spawn } = require("child_process");

const root = __dirname;
const depsRoot = "/Users/macbook/.cache/codex-runtimes/codex-primary-runtime/dependencies";
const bundledPdftoppmPath = path.join(depsRoot, "bin", "pdftoppm");
const bundledPdfinfoPath = path.join(depsRoot, "bin", "pdfinfo");
const pdftoppmPath = process.env.PDFTOPPM_PATH || (fs.existsSync(bundledPdftoppmPath) ? bundledPdftoppmPath : "pdftoppm");
const pdfinfoPath = process.env.PDFINFO_PATH || (fs.existsSync(bundledPdfinfoPath) ? bundledPdfinfoPath : "pdfinfo");
const nodeModuleRoot = path.join(depsRoot, "node", "node_modules");
const pythonPath = process.env.PYTHON || "/usr/bin/python3";
const rowColorScriptPath = path.join(root, "tools", "detect_ticket_row_colors.py");
const pdfRowColorScriptPath = path.join(root, "tools", "detect_pdf_row_colors.py");
const ppStructureScriptPath = path.join(root, "tools", "analyze_ppstructure_table.py");
const ticketRowAnchorColorScriptPath = path.join(root, "tools", "analyze_ticket_row_anchor_colors.py");
const depsPythonPath = path.join(depsRoot, "python", "bin", "python3");
const localPaddlePythonPath = path.join(root, "tmp", "paddleocr-eval", "venv", "bin", "python");
const seatmapTemplateDir = path.join(root, "seatmap-templates");
const uploadSourceDir = path.join(root, "uploads");
const uploadBackupDir = path.join(os.homedir(), ".ticket-admin-source-cache");
const ticketOcrJobs = new Map();

function loadSharp() {
  try {
    return require(path.join(nodeModuleRoot, "sharp"));
  } catch {
    return require("sharp");
  }
}

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
const aiRequestTimeoutSeconds = Math.max(25, readPositiveIntegerEnv("AI_REQUEST_TIMEOUT_SECONDS", 180));
const ocrCompletenessCheckEnabled = process.env.TICKET_OCR_COMPLETENESS_CHECK === "1";
const ocrRowColorDuringScanEnabled = process.env.TICKET_OCR_ROW_COLOR_DURING_SCAN === "1";
const ocrPpStructureDuringScanEnabled = process.env.TICKET_OCR_PPSTRUCTURE_DURING_SCAN === "1";
const rowColorLogicVersion = 77;
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

function readRawBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > 220 * 1024 * 1024) {
        reject(new Error("Payload too large"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks)));
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

function runFileWithTimeout(command, args, timeout) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { timeout, maxBuffer: 50 * 1024 * 1024 }, (error, stdout, stderr) => {
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
    .replace(/[^\w-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "source";
}

function decodeHeaderValue(value, fallback = "") {
  try {
    return decodeURIComponent(String(value || fallback));
  } catch {
    return String(value || fallback);
  }
}

function ensureUploadStorageDirs() {
  fs.mkdirSync(uploadSourceDir, { recursive: true });
  fs.mkdirSync(uploadBackupDir, { recursive: true });
}

function getUploadBackupPath(fileName) {
  return path.join(uploadBackupDir, path.basename(String(fileName || "")));
}

function isReadableSavedFile(filePath) {
  try {
    if (!filePath || !fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;
    return stat.size > 1024;
  } catch {
    return false;
  }
}

function getReadableUploadPath(sourceUrl) {
  if (!String(sourceUrl || "").startsWith("uploads/")) return null;
  const fileName = path.basename(sourceUrl);
  const sourcePath = path.resolve(uploadSourceDir, fileName);
  const uploadRoot = path.resolve(uploadSourceDir);
  if (!sourcePath.startsWith(`${uploadRoot}${path.sep}`)) return null;
  const backupPath = getUploadBackupPath(fileName);
  if (isReadableSavedFile(backupPath)) return backupPath;
  if (isReadableSavedFile(sourcePath)) return sourcePath;
  return null;
}

async function saveSourceFile(request, response) {
  const contentType = String(request.headers["content-type"] || "");
  let mimeType = contentType.split(";")[0] || "application/octet-stream";
  let buffer;
  let fileName = decodeHeaderValue(request.headers["x-file-name"], "source");
  if (contentType.includes("application/json")) {
    const raw = await readBody(request);
    const payload = JSON.parse(raw || "{}");
    const parsed = dataUrlToBuffer(payload.file || payload.dataUrl || "");
    mimeType = parsed.mimeType;
    buffer = parsed.buffer;
    fileName = String(payload.fileName || "source");
  } else {
    buffer = await readRawBody(request);
    mimeType = String(request.headers["x-file-type"] || mimeType || getMimeForExtension(fileName));
  }
  if (!buffer?.length) {
    sendJson(response, 400, { error: "Missing file", message: "没有读到上传文件，请重新选择。" });
    return;
  }
  ensureUploadStorageDirs();
  const savedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFileStem(fileName)}${getExtensionForMime(mimeType, fileName)}`;
  const filePath = path.join(uploadSourceDir, savedName);
  const backupPath = getUploadBackupPath(savedName);
  fs.writeFileSync(filePath, buffer);
  fs.writeFileSync(backupPath, buffer);
  sendJson(response, 200, {
    url: `uploads/${savedName}`,
    fileName: savedName,
    mimeType,
    size: buffer.length,
    backup: true,
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
  const python = fs.existsSync(depsPythonPath) ? depsPythonPath : pythonPath;
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

async function requestJson(url, payload, headers = {}) {
  if (!proxyAgent) return requestJsonDirect(url, payload, headers);
  try {
    return await requestJsonViaCurl(url, payload, headers);
  } catch (error) {
    if (getActiveProvider() !== "aliyun") throw error;
    console.warn(`Aliyun proxy request failed, retrying direct: ${error.message || error}`);
    return requestJsonDirect(url, payload, headers);
  }
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
    request.setTimeout(aiRequestTimeoutSeconds * 1000, () => request.destroy(new Error(`连接 ${target.hostname} 超时，请检查网络或稍后重试。`)));
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
      "--http1.1",
      "--max-time",
      String(aiRequestTimeoutSeconds),
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
    "韩文座位词请按中文字段理解：구역/구=区/区域，열=排，층=层，번/호/입장번호=座位号或入场号。例如 101구역 P열 -> 区域 101、排 P；1층 10구역 15열 1x번 -> 区域 10、排 15、座位号 1x、备注 1层；Floor층 EXO구역 입장번호 2x번 -> 区域 EXO、座位号 2x、备注 Floor层/入场号；II1구역 2열 -> 区域 I1、排 2。",
    "如果任何可见单元格包含韩文座位信息，例如 층、구역、구、열、번、호、입장번호，必须把这整格韩文原文输出到原来的列里；即使不确定含义，也不能省略、不能留空、不能只输出 VIP 和价格。",
    "韩文位置格常出现在“位置/票面/座位/区域/备注”列，例如“1층 10구역 15열 1x번”“Floor층 are구역 입장번호15x번”。必须照抄原文，后台会自动翻译拆分；不要在 OCR 阶段把韩文翻译后替换原文。",
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
  return getPdfPageCountFromPath(pdfPath)
    .finally(() => fs.rm(tempDir, { recursive: true, force: true }, () => {}));
}

async function getPdfPageCountFromPath(pdfPath) {
  const { stdout } = await runFile(pdfinfoPath, [pdfPath]);
  const match = stdout.match(/^Pages:\s*(\d+)/m);
  return Math.max(1, Number(match?.[1] || 1));
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
    const sharp = loadSharp();
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
    const sharp = loadSharp();
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

async function renderPdfPagePathToImage(pdfPath, pageNumber = 1) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-pdf-page-"));
  const safePdfPath = path.join(tempDir, "source.pdf");
  const outputPrefix = path.join(tempDir, "page");
  const page = Math.max(1, Math.floor(Number(pageNumber) || 1));
  try {
    if (!isReadableSavedFile(pdfPath)) {
      throw new Error(`PDF 原文件不可读，无法渲染第 ${page} 页。`);
    }
    fs.copyFileSync(pdfPath, safePdfPath);
    await runFileWithTimeout(pdftoppmPath, ["-jpeg", "-r", "150", "-f", String(page), "-l", String(page), safePdfPath, outputPrefix], 180000);
    const sharp = loadSharp();
    const file = fs
      .readdirSync(tempDir)
      .filter((name) => /^page-\d+\.jpg$/.test(name))
      .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))[0];
    if (!file) throw new Error(`PDF 第 ${page} 页没有渲染出图片。`);
    const compressed = await sharp(path.join(tempDir, file)).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
    return `data:image/jpeg;base64,${compressed.toString("base64")}`;
  } catch (error) {
    const detail = formatErrorMessage(error);
    throw new Error(`PDF 第 ${page} 页渲染失败：${detail}`);
  } finally {
    fs.rm(tempDir, { recursive: true, force: true }, () => {});
  }
}

async function cropImageDataUrl(imageDataUrl, { topRatio = 0.45, heightRatio = 0.55 } = {}) {
  const { buffer } = dataUrlToBuffer(imageDataUrl);
  const sharp = loadSharp();
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

function parseRecognizedRowsForAiRowColor(text) {
  const cleaned = cleanRecognizedTableText([stripRecognizedColorColumns(text)]);
  const pageColumns = [];
  const rows = [];
  cleaned.split(/\n\s*\n/).forEach((block) => {
    const lines = String(block || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !/^-{2,}\s*PDF\s*第\s*\d+\s*页\s*-{2,}$/i.test(line));
    if (lines.length < 1) return;
    const firstCells = splitRecognizedTableLine(lines[0]).map((cell) => cell.trim());
    const firstLineIsData = looksLikeRecognizedDataCells(firstCells);
    const columns = firstLineIsData ? firstCells.map((_, index) => `列${index + 1}`) : firstCells;
    if (!pageColumns.length && columns.length) pageColumns.push(...columns);
    lines.slice(firstLineIsData ? 0 : 1).forEach((line) => {
      const cells = splitRecognizedTableLine(line).map((cell) => cell.trim());
      if (cells.some(Boolean)) rows.push(cells);
    });
  });
  return { columns: pageColumns, rows };
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
      imageWidth: Number(parsed.imageWidth || 0),
      imageHeight: Number(parsed.imageHeight || 0),
      expectedRows: Number(parsed.expectedRows || expectedRows || 0),
      detectedRows: Number(parsed.detectedRows || 0),
      selectionMode: parsed.selectionMode || "",
      reliable: Boolean(parsed.reliable),
      exactRowAligned: parsed.exactRowAligned === true,
      contiguous: Boolean(parsed.contiguous),
      maxRowGap: Number(parsed.maxRowGap || 0),
      lowConfidenceRows: Array.isArray(parsed.lowConfidenceRows) ? parsed.lowConfidenceRows : [],
      unreliableReasons: Array.isArray(parsed.unreliableReasons) ? parsed.unreliableReasons : [],
      warningReasons: Array.isArray(parsed.warningReasons) ? parsed.warningReasons : [],
      labels: Array.isArray(parsed.labels) ? parsed.labels : [],
      rowActionTextRows: Array.isArray(parsed.rowActionTextRows) ? parsed.rowActionTextRows : [],
      rows: Array.isArray(parsed.rows) ? parsed.rows : [],
      error: parsed.error || "",
    };
  } catch (error) {
    return { source: "opencv", reliable: false, error: formatErrorMessage(error), rows: [] };
  } finally {
    fs.rm(tempDir, { recursive: true, force: true }, () => {});
  }
}

async function analyzeTicketRowColorsFromPdfPath(pdfPath, page, expectedRows) {
  if (!fs.existsSync(pdfRowColorScriptPath)) {
    return { source: "pdf_vector", reliable: false, error: "PDF 原始颜色脚本不存在", rows: [] };
  }
  const python = fs.existsSync(depsPythonPath) ? depsPythonPath : pythonPath;
  try {
    const { stdout } = await runFile(python, [
      pdfRowColorScriptPath,
      pdfPath,
      "--page",
      String(Math.max(1, Math.floor(Number(page || 1)))),
      "--expected-rows",
      String(expectedRows || 0),
    ]);
    const parsed = JSON.parse(stdout || "{}");
    return {
      source: "pdf_vector",
      imageWidth: Number(parsed.imageWidth || 0),
      imageHeight: Number(parsed.imageHeight || 0),
      expectedRows: Number(parsed.expectedRows || expectedRows || 0),
      detectedRows: Number(parsed.detectedRows || 0),
      selectionMode: parsed.selectionMode || "",
      reliable: Boolean(parsed.reliable),
      exactRowAligned: parsed.exactRowAligned === true,
      contiguous: Boolean(parsed.contiguous),
      maxRowGap: Number(parsed.maxRowGap || 0),
      lowConfidenceRows: Array.isArray(parsed.lowConfidenceRows) ? parsed.lowConfidenceRows : [],
      unreliableReasons: Array.isArray(parsed.unreliableReasons) ? parsed.unreliableReasons : [],
      warningReasons: Array.isArray(parsed.warningReasons) ? parsed.warningReasons : [],
      labels: Array.isArray(parsed.labels) ? parsed.labels : [],
      rows: Array.isArray(parsed.rows) ? parsed.rows : [],
      error: parsed.error || "",
    };
  } catch (error) {
    return { source: "pdf_vector", reliable: false, error: formatErrorMessage(error), rows: [] };
  }
}

async function analyzeTicketRowColorsFromPdfDataUrl(pdfDataUrl, page, expectedRows) {
  const { buffer } = dataUrlToBuffer(pdfDataUrl);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-pdf-row-color-"));
  const pdfPath = path.join(tempDir, "source.pdf");
  fs.writeFileSync(pdfPath, buffer);
  try {
    return await analyzeTicketRowColorsFromPdfPath(pdfPath, page, expectedRows);
  } finally {
    fs.rm(tempDir, { recursive: true, force: true }, () => {});
  }
}

async function analyzeTicketAnchorRowColorsFromDataUrl(imageDataUrl, rows, columns = []) {
  if (!fs.existsSync(ticketRowAnchorColorScriptPath)) {
    return { source: "ticket_row_anchor", reliable: false, autoApplyAllowed: false, error: "票行锚点取色脚本不存在。", rows: [] };
  }
  const { mimeType, buffer } = dataUrlToBuffer(imageDataUrl);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-row-anchor-color-"));
  const imagePath = path.join(tempDir, `page${getExtensionForMime(mimeType, "page.jpg")}`);
  fs.writeFileSync(imagePath, buffer);
  try {
    const { stdout } = await runFileWithTimeout(
      getPpStructurePythonPath(),
      [
        ticketRowAnchorColorScriptPath,
        imagePath,
        "--rows-json",
        JSON.stringify(Array.isArray(rows) ? rows : []),
        "--columns-json",
        JSON.stringify(Array.isArray(columns) ? columns : []),
      ],
      90000,
    );
    const parsed = JSON.parse(stdout || "{}");
    return {
      source: "ticket_row_anchor",
      expectedRows: Number(parsed.expectedRows || 0),
      imageWidth: Number(parsed.imageWidth || 0),
      imageHeight: Number(parsed.imageHeight || 0),
      detectedRows: Number(parsed.matchedRows || 0),
      matchedRows: Number(parsed.matchedRows || 0),
      selectionMode: parsed.selectionMode || "ocr_text_anchor_center_band",
      reliable: parsed.reliable === true,
      exactRowAligned: parsed.exactRowAligned === true,
      contiguous: parsed.reliable === true,
      autoApplyAllowed: parsed.autoApplyAllowed === true,
      rowGeometryVerified: parsed.exactRowAligned === true,
      rowTextVerified: parsed.reliable === true,
      rows: Array.isArray(parsed.rows) ? parsed.rows : [],
      visualRows: Array.isArray(parsed.visualRows) ? parsed.visualRows.slice(0, 80) : [],
      unreliableReasons: parsed.reliable === true ? [] : ["ticket_row_anchor_not_fully_matched"],
      warningReasons: [],
      error: parsed.error || "",
      initSeconds: parsed.initSeconds,
      inferSeconds: parsed.inferSeconds,
    };
  } catch (error) {
    return { source: "ticket_row_anchor", reliable: false, autoApplyAllowed: false, error: formatErrorMessage(error), rows: [] };
  } finally {
    fs.rm(tempDir, { recursive: true, force: true }, () => {});
  }
}

async function analyzeTicketAnchorRowColorsBatch(payload, tables = []) {
  if (!fs.existsSync(ticketRowAnchorColorScriptPath)) {
    return { error: "票行锚点取色脚本不存在。", rowColorAnalyses: {} };
  }
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-row-anchor-color-batch-"));
  try {
    const batch = [];
    for (const table of tables) {
      const page = Math.max(1, Math.floor(Number(table?.sourcePage || 1)));
      const rows = Array.isArray(table?.rows) ? table.rows : [];
      if (!rows.length || rows.length > 80) continue;
      const image = await resolveRowColorSourceImage({ ...payload, sourcePage: page });
      const { mimeType, buffer } = dataUrlToBuffer(image);
      const imagePath = path.join(tempDir, `page-${page}${getExtensionForMime(mimeType, ".jpg")}`);
      fs.writeFileSync(imagePath, buffer);
      batch.push({
        page,
        image: imagePath,
        columns: Array.isArray(table?.columns) ? table.columns : [],
        rows,
      });
    }
    if (!batch.length) return { rowColorAnalyses: {} };
    const { stdout } = await runFileWithTimeout(
      getPpStructurePythonPath(),
      [ticketRowAnchorColorScriptPath, "--batch-json", JSON.stringify(batch)],
      Math.max(120000, batch.length * 25000),
    );
    const parsed = JSON.parse(stdout || "{}");
    const rowColorAnalyses = {};
    (Array.isArray(parsed.results) ? parsed.results : []).forEach((analysis) => {
      const page = Math.max(1, Math.floor(Number(analysis?.page || 1)));
      rowColorAnalyses[String(page)] = {
        source: "ticket_row_anchor",
        expectedRows: Number(analysis.expectedRows || 0),
        imageWidth: Number(analysis.imageWidth || 0),
        imageHeight: Number(analysis.imageHeight || 0),
        detectedRows: Number(analysis.matchedRows || 0),
        matchedRows: Number(analysis.matchedRows || 0),
        selectionMode: analysis.selectionMode || "ocr_text_anchor_center_band",
        reliable: analysis.reliable === true,
        exactRowAligned: analysis.exactRowAligned === true,
        contiguous: analysis.reliable === true,
        autoApplyAllowed: analysis.autoApplyAllowed === true,
        rowGeometryVerified: analysis.exactRowAligned === true,
        rowTextVerified: analysis.reliable === true,
        rows: Array.isArray(analysis.rows) ? analysis.rows : [],
        visualRows: Array.isArray(analysis.visualRows) ? analysis.visualRows.slice(0, 80) : [],
        unreliableReasons: analysis.reliable === true ? [] : ["ticket_row_anchor_not_fully_matched"],
        warningReasons: [],
        error: analysis.error || "",
        initSeconds: parsed.initSeconds,
        inferSeconds: analysis.inferSeconds,
      };
    });
    return { rowColorAnalyses, initSeconds: parsed.initSeconds, count: Number(parsed.count || batch.length) };
  } finally {
    fs.rm(tempDir, { recursive: true, force: true }, () => {});
  }
}

function getPpStructurePythonPath() {
  if (process.env.PADDLEOCR_PYTHON) return process.env.PADDLEOCR_PYTHON;
  if (fs.existsSync(localPaddlePythonPath)) return localPaddlePythonPath;
  return pythonPath;
}

async function analyzePpStructureImageFile(imagePath) {
  if (!fs.existsSync(ppStructureScriptPath)) {
    return { source: "paddle_ppstructure", error: "PP-Structure 分析脚本不存在。" };
  }
  const { stdout } = await runFileWithTimeout(getPpStructurePythonPath(), [ppStructureScriptPath, imagePath], 180000);
  return JSON.parse(stdout || "{}");
}

async function analyzePpStructureImageDataUrl(imageDataUrl) {
  const { mimeType, buffer } = dataUrlToBuffer(imageDataUrl);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-ppstructure-image-"));
  const imagePath = path.join(tempDir, `page${getExtensionForMime(mimeType, "page.jpg")}`);
  fs.writeFileSync(imagePath, buffer);
  try {
    return await analyzePpStructureImageFile(imagePath);
  } finally {
    fs.rm(tempDir, { recursive: true, force: true }, () => {});
  }
}

async function analyzePpStructurePdfPath(pdfPath, page) {
  const imageDataUrl = await renderPdfPagePathToImage(pdfPath, page);
  if (!imageDataUrl) {
    return { source: "paddle_ppstructure", error: "PDF 页面渲染失败，无法做 PP-Structure 测试。" };
  }
  return analyzePpStructureImageDataUrl(imageDataUrl);
}

async function analyzeTicketPpStructure(request, response) {
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const page = Math.max(1, Math.floor(Number(payload.page || 1)));
  const sourceUrl = String(payload.sourceUrl || "");
  const image = String(payload.image || payload.file || (sourceUrl.startsWith("data:") ? sourceUrl : ""));
  const columns = Array.isArray(payload.columns) ? payload.columns : [];
  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  const startedAt = Date.now();
  let result;
  if (sourceUrl.startsWith("uploads/")) {
    const sourcePath = getReadableUploadPath(sourceUrl);
    if (!sourcePath) {
      sendJson(response, 404, { error: "Source file not found", message: "找不到已上传的原始文件，请重新上传票源 PDF。" });
      return;
    }
    if (getMimeForExtension(sourcePath) === "application/pdf") {
      result = await analyzePpStructurePdfPath(sourcePath, page);
    } else {
      result = await analyzePpStructureImageFile(sourcePath);
    }
  } else if (image.startsWith("data:application/pdf")) {
    const rendered = await renderPdfPageToImage(image, page);
    if (!rendered) {
      sendJson(response, 422, { error: "No page image rendered", message: "PDF 页面渲染失败，无法做 PP-Structure 测试。" });
      return;
    }
    result = await analyzePpStructureImageDataUrl(rendered);
  } else if (image.startsWith("data:image/")) {
    result = await analyzePpStructureImageDataUrl(image);
  } else {
    sendJson(response, 400, { error: "Missing source", message: "请传 sourceUrl、PDF dataURL 或图片 dataURL。" });
    return;
  }
  const status = result?.error ? 500 : 200;
  const ticketRowMatches = rows.length ? matchTicketRowsToPpStructure(columns, rows, result) : [];
  if (ticketRowMatches.length) {
    result.ticketRowMatches = ticketRowMatches;
    result.ticketAlignedRowColorAnalysis = buildTicketAlignedPpRowColorAnalysis(ticketRowMatches, rows.length);
  }
  sendJson(response, status, {
    ...result,
    page,
    elapsedMs: Date.now() - startedAt,
    ppStructurePython: getPpStructurePythonPath(),
  });
}

function publicPpStructureAnalysis(analysis) {
  if (!analysis || typeof analysis !== "object") return null;
  const rowColorAnalysis = analysis.rowColorAnalysis
    ? {
        source: analysis.rowColorAnalysis.source || "paddle_ppstructure",
        expectedRows: Number(analysis.rowColorAnalysis.expectedRows || 0),
        detectedRows: Number(analysis.rowColorAnalysis.detectedRows || 0),
        selectionMode: analysis.rowColorAnalysis.selectionMode || "",
        reliable: analysis.rowColorAnalysis.reliable === true,
        exactRowAligned: analysis.rowColorAnalysis.exactRowAligned === true,
        unreliableReasons: Array.isArray(analysis.rowColorAnalysis.unreliableReasons) ? analysis.rowColorAnalysis.unreliableReasons : [],
        warningReasons: Array.isArray(analysis.rowColorAnalysis.warningReasons) ? analysis.rowColorAnalysis.warningReasons : [],
      }
    : null;
  return {
    source: analysis.source || "paddle_ppstructure",
    error: analysis.error || "",
    imageWidth: analysis.imageWidth || 0,
    imageHeight: analysis.imageHeight || 0,
    initSeconds: analysis.initSeconds || 0,
    inferSeconds: analysis.inferSeconds || 0,
    tableCount: analysis.tableCount || 0,
    tables: Array.isArray(analysis.tables)
      ? analysis.tables.map((table) => ({
          bbox: table.bbox || null,
          rowCount: table.rowCount || 0,
          cellCount: table.cellCount || 0,
          cellBBoxCount: table.cellBBoxCount || 0,
          ocrBoxCount: table.ocrBoxCount || 0,
          htmlCellCount: table.htmlCellCount || 0,
          cellAlignmentExact: table.cellAlignmentExact === true,
        }))
      : [],
    rowColorAnalysis,
    ticketRowMatches: Array.isArray(analysis.ticketRowMatches) ? analysis.ticketRowMatches : [],
    ticketAlignedRowColorAnalysis: analysis.ticketAlignedRowColorAnalysis || null,
  };
}

function normalizeTicketMatchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[￥¥₩$,，]/g, "")
    .replace(/[（）()[\]{}]/g, " ")
    .replace(/[~～至—–-]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTicketMatchTokens(value) {
  const text = normalizeTicketMatchText(value);
  const stopWords = new Set([
    "序号",
    "编号",
    "日期",
    "区域",
    "排数",
    "座位",
    "座位号",
    "范围",
    "价格",
    "售价",
    "备注",
    "配送",
    "转寄",
    "现场",
    "面取",
    "sold",
  ]);
  return (text.match(/[a-z]{1,4}\d{0,4}|\d{1,6}|[\u4e00-\u9fa5]{1,8}/gi) || [])
    .map((token) => normalizeTicketMatchText(token))
    .filter((token) => token && !stopWords.has(token));
}

function extractTicketPriceTokens(value) {
  return (normalizeTicketMatchText(value).match(/\d{3,6}/g) || []).filter((token) => Number(token) >= 100);
}

function extractTicketDateTokens(value) {
  const text = normalizeTicketMatchText(value);
  const tokens = [];
  const fullDates = text.match(/20\d{2}[.\/-]?\d{1,2}[.\/-]?\d{1,2}/g) || [];
  fullDates.forEach((token) => tokens.push(token.replace(/[.\/-]/g, "")));
  const shortDates = text.match(/\d{1,2}[.\/月-]\d{1,2}日?/g) || [];
  shortDates.forEach((token) => tokens.push(token.replace(/[.\/月日-]/g, "")));
  return tokens;
}

function normalizeRowColorLabel(value) {
  const text = String(value || "").trim().toLowerCase().replace(/\s+/g, "");
  if (!text) return "";
  if (/白|white/.test(text)) return "白底";
  if (/红|赤|red/.test(text)) return "红底";
  if (/橙|orange/.test(text)) return "橙底";
  if (/黄|yellow/.test(text)) return "黄底";
  if (/绿|green/.test(text)) return "绿底";
  if (/蓝|blue/.test(text)) return "蓝底";
  if (/紫|purple/.test(text)) return "紫底";
  if (/粉|pink/.test(text)) return "粉底";
  if (/灰|gray|grey/.test(text)) return "灰底";
  if (/黑|black/.test(text)) return "黑底";
  return value;
}

function getPpStructureRowsForMatching(analysis) {
  if (!analysis || typeof analysis !== "object") return [];
  const rows = [];
  (Array.isArray(analysis.tables) ? analysis.tables : []).forEach((table, tableIndex) => {
    (Array.isArray(table.rows) ? table.rows : []).forEach((row) => {
      rows.push({
        tableIndex,
        rowIndex: Number(row.rowIndex),
        text: String(row.text || ""),
        bbox: row.bbox || null,
        color: row.color || null,
      });
    });
  });
  return rows;
}

function rowLooksLikeTicketData(text) {
  const normalized = normalizeTicketMatchText(text);
  const headerHits = (normalized.match(/序号|编号|日期|区域|排数|座位|价格|售价|备注/g) || []).length;
  const priceHits = extractTicketPriceTokens(normalized).length;
  const tokenHits = extractTicketMatchTokens(normalized).length;
  return priceHits > 0 && tokenHits >= 2 && headerHits < 3;
}

function scoreTicketRowAgainstPpRow(ticketRow, ppRow) {
  const ticketText = Array.isArray(ticketRow) ? ticketRow.join(" ") : String(ticketRow || "");
  const ppText = String(ppRow?.text || "");
  const ticketTokens = [...new Set(extractTicketMatchTokens(ticketText))];
  const ppTokens = new Set(extractTicketMatchTokens(ppText));
  const ticketPrices = extractTicketPriceTokens(ticketText);
  const ppPrices = new Set(extractTicketPriceTokens(ppText));
  const ticketDates = extractTicketDateTokens(ticketText);
  const ppDates = new Set(extractTicketDateTokens(ppText));
  const matchedTokens = ticketTokens.filter((token) => ppTokens.has(token));
  const tokenScore = ticketTokens.length ? matchedTokens.length / ticketTokens.length : 0;
  const priceMatched = ticketPrices.length ? ticketPrices.some((price) => ppPrices.has(price)) : false;
  const dateMatched = ticketDates.length ? ticketDates.some((date) => ppDates.has(date)) : true;
  const exactCellMatches = (Array.isArray(ticketRow) ? ticketRow : [ticketText]).filter((cell) => {
    const normalized = normalizeTicketMatchText(cell);
    return normalized.length >= 2 && normalizeTicketMatchText(ppText).includes(normalized);
  }).length;
  let score = 0;
  score += Math.min(0.45, tokenScore * 0.45);
  if (priceMatched) score += 0.35;
  if (ticketDates.length && dateMatched) score += 0.1;
  score += Math.min(0.1, exactCellMatches * 0.025);
  if (!rowLooksLikeTicketData(ppText)) score -= 0.15;
  return {
    score: Math.max(0, Math.min(1, Number(score.toFixed(3)))),
    matchedTokens,
    priceMatched,
    dateMatched,
  };
}

function matchTicketRowsToPpStructure(columns, rows, ppStructureAnalysis) {
  const ticketRows = Array.isArray(rows) ? rows : [];
  const ppRows = getPpStructureRowsForMatching(ppStructureAnalysis);
  const candidates = [];
  ticketRows.forEach((row, ticketRowIndex) => {
    ppRows.forEach((ppRow, ppRowIndex) => {
      const scored = scoreTicketRowAgainstPpRow(row, ppRow);
      if (scored.score >= 0.45) {
        candidates.push({ ticketRowIndex, ppRowIndex, ppRow, ...scored });
      }
    });
  });
  candidates.sort((a, b) => b.score - a.score);
  const usedTickets = new Set();
  const usedPpRows = new Set();
  const matches = Array.from({ length: ticketRows.length }, (_, ticketRowIndex) => ({
    ticketRowIndex,
    matched: false,
    score: 0,
    confidence: "none",
    reason: "no_ppstructure_row_match",
  }));
  candidates.forEach((candidate) => {
    if (usedTickets.has(candidate.ticketRowIndex) || usedPpRows.has(candidate.ppRowIndex)) return;
    usedTickets.add(candidate.ticketRowIndex);
    usedPpRows.add(candidate.ppRowIndex);
    matches[candidate.ticketRowIndex] = {
      ticketRowIndex: candidate.ticketRowIndex,
      matched: candidate.score >= 0.62,
      score: candidate.score,
      confidence: candidate.score >= 0.82 ? "high" : candidate.score >= 0.62 ? "medium" : "low",
      reason: candidate.score >= 0.62 ? "matched_by_ticket_fields" : "low_score_match",
      ppTableIndex: candidate.ppRow.tableIndex,
      ppRowIndex: candidate.ppRow.rowIndex,
      ppText: candidate.ppRow.text,
      bbox: candidate.ppRow.bbox,
      color: candidate.ppRow.color,
      matchedTokens: candidate.matchedTokens,
      priceMatched: candidate.priceMatched,
      dateMatched: candidate.dateMatched,
      columns: Array.isArray(columns) ? columns : [],
      row: ticketRows[candidate.ticketRowIndex],
    };
  });
  return matches;
}

function buildTicketAlignedPpRowColorAnalysis(matches, expectedRows) {
  const safeMatches = Array.isArray(matches) ? matches : [];
  const totalRows = Math.max(0, Number(expectedRows || safeMatches.length || 0));
  const allRowsHighConfidence =
    totalRows > 0 &&
    safeMatches.length === totalRows &&
    safeMatches.every((match, index) =>
      match?.matched === true &&
      Number(match.ticketRowIndex) === index &&
      Number(match.score || 0) >= 0.82 &&
      normalizeRowColorLabel(match.color?.label || match.color?.rawLabel || ""),
    );
  return {
    source: "paddle_ppstructure",
    expectedRows: totalRows,
    detectedRows: safeMatches.filter((match) => match?.matched).length,
    selectionMode: "ppstructure_ticket_row_match",
    reliable: false,
    exactRowAligned: false,
    contiguous: allRowsHighConfidence,
    autoApplyAllowed: false,
    rowGeometryVerified: false,
    rowTextVerified: allRowsHighConfidence,
    diagnosticOnly: true,
    rows: safeMatches.map((match, index) => {
      const label = normalizeRowColorLabel(match?.color?.label || match?.color?.rawLabel || "");
      return {
        index,
        label,
        rawLabel: label,
        confidence: Math.min(1, Math.max(0, Number(match?.score || 0))),
        coloredRatio: Number(match?.color?.coloredRatio || 0),
        whiteRatio: Number(match?.color?.whiteRatio || 0),
        coverageRatio: Number(match?.color?.coverageRatio || 0),
        strong: Number(match?.score || 0) >= 0.82,
        reason: match?.matched ? "ppstructure_ticket_row_match" : "no_ppstructure_row_match",
        rowTextVerified: match?.matched === true,
        rowGeometryVerified: match?.matched === true,
        matchedText: match?.ppText || "",
        sourceIndex: Number(match?.ppRowIndex ?? index),
        bbox: match?.bbox || null,
      };
    }),
    lowConfidenceRows: safeMatches
      .map((match, index) => (match?.matched === true && Number(match.score || 0) >= 0.82 ? -1 : index))
      .filter((index) => index >= 0),
    unreliableReasons: allRowsHighConfidence ? [] : ["ppstructure_ticket_row_match_not_complete"],
    warningReasons: [],
  };
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
  const aiColorErrors = job.results
    .filter((item) => item.rowColorAnalysis?.aiFallbackError)
    .map((item) => ({
      page: item.page,
      message: item.rowColorAnalysis.aiFallbackError,
    }))
    .sort((a, b) => a.page - b.page);
  const rowColorAnalyses = Object.fromEntries(
    job.results
      .filter((item) => item.rowColorAnalysis)
      .map((item) => [String(item.page), item.rowColorAnalysis]),
  );
  const ppStructureAnalyses = Object.fromEntries(
    job.results
      .filter((item) => item.ppStructureAnalysis)
      .map((item) => [String(item.page), publicPpStructureAnalysis(item.ppStructureAnalysis)]),
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
    aiColorPagesQueued: job.aiColorPagesQueued || 0,
    aiColorPagesProcessed: job.aiColorPagesProcessed || 0,
    aiColorPagesFailed: job.aiColorPagesFailed || 0,
    aiColorErrors,
    ppStructurePagesQueued: job.ppStructurePagesQueued || 0,
    ppStructurePagesProcessed: job.ppStructurePagesProcessed || 0,
    ppStructurePagesFailed: job.ppStructurePagesFailed || 0,
    failedPages,
    errors: job.errors.slice().sort((a, b) => a.page - b.page),
    rowColorAnalyses,
    ppStructureAnalyses,
    partialText: text,
    text: job.status === "done" ? text : "",
    message: job.message,
  };
}

function startTicketRowColorAnalysisForPage(job, item, result) {
  if (!ocrRowColorDuringScanEnabled) return null;
  if (!result?.text || !item?.image) return null;
  const parsed = parseRecognizedRowsForAiRowColor(result.text);
  if (!parsed.rows.length || parsed.rows.length > 80) return null;
  job.aiColorPagesQueued = (job.aiColorPagesQueued || 0) + 1;
  const task = (async () => {
    try {
      const analyzeWithVision = getActiveProvider() === "openai" ? analyzeTicketRowColorsWithOpenAI : analyzeTicketRowColorsWithAliyun;
      const analysis = await analyzeWithVision(item.image, {
        columns: parsed.columns,
        rows: parsed.rows,
        page: item.page,
      });
      result.rowColorAnalysis = {
        ...analysis,
        rowColorLogicVersion,
      };
    } catch (error) {
      result.rowColorAnalysis = {
        source: "ai_row_color",
        reliable: false,
        exactRowAligned: false,
        rows: [],
        expectedRows: parsed.rows.length,
        aiFallbackError: formatErrorMessage(error),
        unreliableReasons: ["ai_during_ocr_failed"],
      };
      job.aiColorPagesFailed = (job.aiColorPagesFailed || 0) + 1;
    } finally {
      job.aiColorPagesProcessed = (job.aiColorPagesProcessed || 0) + 1;
    }
  })();
  job.aiColorTasks.push(task);
  return task;
}

function startTicketPpStructureAnalysisForPage(job, item, result) {
  if (!job.ppStructureEnabled || !result?.text || !item?.image) return null;
  job.ppStructurePagesQueued = (job.ppStructurePagesQueued || 0) + 1;
  const task = (async () => {
    try {
      const analysis = await analyzePpStructureImageDataUrl(item.image);
      const parsedRows = parseRecognizedRowsForAiRowColor(result.text);
      analysis.ticketRowMatches = matchTicketRowsToPpStructure(parsedRows.columns, parsedRows.rows, analysis);
      analysis.ticketAlignedRowColorAnalysis = buildTicketAlignedPpRowColorAnalysis(analysis.ticketRowMatches, parsedRows.rows.length);
      if (analysis?.rowColorAnalysis) {
        analysis.rowColorAnalysis = {
          ...analysis.rowColorAnalysis,
          rowColorLogicVersion,
        };
      }
      result.ppStructureAnalysis = analysis;
    } catch (error) {
      result.ppStructureAnalysis = {
        source: "paddle_ppstructure",
        reliable: false,
        error: formatErrorMessage(error),
        unreliableReasons: ["ppstructure_failed"],
      };
      job.ppStructurePagesFailed = (job.ppStructurePagesFailed || 0) + 1;
    } finally {
      job.ppStructurePagesProcessed = (job.ppStructurePagesProcessed || 0) + 1;
    }
  })();
  job.ppStructureTasks.push(task);
  return task;
}

async function recognizeTicketPageWithRetry(item, job) {
  let lastError = null;
  for (let attempt = 1; attempt <= batchOcrRetries + 1; attempt += 1) {
    try {
      const checked = await recognizeTicketPageTextWithCompletenessCheck(item);
      const text = checked.text;
      return { page: item.page, text, attempts: attempt, recognizedRows: checked.recognizedRows };
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

async function runTicketOcrBatch(job, source, maxPages) {
  let pdfVectorTempDir = "";
  try {
    pdfVectorTempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-ocr-pdf-vector-"));
    const pdfVectorPath = path.join(pdfVectorTempDir, "source.pdf");
    if (source.sourcePath) {
      job.sourcePath = source.sourcePath;
      fs.copyFileSync(source.sourcePath, pdfVectorPath);
    } else {
      const { buffer } = dataUrlToBuffer(source.dataUrl);
      fs.writeFileSync(pdfVectorPath, buffer);
    }
    job.totalPages = await getPdfPageCountFromPath(pdfVectorPath).catch(() => Number(maxPages) || 1);
    const requestedPages = Number.isFinite(Number(maxPages)) && Number(maxPages) > 0 ? Number(maxPages) : job.totalPages;
    const pagesToRender = getRequestedTicketOcrPages(Math.min(requestedPages, job.totalPages), job.totalPages);
    job.pagesQueued = pagesToRender;
    const limitText = pagesToRender < job.totalPages ? formatTicketOcrPageLimit() : "";
    job.message = `正在逐页读取 PDF，共 ${pagesToRender}/${job.totalPages} 页${limitText}...`;
    const pages = Array.from({ length: pagesToRender }, (_, index) => index + 1);
    let cursor = 0;
    job.status = "running";
    job.message = `正在批量识别 0/${pages.length} 页...`;
    job.aiColorTasks = [];
    job.aiColorPagesQueued = 0;
    job.aiColorPagesProcessed = 0;
    job.aiColorPagesFailed = 0;
    job.ppStructureTasks = [];
    job.ppStructurePagesQueued = 0;
    job.ppStructurePagesProcessed = 0;
    job.ppStructurePagesFailed = 0;
    const workers = Array.from({ length: Math.min(batchOcrConcurrency, pages.length) }, async () => {
      while (cursor < pages.length) {
        const page = pages[cursor];
        cursor += 1;
        let image = "";
        try {
          image = await renderPdfPagePathToImage(pdfVectorPath, page);
          if (!image) throw new Error("PDF 页面渲染失败，请换一个 PDF 再试。");
          const item = { page, image, pdfPath: pdfVectorPath };
          const result = await recognizeTicketPageWithRetry(item, job);
          if (result.text) {
            job.results.push(result);
            startTicketRowColorAnalysisForPage(job, item, result);
            startTicketPpStructureAnalysisForPage(job, item, result);
          }
        } catch (error) {
          if (image) job.failedImages[page] = image;
          job.errors.push({ page, stage: image ? "ocr" : "render", message: formatErrorMessage(error) });
        } finally {
          job.pagesProcessed += 1;
          const success = job.results.filter((result) => result.text).length;
          const failed = job.errors.length;
          const aiQueued = job.aiColorPagesQueued || 0;
          const aiDone = job.aiColorPagesProcessed || 0;
          job.message = `正在批量识别 ${job.pagesProcessed}/${pages.length} 页，已读到 ${success} 页，AI 已复核 ${aiDone}/${aiQueued} 页${failed ? `，失败 ${failed} 页` : ""}...`;
        }
      }
    });
    await Promise.all(workers);
    if (job.aiColorTasks.length) {
      job.message = `OCR 已完成，正在等待 AI 逐行底色复核 ${job.aiColorPagesProcessed || 0}/${job.aiColorPagesQueued || 0} 页...`;
      await Promise.allSettled(job.aiColorTasks);
    }
    if (job.ppStructureTasks.length) {
      job.message = `OCR 已完成，正在等待 PP-Structure 表格坐标复核 ${job.ppStructurePagesProcessed || 0}/${job.ppStructurePagesQueued || 0} 页...`;
      await Promise.allSettled(job.ppStructureTasks);
    }

    const text = getTicketOcrText(job);
    job.status = text ? "done" : "error";
    job.message = text
      ? `已批量识别 ${job.pagesProcessed} 页，其中 ${job.results.filter((item) => item.text).length} 页有票源内容，AI 已复核 ${job.aiColorPagesProcessed || 0}/${job.aiColorPagesQueued || 0} 页，结构复核 ${job.ppStructurePagesProcessed || 0}/${job.ppStructurePagesQueued || 0} 页${job.aiColorPagesFailed ? `，AI 失败 ${job.aiColorPagesFailed} 页会在待确认里保留人工校对` : ""}${job.ppStructurePagesFailed ? `，结构复核失败 ${job.ppStructurePagesFailed} 页` : ""}${job.errors.length ? `，${job.errors.length} 页失败可单独补扫` : ""}。`
      : `已扫描 ${job.pagesProcessed} 页，但没有识别到可用表格内容。`;
  } catch (error) {
    job.status = "error";
    job.message = formatErrorMessage(error);
  } finally {
    if (pdfVectorTempDir) fs.rm(pdfVectorTempDir, { recursive: true, force: true }, () => {});
    job.finishedAt = Date.now();
    setTimeout(() => ticketOcrJobs.delete(job.id), 30 * 60 * 1000);
  }
}

async function retryTicketOcrFailedPages(job) {
  if (!job.errors.length) return;
  const retryItems = job.errors
    .slice()
    .sort((a, b) => a.page - b.page)
    .map((error) => ({ page: error.page, image: job.failedImages[error.page] || "", stage: error.stage || "" }));

  if (!retryItems.length) {
    job.message = "失败页图片缓存已过期，请重新上传 PDF 后再识别。";
    return;
  }

  job.status = "running";
  job.message = `正在重试 ${retryItems.length} 个失败页...`;
  job.aiColorTasks = Array.isArray(job.aiColorTasks) ? job.aiColorTasks : [];
  const remainingErrors = [];
  let retryProcessed = 0;
  for (const item of retryItems) {
    try {
      if (!item.image && job.sourcePath) {
        item.image = await renderPdfPagePathToImage(job.sourcePath, item.page);
      }
      if (!item.image) {
        throw new Error("失败页图片缓存已过期，请重新上传 PDF 后再识别。");
      }
      const result = await recognizeTicketPageWithRetry(item, job);
      if (result.text && !job.results.some((existing) => existing.page === item.page)) {
        job.results.push(result);
        startTicketRowColorAnalysisForPage(job, item, result);
      }
      delete job.failedImages[item.page];
    } catch (error) {
      remainingErrors.push({ page: item.page, stage: item.image ? "ocr" : "render", message: formatErrorMessage(error) });
    } finally {
      retryProcessed += 1;
      job.message = `正在重试失败页 ${retryProcessed}/${retryItems.length}...`;
    }
  }
  if (job.aiColorTasks.length) {
    job.message = `失败页 OCR 已完成，正在等待 AI 逐行底色复核 ${job.aiColorPagesProcessed || 0}/${job.aiColorPagesQueued || 0} 页...`;
    await Promise.allSettled(job.aiColorTasks);
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
  const { buffer } = dataUrlToBuffer(file);
  const pdfVectorTempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ticket-recognize-pdf-vector-"));
  const pdfVectorPath = path.join(pdfVectorTempDir, "source.pdf");
  fs.writeFileSync(pdfVectorPath, buffer);
  try {
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
          const vectorAnalysis = await analyzeTicketRowColorsFromPdfPath(pdfVectorPath, images[index].page, expectedRows);
          rowColorAnalyses[String(images[index].page)] =
            vectorAnalysis.reliable || vectorAnalysis.rows?.length
              ? vectorAnalysis
              : await analyzeTicketRowColorsFromDataUrl(images[index].image, expectedRows);
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
  } finally {
    fs.rm(pdfVectorTempDir, { recursive: true, force: true }, () => {});
  }
}

async function analyzeTicketRowColors(request, response) {
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  let image = String(payload.image || payload.file || "");
  const sourceUrl = String(payload.sourceUrl || "");
  const sourcePage = Math.max(1, Math.floor(Number(payload.sourcePage || 1)));
  const expectedRows = Math.max(0, Math.floor(Number(payload.expectedRows || 0)));
  if (!image && sourceUrl.startsWith("uploads/")) {
    const sourcePath = getReadableUploadPath(sourceUrl);
    if (!sourcePath) {
      sendJson(response, 404, { error: "Source image not found", message: "没有找到已保存的原始图片，请重新选择图片。" });
      return;
    }
    const mimeType = getMimeForExtension(sourcePath);
    if (mimeType === "application/pdf") {
      if (expectedRows) {
        const vectorAnalysis = await analyzeTicketRowColorsFromPdfPath(sourcePath, sourcePage, expectedRows);
        if (vectorAnalysis.reliable && vectorAnalysis.exactRowAligned === true) {
          sendJson(response, 200, { rowColorAnalysis: vectorAnalysis });
          return;
        }
      }
      image = await renderPdfPagePathToImage(sourcePath, sourcePage);
    } else {
      const buffer = fs.readFileSync(sourcePath);
      image = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }
  }
  if (image.startsWith("data:application/pdf")) {
    if (expectedRows) {
      const vectorAnalysis = await analyzeTicketRowColorsFromPdfDataUrl(image, sourcePage, expectedRows);
      if (vectorAnalysis.reliable && vectorAnalysis.exactRowAligned === true) {
        sendJson(response, 200, { rowColorAnalysis: vectorAnalysis });
        return;
      }
    }
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
    const sourcePath = getReadableUploadPath(sourceUrl);
    if (!sourcePath) {
      const error = new Error("没有找到已保存的原始图片，请重新选择图片。");
      error.status = 404;
      throw error;
    }
    const mimeType = getMimeForExtension(sourcePath);
    if (mimeType === "application/pdf") {
      image = await renderPdfPagePathToImage(sourcePath, sourcePage);
    } else {
      const buffer = fs.readFileSync(sourcePath);
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

async function serveSourcePageImage(request, response) {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  const sourceUrl = decodeURIComponent(String(url.searchParams.get("source") || ""));
  const page = Math.max(1, Math.floor(Number(url.searchParams.get("page") || 1)));
  if (!sourceUrl.startsWith("uploads/")) {
    sendJson(response, 400, { error: "Invalid source", message: "只能预览已上传的本地票源文件。" });
    return;
  }
  const sourcePath = getReadableUploadPath(sourceUrl);
  if (!sourcePath) {
    sendJson(response, 404, { error: "Source file not found", message: "找不到已上传的原始文件，请重新上传票源。" });
    return;
  }
  const mimeType = getMimeForExtension(sourcePath);
  if (mimeType !== "application/pdf") {
    response.writeHead(302, { Location: `/${sourceUrl}` });
    response.end();
    return;
  }
  const dataUrl = await renderPdfPagePathToImage(sourcePath, page);
  if (!dataUrl) {
    sendJson(response, 422, { error: "No page image rendered", message: "PDF 页面渲染失败，无法显示贴行操作。" });
    return;
  }
  const { buffer } = dataUrlToBuffer(dataUrl);
  response.writeHead(200, {
    "Content-Type": "image/jpeg",
    "Cache-Control": "no-store",
  });
  response.end(buffer);
}

function buildRowColorVisionPrompt({ columns, rows, page }) {
  const compactRows = (rows || []).slice(0, 80).map((row, index) => ({
    index,
    cells: Array.isArray(row) ? row.map((cell) => String(cell || "").slice(0, 80)) : [],
    requiredMatchText: getAiRowMatchTokens(row),
  }));
  return [
    "你是票务表格行底色审核器。请逐条判断每一条 OCR 行在原图中对应整行的底色，并根据这张表自己的颜色语境判断是否应该发布。",
    `图片是票源原图/PDF 第 ${page || 1} 页。后台已经读出的列名和行如下：`,
    JSON.stringify({ columns, rows: compactRows }, null, 2),
    "请逐条匹配这些行在图片表格中的真实视觉行，判断该行底色和发布动作。",
    "匹配行时必须先核对该行的关键文字，例如日期、区域、排、号、售价；只有文字内容能对应上的那一行，才可以判断该输入行的底色。",
    "每条输入行都有 requiredMatchText；你必须在原图同一视觉行里找到这些关键文字中的主要文字，尤其是区域/排/座位/售价。",
    "返回每一行时必须填写 matchedText，写出你在原图对应视觉行里实际看见的关键文字。matchedText 必须包含用于定位的区域/排/座位，并且如果输入行有售价数字或 SOLD/已售，matchedText 也必须包含这个价格或 SOLD/已售证据。",
    "不要把输入行原样复制到 matchedText；只写你从图片里看到并用于定位的文字。",
    "同一页可能有多个独立表格、多个相似行、多个颜色块；不能把上一个表格或下一个表格的底色套到当前输入行。",
    "如果找不到与输入行关键文字一致的视觉行，action=uncertain，label=无法确定。",
    "如果红底表里夹着白底/浅底可售行，必须把夹在中间的白底行单独识别为白底；不能因为上下相邻红行或整表红色很多，就把这条白底行判成红底。",
    "如果某一行的售价列是数字但相邻行售价列是 SOLD，必须分别判断，不能把 SOLD 套到数字售价行，也不能把数字售价套到 SOLD 行。",
    "如果一行有数字售价但底色是红底/明显已售色，action=skip；如果一行是白底/正常底且有数字售价，action=publish。",
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
    "每一行必须返回 rowBox，表示你在图片里看到的同一视觉行的大致位置，格式为 {\"y1\":数字,\"y2\":数字}；如果无法定位就返回 {\"y1\":0,\"y2\":0}，并且 action=uncertain。",
    "返回严格 JSON：{\"rows\":[{\"index\":0,\"label\":\"白底\",\"action\":\"publish\",\"confidence\":0.95,\"matchedText\":\"8.22 206 G 2900\",\"rowBox\":{\"y1\":120,\"y2\":145},\"reason\":\"...\"}]}。",
    "action 只能是 publish、skip、uncertain。",
    "index 必须使用后台给出的 index，必须覆盖每一条输入行。不要返回 Markdown。",
  ].join("\n");
}

function normalizeAiVisionText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[￥¥₩,，\s]/g, "")
    .replace(/sold/g, "sold")
    .trim();
}

function aiTextHasSoldCue(value) {
  return /(?:sold|已售|售出|下架|sold\s*out|매진|판매완료)/i.test(String(value || ""));
}

function aiTextHasNumericSalePrice(value) {
  return /(?:^|[^\d])(?:￥|¥|₩|\$)?\s*\d{3,6}(?:[,.]\d{3})?(?:원|cny|rmb)?(?:$|[^\d])/i.test(String(value || ""));
}

function isAiNonWhiteColorLabel(label) {
  const text = String(label || "");
  if (!text || /无法|不确定/.test(text)) return false;
  if (/白底/.test(text)) return false;
  return /红底|黄底|橙底|绿底|蓝底|粉底|紫底|灰底|黑底|非白|其他/.test(text);
}

function getAiRowMatchTokens(row) {
  const values = (Array.isArray(row) ? row : [])
    .map((cell) => String(cell || "").trim())
    .filter(Boolean)
    .filter((value) => !/^[xX/／\-]+$/.test(value))
    .filter((value) => !/^(配送|转寄|过户|内场|外场|floor)$/i.test(value));
  const tokens = [];
  values.forEach((value) => {
    const normalized = normalizeAiVisionText(value);
    if (!normalized || normalized.length < 2) return;
    if (/^\d+$/.test(normalized) && Number(normalized) < 10) return;
    tokens.push(value);
  });
  return [...new Set(tokens)].slice(0, 5);
}

function isAiRowTextMatchVerified(item, inputRow) {
  const tokens = getAiRowMatchTokens(inputRow);
  if (!tokens.length) return true;
  const evidence = normalizeAiVisionText(
    [
      item?.matchedText,
      item?.matched_text,
      item?.visibleText,
      item?.visible_text,
      Array.isArray(item?.matchedValues) ? item.matchedValues.join(" ") : "",
      Array.isArray(item?.matched_values) ? item.matched_values.join(" ") : "",
    ].join(" "),
  );
  if (!evidence) return false;
  const matched = tokens.filter((token) => evidence.includes(normalizeAiVisionText(token)));
  const numericTokens = tokens.filter((token) => /\d/.test(normalizeAiVisionText(token)));
  const matchedNumeric = numericTokens.filter((token) => evidence.includes(normalizeAiVisionText(token)));
  const requiredCount = Math.min(tokens.length, Math.max(2, Math.ceil(tokens.length * 0.6)));
  return matched.length >= requiredCount && (!numericTokens.length || matchedNumeric.length >= Math.min(2, numericTokens.length));
}

function isAiRowEvidenceSelfConsistent(item, inputRow) {
  const inputText = Array.isArray(inputRow) ? inputRow.join(" ") : String(inputRow || "");
  const evidenceText = [
    item?.matchedText,
    item?.matched_text,
    item?.visibleText,
    item?.visible_text,
    Array.isArray(item?.matchedValues) ? item.matchedValues.join(" ") : "",
    Array.isArray(item?.matched_values) ? item.matched_values.join(" ") : "",
  ].join(" ");
  const reasonText = String(item?.reason || "");
  const action = String(item?.action || "");
  const inputHasPrice = aiTextHasNumericSalePrice(inputText);
  const evidenceHasPrice = aiTextHasNumericSalePrice(evidenceText);
  const inputHasSold = aiTextHasSoldCue(inputText);
  const evidenceHasSold = aiTextHasSoldCue(evidenceText);
  if (inputHasSold || evidenceHasSold) return true;
  if (inputHasPrice && evidenceHasPrice && action === "skip" && aiTextHasSoldCue(reasonText) && !isAiNonWhiteColorLabel(item?.label)) {
    return false;
  }
  return true;
}

function classifyRgbForAiRowBox(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max - min;
  if (max < 55) return "dark";
  if (r > 215 && g > 215 && b > 205 && saturation < 35) return "white";
  if (r > 150 && g < 115 && b < 115 && r - Math.max(g, b) > 45) return "red";
  if (r > 200 && g > 150 && b < 90 && r - b > 80) return g > 190 ? "yellow" : "orange";
  if (g > 140 && r < 180 && b < 160 && g - Math.max(r, b) > 25) return "green";
  if (b > 140 && r < 180 && g < 190 && b - Math.max(r, g) > 20) return "blue";
  if (r > 180 && b > 120 && g < 150) return "pink";
  if (saturation < 35 && max > 155) return "white";
  return saturation > 45 ? "colored" : "neutral";
}

function getAiRowBoxLocalLabel(counts) {
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  if (!total) return { label: "无法确定", whiteRatio: 0, coloredRatio: 0, redRatio: 0 };
  const coloredCount = (counts.red || 0) + (counts.orange || 0) + (counts.yellow || 0) + (counts.green || 0) + (counts.blue || 0) + (counts.pink || 0) + (counts.colored || 0);
  const whiteRatio = (counts.white || 0) / total;
  const coloredRatio = coloredCount / total;
  const redRatio = (counts.red || 0) / total;
  const palette = [
    ["红底", counts.red || 0],
    ["橙底", counts.orange || 0],
    ["黄底", counts.yellow || 0],
    ["绿底", counts.green || 0],
    ["蓝底", counts.blue || 0],
    ["粉底", counts.pink || 0],
  ].sort((a, b) => b[1] - a[1]);
  if (redRatio >= 0.18 || (palette[0][0] === "红底" && palette[0][1] >= Math.max(25, (counts.white || 0) * 0.55))) {
    return { label: "红底", whiteRatio, coloredRatio, redRatio };
  }
  if (coloredRatio >= 0.24 && palette[0][1] > 0) return { label: palette[0][0], whiteRatio, coloredRatio, redRatio };
  if (whiteRatio >= 0.45 && whiteRatio >= coloredRatio * 1.35) return { label: "白底", whiteRatio, coloredRatio, redRatio };
  return { label: coloredRatio > whiteRatio ? "非白底" : "白底", whiteRatio, coloredRatio, redRatio };
}

async function verifyAiRowsByLocalRowBoxColor(image, rows) {
  if (!Array.isArray(rows) || !rows.length) return [];
  let parsed;
  try {
    parsed = dataUrlToBuffer(image);
  } catch {
    return [];
  }
  const sharp = loadSharp();
  const { data, info } = await sharp(parsed.buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const invalidRows = [];
  rows.forEach((row, index) => {
    const box = row?.rowBox;
    if (!box) return;
    const y1 = Math.max(0, Math.min(info.height - 1, Math.floor(Number(box.y1))));
    const y2 = Math.max(y1 + 1, Math.min(info.height, Math.ceil(Number(box.y2))));
    const columnSignal = new Uint16Array(info.width);
    for (let y = y1; y < y2; y += 1) {
      const offsetY = y * info.width * 4;
      for (let x = 0; x < info.width; x += 1) {
        const offset = offsetY + x * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max < 110 || max - min > 45) columnSignal[x] += 1;
      }
    }
    const threshold = Math.max(1, Math.floor((y2 - y1) * 0.04));
    let x1 = -1;
    let x2 = -1;
    for (let x = 0; x < info.width; x += 1) {
      if (columnSignal[x] >= threshold) {
        if (x1 < 0) x1 = x;
        x2 = x;
      }
    }
    if (x1 < 0 || x2 - x1 < info.width * 0.15) {
      x1 = Math.floor(info.width * 0.06);
      x2 = Math.ceil(info.width * 0.94);
    }
    const pad = Math.floor(info.width * 0.01);
    x1 = Math.max(0, x1 - pad);
    x2 = Math.min(info.width - 1, x2 + pad);
    const counts = {};
    for (let y = y1; y < y2; y += 1) {
      const offsetY = y * info.width * 4;
      for (let x = x1; x <= x2; x += 1) {
        const offset = offsetY + x * 4;
        const family = classifyRgbForAiRowBox(data[offset], data[offset + 1], data[offset + 2]);
        if (family === "dark") continue;
        counts[family] = (counts[family] || 0) + 1;
      }
    }
    const local = getAiRowBoxLocalLabel(counts);
    row.localPixelLabel = local.label;
    row.localPixelWhiteRatio = Number(local.whiteRatio.toFixed(3));
    row.localPixelColoredRatio = Number(local.coloredRatio.toFixed(3));
    row.localPixelRedRatio = Number(local.redRatio.toFixed(3));
    const aiLabel = String(row.label || "");
    const aiWantsSkip = String(row.action || "") === "skip";
    const aiWantsPublish = String(row.action || "") === "publish";
    const aiSaysNonWhite = isAiNonWhiteColorLabel(aiLabel);
    const localStrongWhite = local.label === "白底" && local.whiteRatio >= 0.45 && local.whiteRatio >= local.coloredRatio * 1.35;
    const localStrongRed = local.label === "红底" && local.redRatio >= 0.18;
    if (aiWantsSkip && aiSaysNonWhite && localStrongWhite) invalidRows.push(index);
    if (aiWantsPublish && /白底/.test(aiLabel) && localStrongRed) invalidRows.push(index);
  });
  return invalidRows;
}

function normalizeAiRowColorRows(parsedRows, inputRows) {
  const returnedIndexes = new Set();
  const byIndex = new Map(
    (Array.isArray(parsedRows) ? parsedRows : []).map((item) => {
      const index = Number(item.index);
      if (Number.isInteger(index)) returnedIndexes.add(index);
      return [index, item];
    }),
  );
  const missingRows = [];
  const lowConfidenceRows = [];
  const unverifiedRows = [];
  const normalizedRows = (Array.isArray(inputRows) ? inputRows : []).map((inputRow, index) => {
    const item = byIndex.get(index) || {};
    if (!byIndex.has(index)) missingRows.push(index);
    const textVerified = isAiRowTextMatchVerified(item, inputRow);
    const evidenceConsistent = textVerified && isAiRowEvidenceSelfConsistent(item, inputRow);
    const verified = textVerified && evidenceConsistent;
    const inputText = Array.isArray(inputRow) ? inputRow.join(" ") : String(inputRow || "");
    const inputIsSold = aiTextHasSoldCue(inputText);
    if (!verified) unverifiedRows.push(index);
    const aiAction = verified && ["publish", "skip", "uncertain"].includes(String(item.action || "")) ? String(item.action) : "uncertain";
    const action = inputIsSold && verified ? "skip" : aiAction;
    const confidence = verified ? Math.max(0, Math.min(1, Number(item.confidence || 0))) : Math.min(0.49, Math.max(0, Math.min(1, Number(item.confidence || 0))));
    if (action === "uncertain" || confidence < 0.7) lowConfidenceRows.push(index);
    const label = String(item.label || "无法确定").trim();
    const rowBox = item.rowBox || item.row_box || item.box || null;
    const y1 = Number(rowBox?.y1 ?? rowBox?.top ?? NaN);
    const y2 = Number(rowBox?.y2 ?? rowBox?.bottom ?? NaN);
    const hasRowBox = Number.isFinite(y1) && Number.isFinite(y2) && y2 > y1;
    return {
      index,
      label,
      rawLabel: label,
      action,
      confidence,
      matchedText: String(item.matchedText || item.matched_text || item.visibleText || item.visible_text || "").slice(0, 180),
      rowTextVerified: verified,
      rowBox: hasRowBox ? { y1, y2 } : null,
      rowGeometryVerified: hasRowBox,
      coloredRatio: 0,
      whiteRatio: /白/.test(label) ? 1 : 0,
      coverageRatio: /白|无法|不确定/.test(label) ? 0 : 1,
      strong: confidence >= 0.78 && action !== "uncertain",
      reason: verified ? String(item.reason || "").slice(0, 180) : `AI未能证明匹配到本行关键文字或证据自洽，保留人工确认。${String(item.reason || "").slice(0, 120)}`,
    };
  });
  const extraRows = [...returnedIndexes].filter((index) => index < 0 || index >= normalizedRows.length);
  const boxes = normalizedRows.map((row) => row.rowBox).filter(Boolean);
  const rowBoxCenters = normalizedRows.map((row) => {
    if (!row.rowBox) return NaN;
    return (row.rowBox.y1 + row.rowBox.y2) / 2;
  });
  const geometryVerified =
    boxes.length === normalizedRows.length &&
    rowBoxCenters.every((center, index) => Number.isFinite(center) && (index === 0 || center > rowBoxCenters[index - 1]));
  return {
    rows: normalizedRows,
    missingRows,
    extraRows,
    lowConfidenceRows,
    unverifiedRows,
    geometryVerified,
    reliable: missingRows.length === 0 && extraRows.length === 0,
  };
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
                    matchedText: { type: "string" },
                    rowBox: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        y1: { type: "number" },
                        y2: { type: "number" },
                      },
                      required: ["y1", "y2"],
                    },
                    reason: { type: "string" },
                  },
                  required: ["index", "label", "action", "confidence", "matchedText", "rowBox", "reason"],
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
  const normalized = normalizeAiRowColorRows(parsed.rows, rows);
  const pixelMismatchRows = await verifyAiRowsByLocalRowBoxColor(image, normalized.rows);
  const pixelMismatchSet = new Set(pixelMismatchRows);
  normalized.rows.forEach((row, index) => {
    row.pixelMismatch = pixelMismatchSet.has(index);
  });
  const unreliableReasons = [];
  if (!normalized.reliable) unreliableReasons.push("ai_row_index_mismatch");
  if (normalized.unverifiedRows.length) unreliableReasons.push("ai_row_text_mismatch");
  const warningReasons = [...(normalized.lowConfidenceRows.length ? ["ai_uncertain_rows"] : []), ...(pixelMismatchRows.length ? ["ai_pixel_reference_mismatch"] : [])];
  const rowTextVerified = normalized.reliable && !normalized.unverifiedRows.length;
  const rowGeometryVerified = rowTextVerified && normalized.geometryVerified === true;
  const autoApplyAllowed = rowGeometryVerified && pixelMismatchRows.length === 0;
  return {
    source: "ai_row_color",
    reliable: rowGeometryVerified,
    contiguous: true,
    exactRowAligned: rowGeometryVerified,
    selectionMode: "openai_row_by_row",
    aiGeometryVerified: rowGeometryVerified,
    rowGeometryVerified,
    rowTextVerified,
    autoApplyAllowed,
    rows: normalized.rows,
    detectedRows: normalized.rows.length,
    expectedRows: Array.isArray(rows) ? rows.length : 0,
    lowConfidenceRows: normalized.lowConfidenceRows,
    unverifiedRows: normalized.unverifiedRows,
    unreliableReasons,
    warningReasons,
    pixelMismatchRows,
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
  const normalized = normalizeAiRowColorRows(parsed.rows, rows);
  const pixelMismatchRows = await verifyAiRowsByLocalRowBoxColor(image, normalized.rows);
  const pixelMismatchSet = new Set(pixelMismatchRows);
  normalized.rows.forEach((row, index) => {
    row.pixelMismatch = pixelMismatchSet.has(index);
  });
  const unreliableReasons = [];
  if (!normalized.reliable) unreliableReasons.push("ai_row_index_mismatch");
  if (normalized.unverifiedRows.length) unreliableReasons.push("ai_row_text_mismatch");
  const warningReasons = [...(normalized.lowConfidenceRows.length ? ["ai_uncertain_rows"] : []), ...(pixelMismatchRows.length ? ["ai_pixel_reference_mismatch"] : [])];
  const rowTextVerified = normalized.reliable && !normalized.unverifiedRows.length;
  const rowGeometryVerified = rowTextVerified && normalized.geometryVerified === true;
  const autoApplyAllowed = rowGeometryVerified && pixelMismatchRows.length === 0;
  return {
    source: "ai_row_color",
    reliable: rowGeometryVerified,
    contiguous: true,
    exactRowAligned: rowGeometryVerified,
    selectionMode: "aliyun_row_by_row",
    aiGeometryVerified: rowGeometryVerified,
    rowGeometryVerified,
    rowTextVerified,
    autoApplyAllowed,
    rows: normalized.rows,
    detectedRows: normalized.rows.length,
    expectedRows: Array.isArray(rows) ? rows.length : 0,
    lowConfidenceRows: normalized.lowConfidenceRows,
    unverifiedRows: normalized.unverifiedRows,
    unreliableReasons,
    warningReasons,
    pixelMismatchRows,
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
  const analyzeWithVision = getActiveProvider() === "openai" ? analyzeTicketRowColorsWithOpenAI : analyzeTicketRowColorsWithAliyun;
  const analysis = await analyzeWithVision(image, {
    columns,
    rows,
    page: Math.max(1, Math.floor(Number(payload.sourcePage || 1))),
  });
  sendJson(response, 200, { rowColorAnalysis: analysis });
}

async function analyzeTicketRowColorsAnchor(request, response) {
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const image = await resolveRowColorSourceImage(payload);
  const columns = Array.isArray(payload.columns) ? payload.columns : [];
  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  if (!rows.length) {
    sendJson(response, 400, { error: "Missing rows", message: "请提供需要定位到底色的票源行。" });
    return;
  }
  const analysis = await analyzeTicketAnchorRowColorsFromDataUrl(image, rows, columns);
  sendJson(response, 200, { rowColorAnalysis: analysis });
}

async function analyzeTicketRowColorsAnchorBatch(request, response) {
  const raw = await readBody(request);
  const payload = JSON.parse(raw || "{}");
  const tables = Array.isArray(payload.tables) ? payload.tables : [];
  if (!tables.length) {
    sendJson(response, 400, { error: "Missing tables", message: "请提供需要批量定位底色的票源表。" });
    return;
  }
  const result = await analyzeTicketAnchorRowColorsBatch(payload, tables);
  sendJson(response, 200, result);
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
  const sourceUrl = String(payload.sourceUrl || "");
  const fileName = String(payload.fileName || "票源文件");
  const maxPages = Number(payload.maxPages || 0) > 0 ? getRequestedTicketOcrPages(payload.maxPages, Number(payload.maxPages)) : null;
  const ppStructureEnabled = payload.ppStructure === true || payload.ppStructure === "true" || ocrPpStructureDuringScanEnabled;
  const sourcePath = sourceUrl.startsWith("uploads/") ? getReadableUploadPath(sourceUrl) : "";
  const sourceIsPdf = sourcePath ? getMimeForExtension(sourcePath) === "application/pdf" : file.startsWith("data:application/pdf");
  if (!sourceIsPdf) {
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
    sourcePath,
    ppStructureEnabled,
    message: "已加入批量识别队列。",
    createdAt: Date.now(),
    finishedAt: null,
  };
  ticketOcrJobs.set(id, job);
  runTicketOcrBatch(job, { sourcePath, dataUrl: file }, maxPages);
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

function sendTicketOcrJobs(request, response) {
  const jobs = Array.from(ticketOcrJobs.values())
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    .map(publicTicketOcrJob);
  sendJson(response, 200, { jobs });
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
  const uploadPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (uploadPath.startsWith("uploads/")) {
    const readableUploadPath = getReadableUploadPath(uploadPath);
    if (readableUploadPath) filePath = readableUploadPath;
  }
  if (!filePath.startsWith(root)) {
    if (!filePath.startsWith(uploadBackupDir)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
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
  if (request.method === "GET" && request.url.startsWith("/api/source/page-image")) {
    serveSourcePageImage(request, response).catch((error) => {
      console.error("Source page image failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
    });
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
  if (request.method === "POST" && request.url === "/api/tables/analyze-row-colors-anchor") {
    analyzeTicketRowColorsAnchor(request, response).catch((error) => {
      console.error("Ticket anchor row-color analysis failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
    });
    return;
  }
  if (request.method === "POST" && request.url === "/api/tables/analyze-row-colors-anchor-batch") {
    analyzeTicketRowColorsAnchorBatch(request, response).catch((error) => {
      console.error("Ticket anchor row-color batch analysis failed", error);
      const message = formatErrorMessage(error);
      sendJson(response, error.status || 500, { error: message, message });
    });
    return;
  }
  if (request.method === "POST" && request.url === "/api/tables/ppstructure-preview") {
    analyzeTicketPpStructure(request, response).catch((error) => {
      console.error("Ticket PP-Structure preview failed", error);
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
  if (request.method === "GET" && request.url === "/api/tables/recognize/jobs") {
    sendTicketOcrJobs(request, response);
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
