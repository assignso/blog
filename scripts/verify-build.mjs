import { gzipSync } from "node:zlib";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const output = join(root, "dist");
const origin = "https://blog.assign.so";
const failures = [];

function filesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

function fail(message) {
  failures.push(message);
}

function attributeValues(html, element, attribute) {
  const pattern = new RegExp(`<${element}\\b[^>]*\\b${attribute}=["']([^"']+)["'][^>]*>`, "gi");
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function linkHref(html, relation) {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  return links
    .filter((link) => new RegExp(`\\brel=["'][^"']*\\b${relation}\\b[^"']*["']`, "i").test(link))
    .map((link) => link.match(/\bhref=["']([^"']+)["']/i)?.[1])
    .filter(Boolean);
}

function pageURL(file) {
  const local = relative(output, file).split(sep).join("/");
  if (local === "index.html") return `${origin}/`;
  return `${origin}/${local.replace(/index\.html$/, "")}`;
}

function localAsset(reference, page) {
  if (/^(?:[a-z]+:|#|\/\/)/i.test(reference)) return null;
  const resolved = new URL(reference, page);
  if (resolved.origin !== origin) return null;
  const pathname = decodeURIComponent(resolved.pathname).replace(/^\//, "");
  return join(output, pathname.endsWith("/") ? `${pathname}index.html` : pathname);
}

if (!existsSync(output)) {
  console.error("blog verification: dist does not exist; run the Astro build first");
  process.exit(1);
}

const builtFiles = filesBelow(output);
const htmlFiles = builtFiles.filter((file) => extname(file) === ".html");
const canonicals = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const page = pageURL(file);
  const canonical = linkHref(html, "canonical");
  if (canonical.length !== 1 || canonical[0] !== page) {
    fail(`${relative(output, file)} must have one canonical URL equal to ${page}`);
  } else if (canonicals.has(canonical[0])) {
    fail(`${relative(output, file)} duplicates canonical URL from ${canonicals.get(canonical[0])}`);
  } else {
    canonicals.set(canonical[0], relative(output, file));
  }

  const titles = [...html.matchAll(/<title>([^<]+)<\/title>/gi)];
  if (titles.length !== 1 || titles[0][1].trim() === "") fail(`${relative(output, file)} needs one non-empty title`);
  if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html)) {
    fail(`${relative(output, file)} needs a non-empty description`);
  }
  if (!html.includes('href="#main-content"') || !html.includes('id="main-content"')) {
    fail(`${relative(output, file)} must retain its skip link and main landmark`);
  }
  if (!linkHref(html, "alternate").includes(`${origin}/rss.xml`)) {
    fail(`${relative(output, file)} must advertise the canonical RSS feed`);
  }

  const ogURL = html.match(/<meta\b[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1];
  if (ogURL !== page) fail(`${relative(output, file)} Open Graph URL must match its canonical URL`);

  for (const reference of [...attributeValues(html, "a", "href"), ...attributeValues(html, "img", "src"), ...attributeValues(html, "script", "src"), ...attributeValues(html, "link", "href")]) {
    const target = localAsset(reference, page);
    if (target && !existsSync(target)) fail(`${relative(output, file)} references missing local target ${reference}`);
  }
}

for (const required of ["rss.xml", "sitemap-index.xml", "robots.txt"]) {
  if (!existsSync(join(output, required))) fail(`missing required ${required}`);
}

const rss = readFileSync(join(output, "rss.xml"), "utf8");
for (const link of [...rss.matchAll(/<link>([^<]+)<\/link>/g)].map((match) => match[1])) {
  if (!link.startsWith(`${origin}/`)) fail(`RSS contains non-canonical link ${link}`);
}
if (rss.includes("<content:encoded")) fail("RSS must remain excerpt-only and must not embed article bodies");

const sitemap = builtFiles
  .filter((file) => /^sitemap.*\.xml$/.test(relative(output, file)))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
for (const canonical of canonicals.keys()) {
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) fail(`sitemap omits ${canonical}`);
}
if (!readFileSync(join(output, "robots.txt"), "utf8").includes(`Sitemap: ${origin}/sitemap-index.xml`)) {
  fail("robots.txt must advertise the canonical sitemap index");
}

const javascriptBytes = builtFiles
  .filter((file) => extname(file) === ".js")
  .reduce((total, file) => total + gzipSync(readFileSync(file)).byteLength, 0);
if (javascriptBytes > 150 * 1024) fail(`compressed JavaScript is ${javascriptBytes} bytes; budget is 153600`);

const preloadPattern = /<link\b[^>]*rel=["']preload["'][^>]*href=["']([^"']+)["'][^>]*as=["'](?:font|image)["'][^>]*>/gi;
const criticalAssets = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(preloadPattern)) {
    const asset = localAsset(match[1], pageURL(file));
    if (asset) criticalAssets.add(asset);
  }
}
const criticalBytes = [...criticalAssets].reduce((total, file) => total + (existsSync(file) ? statSync(file).size : 0), 0);
if (criticalBytes > 500 * 1024) fail(`critical font/image transfer is ${criticalBytes} bytes; budget is 512000`);

if (failures.length > 0) {
  console.error(`blog verification failed (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`blog verification passed: ${htmlFiles.length} pages, ${javascriptBytes} compressed JS bytes, ${criticalBytes} critical asset bytes`);
