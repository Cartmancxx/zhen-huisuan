// Adapted from video-shotcraft/assets/scripts/capture-template.mjs.
// Captures the real extension UI at high resolution with frozen demo rates.

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..", "..");
const videoRoot = path.resolve(here, "..");
const outDir = path.join(videoRoot, "public", "textures", "live");
const layoutPath = path.join(videoRoot, "src", "live-layout.json");

const CONFIG = {
  baseUrl: "http://127.0.0.1:8765",
  viewport: { width: 390, height: 600 },
  deviceScaleFactor: 4,
  settleMs: 650,
  chromePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
};

const DEMO_SNAPSHOT = {
  baseCode: "USD",
  rates: {
    USD: 1,
    CNY: 7.18804,
    HKD: 7.7308,
    VND: 26461.04,
    EUR: 0.8644,
    GBP: 0.7521,
    JPY: 149.86,
    KRW: 1384.2,
    SGD: 1.2874,
    THB: 32.43,
    MYR: 4.216,
    IDR: 16315,
    PHP: 57.12,
    AUD: 1.513,
    CAD: 1.372,
    CHF: 0.802,
    AED: 3.6725,
    SAR: 3.75,
    INR: 87.45,
    MXN: 18.78,
    BRL: 5.57,
  },
  timeLastUpdateUnix: 1785369751,
  timeNextUpdateUnix: 1893456000,
  fetchedAt: Date.now(),
  source: "api",
};

const CAPTURES = [
  { name: "zh-cn-cny", locale: "zh-CN", sourceCode: "CNY", raw: "1,000" },
  { name: "zh-cn-vnd", locale: "zh-CN", sourceCode: "VND", raw: "26.252.670" },
  { name: "en-cny", locale: "en", sourceCode: "CNY", raw: "1,000" },
  { name: "en-vnd", locale: "en", sourceCode: "VND", raw: "26.252.670" },
  { name: "vi-cny", locale: "vi", sourceCode: "CNY", raw: "1.000" },
  { name: "zh-tw-cny", locale: "zh-TW", sourceCode: "CNY", raw: "1,000" },
];

await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(path.dirname(layoutPath), { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: CONFIG.chromePath,
});

const layout = {
  pageW: CONFIG.viewport.width,
  deviceScaleFactor: CONFIG.deviceScaleFactor,
  source: path.relative(projectRoot, fileURLToPath(import.meta.url)),
  captures: {},
};

const getBox = async (locator) => {
  const box = await locator.boundingBox();
  if (!box) return null;
  return {
    x: Number(box.x.toFixed(2)),
    y: Number(box.y.toFixed(2)),
    w: Number(box.width.toFixed(2)),
    h: Number(box.height.toFixed(2)),
  };
};

const settle = async (page) => {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(CONFIG.settleMs);
};

for (const capture of CAPTURES) {
  const context = await browser.newContext({
    viewport: CONFIG.viewport,
    deviceScaleFactor: CONFIG.deviceScaleFactor,
    locale: capture.locale,
    colorScheme: "light",
  });

  await context.route("https://open.er-api.com/**", (route) => route.abort());
  await context.addInitScript(
    ({ snapshot, sourceCode, raw }) => {
      localStorage.setItem("fxRatesCacheV2", JSON.stringify(snapshot));
      localStorage.setItem(
        "fxLastInputV1",
        JSON.stringify({ code: sourceCode, raw }),
      );
      localStorage.setItem(
        "fxSelectedCurrenciesV1",
        JSON.stringify(["CNY", "HKD", "USD", "VND"]),
      );
    },
    {
      snapshot: DEMO_SNAPSHOT,
      sourceCode: capture.sourceCode,
      raw: capture.raw,
    },
  );

  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(
    `${CONFIG.baseUrl}/popup.html?lang=${encodeURIComponent(capture.locale)}`,
    { waitUntil: "networkidle" },
  );
  await page.locator(".currency-row").first().waitFor();
  await settle(page);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const converter = document.querySelector("#converter-view");
    const list = document.querySelector("#currency-list");
    if (converter) converter.scrollTop = 0;
    if (list) list.scrollTop = 0;
  });

  const converter = page.locator("#converter-view");
  await converter.screenshot({
    path: path.join(outDir, `${capture.name}-main.png`),
  });

  const entry = {
    locale: capture.locale,
    sourceCode: capture.sourceCode,
    raw: capture.raw,
    pageH: await page.evaluate(() => document.documentElement.scrollHeight),
    converter: await getBox(converter),
    rows: {},
    inputs: {},
    files: {
      main: `${capture.name}-main.png`,
      empty: `${capture.name}-empty.png`,
    },
    errors,
  };

  for (const code of ["CNY", "HKD", "USD", "VND"]) {
    const row = page.locator(`.currency-row[data-code="${code}"]`);
    const input = page.locator(`.currency-input[data-code="${code}"]`);
    entry.rows[code] = await getBox(row);
    entry.inputs[code] = await getBox(input);

    await row.screenshot({
      path: path.join(outDir, `${capture.name}-row-${code.toLowerCase()}.png`),
    });
    await input.screenshot({
      path: path.join(outDir, `${capture.name}-input-${code.toLowerCase()}.png`),
      omitBackground: true,
    });
  }

  await page.locator(".currency-row").evaluateAll((rows) => {
    for (const row of rows) row.style.visibility = "hidden";
  });
  await converter.screenshot({
    path: path.join(outDir, `${capture.name}-empty.png`),
  });
  await page.locator(".currency-row").evaluateAll((rows) => {
    for (const row of rows) row.style.visibility = "";
  });

  layout.captures[capture.name] = entry;

  if (capture.name === "zh-cn-vnd" || capture.name === "en-vnd") {
    const vndInput = page.locator('.currency-input[data-code="VND"]');
    await vndInput.fill("");
    await page.waitForTimeout(80);
    entry.files.blank = `${capture.name}-blank.png`;
    await converter.screenshot({
      path: path.join(outDir, entry.files.blank),
    });
    await vndInput.fill(capture.raw);
    await page.waitForTimeout(80);
  }

  if (capture.name === "zh-cn-cny" || capture.name === "en-cny") {
    const typingInput = page.locator('.currency-input[data-code="CNY"]');
    const typingStates = [
      ["blank", ""],
      ["1", "1"],
      ["10", "10"],
      ["100", "100"],
      ["1000", "1,000"],
    ];
    entry.files.typing = [];
    for (const [suffix, value] of typingStates) {
      await typingInput.fill(value);
      await page.waitForTimeout(80);
      const file = `${capture.name}-typing-${suffix}.png`;
      await converter.screenshot({ path: path.join(outDir, file) });
      entry.files.typing.push(file);
    }

    await page.locator("#settings-button").click();
    await page.locator("#settings-view:not([hidden])").waitFor();
    await settle(page);

    const settings = page.locator("#settings-view");
    const settingsName =
      capture.name === "zh-cn-cny" ? "zh-cn-settings" : "en-settings";
    await settings.screenshot({
      path: path.join(outDir, `${settingsName}.png`),
    });
    layout.captures[settingsName] = {
      locale: capture.locale,
      pageH: await page.evaluate(() => document.documentElement.scrollHeight),
      settings: await getBox(settings),
      settingRows: await Promise.all(
        await page.locator(".setting-row").evaluateAll((rows) =>
          rows.map((_row, index) => index),
        ).then((indexes) =>
          indexes.map((index) => getBox(page.locator(".setting-row").nth(index))),
        ),
      ),
      sponsorCard: await getBox(page.locator(".sponsor-card")),
      files: { settings: `${settingsName}.png` },
      errors: [...errors],
    };
  }

  await context.close();
}

await fs.writeFile(layoutPath, `${JSON.stringify(layout, null, 2)}\n`, "utf8");
await browser.close();

console.log(
  JSON.stringify({
    captures: Object.keys(layout.captures),
    outDir,
    layoutPath,
  }),
);
