const http = require("http");
const fs = require("fs");
const path = require("path");
 
const root = __dirname;
const port = Number(process.env.PORT) || 4173;
const host = process.env.HOST || "127.0.0.1";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};
 
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
  const filePath = path.resolve(root, requested);
 
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
 
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
 
    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
});
 
server.listen(port, host, () => {
  console.log(`Kaçak Kurye: http://${host}:${port}/`);
  if (host === "0.0.0.0") {
    console.log(`Dış erişim: tarayıcıda http://SUNUCU_IP:${port}/ (SUNUCU_IP yerine gerçek IP)`);
  }
});
 