import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleContactSubmission } from "./api/contact.js";

function contactApiPlugin(env) {
  return {
    name: "contact-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/contact" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              // Pastikan process.env terisi dari env Vite
              Object.assign(process.env, env);
              const payload = JSON.parse(body || "{}");
              const result = await handleContactSubmission(payload);
              res.statusCode = result.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result.body));
            } catch {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: "Format request tidak valid" }));
            }
          });
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/contact" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              Object.assign(process.env, env);
              const payload = JSON.parse(body || "{}");
              const result = await handleContactSubmission(payload);
              res.statusCode = result.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result.body));
            } catch {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: "Format request tidak valid" }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), contactApiPlugin(env)],
  };
});
