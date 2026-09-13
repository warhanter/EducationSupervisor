import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

const app = express();
const port = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const distPath = path.resolve(root, "dist");

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

if (isProduction) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
} else {
  const vite = await createViteServer({
    root,
    appType: "custom",
    server: {
      middlewareMode: true,
    },
  });

  app.use(vite.middlewares);
  app.use(async (req, res, next) => {
    try {
      const template = await fs.readFile(path.resolve(root, "index.html"), "utf-8");
      const html = await vite.transformIndexHtml(req.originalUrl, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
