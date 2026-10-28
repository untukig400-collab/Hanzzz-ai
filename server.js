const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-6-terra";

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return fs.createReadStream(path.join(__dirname, "index.html")).pipe(res);
  }

  if (req.method === "POST" && url.pathname === "/api/chat") {
    if (!API_KEY) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "OPENAI_API_KEY belum dipasang di environment server." }));
    }
    let raw = "";
    req.on("data", chunk => { raw += chunk; if (raw.length > 100000) req.destroy(); });
    req.on("end", async () => {
      try {
        const body = JSON.parse(raw || "{}");
        const message = typeof body.message === "string" ? body.message.trim() : "";
        if (!message) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Pesan tidak boleh kosong." }));
        }
        const apiRes = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: MODEL,
            instructions: "Kamu adalah Hanzzz AI, asisten yang ramah, membantu, jelas, dan menjawab dalam bahasa yang digunakan pengguna. Jika pengguna menggunakan bahasa Indonesia, balas dalam bahasa Indonesia.",
            input: message,
            max_output_tokens: 1000
          })
        });
        const data = await apiRes.json();
        if (!apiRes.ok) {
          res.writeHead(apiRes.status, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: data.error?.message || "OpenAI API request gagal." }));
        }
        const reply = data.output_text || (data.output || []).flatMap(item => item.content || []).filter(c => c.type === "output_text").map(c => c.text).join("\n") || "Maaf, aku belum mendapat jawaban.";
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ reply }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Terjadi kesalahan saat memproses pesan." }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(PORT, "0.0.0.0", () => console.log(`HANZZZ AI aktif di http://localhost:${PORT}`));
