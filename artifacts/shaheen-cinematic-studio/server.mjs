import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist", "public");
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method Not Allowed");
    return;
  }

  try {
    const rawPath = (request.url || "/").split("?")[0];
    const decodedRawPath = decodeURIComponent(rawPath);
    if (decodedRawPath.split("/").some((segment) => segment === "..")) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const url = new URL(request.url || "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";

    let filePath = path.resolve(root, `.${pathname}`);
    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    try {
      const fileInfo = await stat(filePath);
      if (!fileInfo.isFile()) throw new Error("Not a file");
    } catch {
      // The app is a single-page builder; let its client-side routes load the shell.
      filePath = path.join(root, "index.html");
    }

    const body = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const isHtml = extension === ".html";
    response.writeHead(200, {
      "Content-Length": body.length,
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": isHtml ? "no-cache" : "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") response.end();
    else response.end(body);
  } catch (error) {
    const status = error instanceof URIError ? 400 : 500;
    response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(status === 400 ? "Bad Request" : "Internal Server Error");
  }
}).listen(port, "0.0.0.0", () => {
  process.stdout.write(`SHAHEEN CINEMATIC STUDIO listening on ${port}\n`);
});
