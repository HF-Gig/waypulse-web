import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { build } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prerender() {
  console.log("🚀 Starting Static Site Generation (SSG) / Prerender...");

  // 1. Build client-side assets
  console.log("📦 Building client bundle...");
  await build({
    configFile: path.resolve(__dirname, "../vite.config.js"),
    build: {
      outDir: path.resolve(__dirname, "../dist"),
      emptyOutDir: true,
    },
  });

  // 2. Build server-side entry point for SSR
  console.log("📦 Building SSR bundle...");
  await build({
    configFile: path.resolve(__dirname, "../vite.config.js"),
    build: {
      ssr: path.resolve(__dirname, "../src/entry-server.jsx"),
      outDir: path.resolve(__dirname, "../dist/server"),
      emptyOutDir: true,
      minify: false,
    },
  });

  // 3. Import the server entry point
  const serverEntryPath = path.resolve(__dirname, "../dist/server/entry-server.js");
  const { render } = await import(serverEntryPath);

  // 4. Read template index.html
  const templatePath = path.resolve(__dirname, "../dist/index.html");
  let template = fs.readFileSync(templatePath, "utf-8");

  // 5. Render App to static HTML string
  const helmetContext = {};
  const { html } = render("/", helmetContext);
  const { helmet } = helmetContext;

  // 6. Extract and replace Helmet metadata
  if (helmet) {
    const titleStr = helmet.title ? helmet.title.toString() : "";
    const metaStr = helmet.meta ? helmet.meta.toString() : "";
    const linkStr = helmet.link ? helmet.link.toString() : "";
    const scriptStr = helmet.script ? helmet.script.toString() : "";

    // Replace title placeholder or insert in head
    if (titleStr) {
      if (template.includes("<title>")) {
        template = template.replace(/<title>.*?<\/title>/, titleStr);
      } else {
        template = template.replace("</head>", `${titleStr}\n</head>`);
      }
    }

    // Inject meta tags right before </head>
    const metaAndLinks = [metaStr, linkStr, scriptStr].filter(Boolean).join("\n");
    if (metaAndLinks) {
      template = template.replace("</head>", `${metaAndLinks}\n</head>`);
    }
  }

  // 7. Inject HTML body into root container
  template = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  );

  // 8. Write back the prerendered HTML file
  fs.writeFileSync(templatePath, template, "utf-8");
  console.log("✅ Statically prerendered dist/index.html successfully!");

  // 9. Clean up SSR folder
  console.log("🧹 Cleaning up SSR bundle...");
  fs.rmSync(path.resolve(__dirname, "../dist/server"), { recursive: true, force: true });

  // 10. Generate sitemap.xml dynamically
  console.log("🗺️ Generating sitemap.xml...");
  const DOMAIN = "https://waypulse-web.onrender.com";
  const lastmod = new Date().toISOString().split("T")[0];
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  const publicSitemap = path.resolve(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(publicSitemap, sitemapContent, "utf-8");
  fs.writeFileSync(path.resolve(__dirname, "../dist/sitemap.xml"), sitemapContent, "utf-8");
  console.log("✅ Generated sitemap.xml in public/ and dist/!");

  console.log("🎉 Prerendering and build pipeline completed successfully!");
}

prerender().catch((err) => {
  console.error("❌ Prerendering build failed:", err);
  process.exit(1);
});
