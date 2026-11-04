import http from "http";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

const dist = path.resolve("dist");
const mime = { ".html": "text/html", ".jpg": "image/jpeg", ".png": "image/png", ".js": "text/javascript", ".css": "text/css" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p === "/") p = "/index.html";
  fs.readFile(path.join(dist, p), (e, d) => {
    if (e) { res.writeHead(404); res.end("nf"); }
    else { res.writeHead(200, { "Content-Type": mime[path.extname(p)] || "application/octet-stream" }); res.end(d); }
  });
});
await new Promise((r) => server.listen(4173, r));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chromium = (await import("@sparticuz/chromium")).default;
const browser = await puppeteer.launch({
  headless: "shell",
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
  env: {
    ...process.env,
    LD_LIBRARY_PATH: `/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH || ""}`,
    FONTCONFIG_PATH: "/tmp/fonts",
  },
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

fs.mkdirSync("shots", { recursive: true });

/* ── Desktop ── */
await page.setViewport({ width: 1440, height: 900 });
try { await page.goto("http://localhost:4173", { waitUntil: "networkidle2", timeout: 45000 }); } catch { console.log("goto timeout, continuing"); }
await sleep(2600);
await page.screenshot({ path: "shots/01-hero.png" });

for (const id of ["about", "features", "how-it-works", "partners", "tastes", "why", "faq", "download"]) {
  await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ block: "start" }), id);
  await sleep(1500);
  await page.screenshot({ path: `shots/d-${id}.png` });
}
/* sticky phone mid-scroll */
await page.evaluate(() => document.getElementById("how-it-works").scrollIntoView());
await sleep(600);
await page.evaluate(() => window.scrollBy(0, 650));
await sleep(1200);
await page.screenshot({ path: "shots/d-hiw-mid.png" });
await page.evaluate(() => window.scrollBy(0, 900));
await sleep(1200);
await page.screenshot({ path: "shots/d-hiw-mid2.png" });

/* footer */
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await sleep(1300);
await page.screenshot({ path: "shots/d-footer.png" });

/* FAQ interaction */
await page.evaluate(() => document.getElementById("faq").scrollIntoView());
await sleep(900);
await page.click("#faq-btn-1");
await sleep(700);
await page.screenshot({ path: "shots/d-faq-open.png" });

/* Download modal */
await page.evaluate(() => document.getElementById("download").scrollIntoView());
await sleep(900);
const btns = await page.$$("#download button");
for (const b of btns) {
  const t = await b.evaluate((el) => el.textContent);
  if (t.includes("Android")) { await b.click(); break; }
}
await sleep(700);
await page.screenshot({ path: "shots/d-modal.png" });
await page.keyboard.press("Escape");
await sleep(400);

/* horizontal overflow check */
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("H-OVERFLOW(px):", overflow);

/* ── Mobile ── */
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
try { await page.goto("http://localhost:4173", { waitUntil: "networkidle2", timeout: 45000 }); } catch {}
await sleep(2600);
await page.screenshot({ path: "shots/m-hero.png" });
await page.click('[aria-controls="mobile-nav"]');
await sleep(600);
await page.screenshot({ path: "shots/m-menu.png" });
await page.evaluate(() => document.querySelector('#mobile-nav a[href="#features"]').click());
await sleep(1600);
await page.screenshot({ path: "shots/m-features.png" });
for (const id of ["how-it-works", "tastes", "download"]) {
  await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
  await sleep(1400);
  await page.screenshot({ path: `shots/m-${id}.png` });
}
const mOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("M-OVERFLOW(px):", mOverflow);

console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
await browser.close();
server.close();