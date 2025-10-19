import express from "express";
import ViteExpress from "vite-express";

const app = express();
ViteExpress.config({ mode: "production" });
// ViteExpress.config({ mode: "development" });

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

ViteExpress.listen(app, 4000, () =>
  console.log("Server is listening on port 4000...")
);
