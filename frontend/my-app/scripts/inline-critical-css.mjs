// Post-processes every prerendered dist/client/**/*.html: inlines the CSS
// actually used on that page (Beasties statically matches selectors against
// the page's markup - it doesn't need a browser) and defers the full
// stylesheet, so the browser can paint without waiting for that network
// round trip. Run after `vike build`, since it needs the generated HTML.
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Beasties from "beasties";

const distDir = fileURLToPath(new URL("../dist/client", import.meta.url));

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return findHtmlFiles(full);
      return entry.name.endsWith(".html") ? [full] : [];
    })
  );
  return files.flat();
}

const beasties = new Beasties({
  path: distDir,
  logLevel: "warn",
});

const htmlFiles = await findHtmlFiles(distDir);

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const inlined = await beasties.process(html);
  await writeFile(file, inlined);
}

console.log(`Inlined critical CSS into ${htmlFiles.length} page(s).`);
