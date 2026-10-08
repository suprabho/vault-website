/**
 * Renders the favicon, app icons and share images from the brand wordmark.
 *
 *   NODE_PATH="$(npm root -g)" node scripts/make-brand-assets.mjs
 *
 * Needs Playwright (Chromium) and ImageMagick (`convert`, for favicon.ico). Writes:
 *   app/icon.svg, app/favicon.ico, app/apple-icon.png,
 *   app/opengraph-image.png, app/twitter-image.png,
 *   public/icons/icon-{192,512}.png, public/icons/icon-maskable-512.png
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// required rather than imported so NODE_PATH can point at a global Playwright
const { chromium } = createRequire(import.meta.url)("playwright");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const at = (...p) => join(root, ...p);

const NIGHT = "#010016";
const DEEP = "#151326";
const BRASS = "#c3ae87";
const BRASS_2 = "#d2c1a0";
const CREAM = "#f2f1f3";

/* ── the mark: the wordmark's "V", lifted out of components/brand/VaultLogo.tsx ── */
const V_PATH =
  "M88.5079 43.4413L79.623 15.9339V15.7207H83.8167L91.5998 40.0295H92.4527L100.165 15.7207H104.074V15.9339L95.1892 43.4413H88.5079Z";
const V_BOX = { x: 79.623, y: 15.7207, w: 24.451, h: 27.7206 };

/** A square tile with the V centred; `inset` is the share of the side the V's height takes. */
function markSvg({ size, inset, radius, background = true }) {
  const scale = (size * inset) / V_BOX.h;
  const tx = size / 2 - (V_BOX.x + V_BOX.w / 2) * scale;
  const ty = size / 2 - (V_BOX.y + V_BOX.h / 2) * scale;
  const bg = background
    ? `<defs><radialGradient id="g" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="${DEEP}"/><stop offset="1" stop-color="${NIGHT}"/></radialGradient></defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#g)"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bg}
  <path transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${scale.toFixed(4)})" fill="${BRASS}" d="${V_PATH}"/>
</svg>
`;
}

/* ── the share card: the aura, the full lockup and the hero line ── */
function logoSvg() {
  const src = readFileSync(at("components/brand/VaultLogo.tsx"), "utf8");
  const body = src.slice(src.indexOf("<path"), src.lastIndexOf("</svg>"));
  return `<svg viewBox="0 0 173 72" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:${CREAM}">${body
    .replace(/clipPath=\{`url\(#\$\{id\}\)`\}/, 'clip-path="url(#lockup)"')
    .replace(/id=\{id\}/, 'id="lockup"')}</svg>`;
}

function ogHtml() {
  const font = (w) =>
    `@font-face{font-family:"New York";font-weight:${w};src:url("data:font/woff2;base64,${readFileSync(
      at(`public/fonts/new-york-${w}.woff2`),
    ).toString("base64")}") format("woff2")}`;
  const aura = readFileSync(at("public/images/hero-aura.webp")).toString("base64");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${font(400)}${font(500)}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:${NIGHT};color:${CREAM};overflow:hidden;position:relative;font-family:"New York",Georgia,serif}
.aura{position:absolute;inset:0;background:url("data:image/webp;base64,${aura}") center 62%/cover;opacity:.9}
.shade{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 40%,rgba(1,0,22,.82),rgba(1,0,22,.35) 70%,rgba(1,0,22,0))}
.frame{position:absolute;inset:28px;border:1px solid rgba(195,174,135,.22);border-radius:6px}
.stage{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 120px 40px}
.logo{width:260px;height:auto;margin-bottom:46px}
h1{font-weight:500;font-size:76px;line-height:1.02;letter-spacing:-.038em;max-width:900px}
h1 em{font-style:normal;color:${BRASS_2}}
p{margin-top:26px;font-size:24px;line-height:1.45;color:#c7c5d2;max-width:760px;letter-spacing:-.005em}
</style></head><body>
<div class="aura"></div><div class="shade"></div><div class="frame"></div>
<div class="stage">
  <div class="logo">${logoSvg()}</div>
  <h1>Where crypto compliance <em>continues.</em></h1>
  <p>A private network for the people shaping and navigating financial crime, regulation and risk across digital assets.</p>
</div>
</body></html>`;
}

const tmp = join(tmpdir(), "vault-brand-assets");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
mkdirSync(at("public/icons"), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function png(html, size, out) {
  await page.setViewportSize(size);
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, omitBackground: true });
}

const svgPage = (svg) =>
  `<!doctype html><html><head><style>*{margin:0}html,body{background:transparent}svg{display:block}</style></head><body>${svg}</body></html>`;

// favicon.svg / icon.svg: the tile scales with the tab, so it carries its own background
writeFileSync(at("app/icon.svg"), markSvg({ size: 64, inset: 0.56, radius: 14 }));

// favicon.ico: 16/32/48, a touch larger V so it holds at 16px
for (const s of [16, 32, 48]) {
  await png(svgPage(markSvg({ size: s, inset: 0.62, radius: s * 0.22 })), { width: s, height: s }, join(tmp, `fav-${s}.png`));
}
execFileSync("convert", [16, 32, 48].map((s) => join(tmp, `fav-${s}.png`)).concat(at("app/favicon.ico")));

// apple-icon: iOS rounds the corners itself, so the tile is square and opaque
await png(svgPage(markSvg({ size: 180, inset: 0.5, radius: 0 })), { width: 180, height: 180 }, at("app/apple-icon.png"));

// PWA icons for the manifest
await png(svgPage(markSvg({ size: 192, inset: 0.5, radius: 42 })), { width: 192, height: 192 }, at("public/icons/icon-192.png"));
await png(svgPage(markSvg({ size: 512, inset: 0.5, radius: 112 })), { width: 512, height: 512 }, at("public/icons/icon-512.png"));
// maskable: full bleed, the V kept inside the 80% safe zone
await png(svgPage(markSvg({ size: 512, inset: 0.38, radius: 0 })), { width: 512, height: 512 }, at("public/icons/icon-maskable-512.png"));

// share images
await png(ogHtml(), { width: 1200, height: 630 }, at("app/opengraph-image.png"));
await png(ogHtml(), { width: 1200, height: 630 }, at("app/twitter-image.png"));

await browser.close();
rmSync(tmp, { recursive: true, force: true });
console.log("brand assets written");
