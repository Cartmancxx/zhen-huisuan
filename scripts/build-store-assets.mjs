import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = dirname(scriptDirectory);
const storeRoot = join(projectDirectory, "store-assets");
const liveRoot = join(projectDirectory, "video", "public", "textures", "live");
const iconPath = join(projectDirectory, "icons", "icon-128.png");

const FONT =
  "Segoe UI Variable, Segoe UI, Microsoft YaHei UI, Microsoft YaHei, PingFang SC, sans-serif";

const localeCopy = {
  "zh-CN": {
    name: "真汇算",
    eyebrow: "每个货币框，都是输入框",
    title: ["不选方向，", "输入即算"],
    body: ["输入 1,000，会识别为 1000。", "其他货币金额立即联动。"],
    chips: ["任意币种输入", "2–8 种货币", "约 165 种货币"],
    main: "zh-cn-cny-main.png",
    settings: "zh-cn-settings.png",
    settingsTitle: ["币种和数量，", "都由你定"],
    settingsBody: ["自动跟随浏览器语言", "设置与汇率保存在本地", "开源免费，赞助完全自愿"],
    promoTitle: "多币种，即输即算",
    promoSmallTitle: ["多币种", "即输即算"],
    promoSub: "无换算按钮 · 千分符直接识别",
  },
  "zh-TW": {
    name: "真匯算",
    eyebrow: "每個貨幣欄，都是輸入欄",
    title: ["不用選方向，", "輸入即算"],
    body: ["輸入 1,000，會辨識為 1000。", "其他貨幣金額立即連動。"],
    chips: ["任意幣種輸入", "2–8 種貨幣", "約 165 種貨幣"],
    main: "zh-tw-cny-main.png",
    promoTitle: "多幣種，輸入即算",
    promoSmallTitle: ["多幣種", "輸入即算"],
    promoSub: "不用轉換按鈕 · 千分位直接辨識",
  },
  en: {
    name: "Zhen Hui Suan",
    eyebrow: "EVERY CURRENCY IS AN INPUT",
    title: ["No direction.", "No Convert button."],
    body: ["Paste 1,000 and it is read as 1000.", "Every other amount updates instantly."],
    chips: ["Any currency", "2–8 on screen", "~165 currencies"],
    main: "en-cny-main.png",
    settings: "en-settings.png",
    settingsTitle: ["Your currencies.", "Your layout."],
    settingsBody: [
      "Automatically follows browser language",
      "Settings and rates stay in your browser",
      "Free and open source; sponsorship is optional",
    ],
    promoTitle: "Any currency. Instant conversion.",
    promoSmallTitle: ["Any currency.", "Instant conversion."],
    promoSub: "No Convert button · Thousands separators understood",
  },
  vi: {
    name: "Zhen Hui Suan",
    eyebrow: "MỌI Ô TIỀN TỆ ĐỀU CÓ THỂ NHẬP",
    title: ["Không chọn chiều.", "Nhập là quy đổi."],
    body: ["Nhập 1.000 và hệ thống hiểu là 1000.", "Các số tiền khác cập nhật ngay."],
    chips: ["Nhập ở mọi ô", "Hiện 2–8 tiền tệ", "~165 tiền tệ"],
    main: "vi-cny-main.png",
    promoTitle: "Nhập tiền tệ nào cũng được",
    promoSmallTitle: ["Nhập tiền tệ nào", "cũng quy đổi được"],
    promoSub: "Không cần nút quy đổi · Hiểu dấu phân cách",
  },
};

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const textLines = ({
  lines,
  x,
  y,
  size,
  lineHeight,
  fill,
  weight = 700,
  letterSpacing = 0,
}) =>
  lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" fill="${fill}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}">${escapeXml(line)}</text>`,
    )
    .join("\n");

const mainBackgroundSvg = (copy) => `
<svg width="1280" height="800" viewBox="0 0 1280 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#071426"/>
      <stop offset=".62" stop-color="#0b1f3a"/>
      <stop offset="1" stop-color="#08295c"/>
    </linearGradient>
    <radialGradient id="halo">
      <stop offset="0" stop-color="#1265e9" stop-opacity=".38"/>
      <stop offset="1" stop-color="#1265e9" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="800" fill="url(#bg)"/>
  <circle cx="1048" cy="354" r="360" fill="url(#halo)"/>
  <circle cx="1016" cy="398" r="306" fill="none" stroke="#8ab7ff" stroke-opacity=".13"/>
  <rect x="756" y="48" width="484" height="688" rx="38" fill="#06162a" fill-opacity=".58" stroke="#8ab7ff" stroke-opacity=".2"/>

  <rect x="70" y="58" width="48" height="48" rx="13" fill="#1265e9"/>
  <path d="M82 78h23m-8-7 8 7-8 7m8 11H82m8-7-8 7 8 7" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="132" y="94" fill="white" font-family="${FONT}" font-size="30" font-weight="800">${escapeXml(copy.name)}</text>

  <text x="72" y="226" fill="#8ab7ff" font-family="${FONT}" font-size="20" font-weight="800" letter-spacing="2">${escapeXml(copy.eyebrow)}</text>
  ${textLines({ lines: copy.title, x: 70, y: 316, size: copy === localeCopy.en ? 62 : 74, lineHeight: 82, fill: "#ffffff", weight: 820, letterSpacing: -2.5 })}
  ${textLines({ lines: copy.body, x: 72, y: 526, size: 27, lineHeight: 43, fill: "#b6c6df", weight: 560, letterSpacing: -0.4 })}

  ${copy.chips
    .map((chip, index) => {
      const widths = copy === localeCopy.en ? [150, 150, 170] : [152, 158, 176];
      const x = 72 + widths.slice(0, index).reduce((sum, width) => sum + width + 12, 0);
      return `<rect x="${x}" y="642" width="${widths[index]}" height="46" rx="23" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".17"/>
      <text x="${x + widths[index] / 2}" y="673" text-anchor="middle" fill="#e7f0ff" font-family="${FONT}" font-size="17" font-weight="700">${escapeXml(chip)}</text>`;
    })
    .join("\n")}
</svg>`;

const settingsBackgroundSvg = (copy) => `
<svg width="1280" height="800" viewBox="0 0 1280 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#e9f2ff"/>
    </linearGradient>
    <radialGradient id="halo">
      <stop offset="0" stop-color="#1265e9" stop-opacity=".17"/>
      <stop offset="1" stop-color="#1265e9" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="800" fill="url(#bg)"/>
  <circle cx="1050" cy="235" r="330" fill="url(#halo)"/>
  <rect x="780" y="42" width="420" height="716" rx="36" fill="#ffffff" stroke="#cddcff"/>

  <rect x="70" y="58" width="48" height="48" rx="13" fill="#1265e9"/>
  <path d="M82 78h23m-8-7 8 7-8 7m8 11H82m8-7-8 7 8 7" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="132" y="94" fill="#13161b" font-family="${FONT}" font-size="30" font-weight="800">${escapeXml(copy.name)}</text>

  ${textLines({ lines: copy.settingsTitle, x: 72, y: 290, size: copy === localeCopy.en ? 62 : 72, lineHeight: 80, fill: "#13161b", weight: 820, letterSpacing: -2.5 })}
  ${copy.settingsBody
    .map(
      (line, index) => `
        <circle cx="88" cy="${504 + index * 58}" r="14" fill="#2ab24b"/>
        <path d="M81 ${504 + index * 58}l5 5 9-12" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="118" y="${513 + index * 58}" fill="#4b5665" font-family="${FONT}" font-size="${copy === localeCopy.en ? 22 : 24}" font-weight="650">${escapeXml(line)}</text>
      `,
    )
    .join("\n")}
  <rect x="72" y="698" width="620" height="52" rx="18" fill="#1265e9" fill-opacity=".08" stroke="#1265e9" stroke-opacity=".18"/>
  <text x="382" y="732" text-anchor="middle" fill="#0759d8" font-family="${FONT}" font-size="20" font-weight="750">${escapeXml(copy === localeCopy.en ? "Optional support never unlocks features" : "喜欢就赞助，不赞助也不影响任何功能")}</text>
</svg>`;

const promoSvg = (copy, width, height, large) => `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0759d8"/>
      <stop offset="1" stop-color="#1265e9"/>
    </linearGradient>
    <radialGradient id="halo">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".22"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${width * 0.86}" cy="${height * 0.28}" r="${height * 0.72}" fill="url(#halo)"/>
  <circle cx="${width * 0.89}" cy="${height * 0.23}" r="${height * 0.5}" fill="none" stroke="#fff" stroke-opacity=".11" stroke-width="${Math.max(2, height * 0.04)}"/>
  <text x="${large ? 170 : 144}" y="${large ? 170 : 104}" fill="#ffffff" font-family="${FONT}" font-size="${large ? 34 : 25}" font-weight="800">${escapeXml(copy.name)}</text>
  ${
    large
      ? `<text x="88" y="318" fill="#ffffff" font-family="${FONT}" font-size="${copy === localeCopy.en ? 60 : 68}" font-weight="820" letter-spacing="-2">${escapeXml(copy.promoTitle)}</text>`
      : textLines({
          lines: copy.promoSmallTitle,
          x: 34,
          y: 158,
          size: copy === localeCopy.en || copy === localeCopy.vi ? 27 : 34,
          lineHeight: 34,
          fill: "#ffffff",
          weight: 820,
          letterSpacing: -1.2,
        })
  }
  <text x="${large ? 90 : 36}" y="${large ? 382 : 246}" fill="#d8e8ff" font-family="${FONT}" font-size="${large ? 25 : 13}" font-weight="600">${escapeXml(copy.promoSub)}</text>
  ${
    large
      ? `<rect x="88" y="430" width="290" height="46" rx="23" fill="#ffffff" fill-opacity=".12" stroke="#ffffff" stroke-opacity=".2"/>
         <text x="233" y="460" text-anchor="middle" fill="#ffffff" font-family="${FONT}" font-size="17" font-weight="700">Chrome · Edge · Open source</text>`
      : ""
  }
</svg>`;

const makeMainScreenshot = async (locale, copy) => {
  const popup = await sharp(join(liveRoot, copy.main))
    .resize({ width: 430 })
    .png()
    .toBuffer();
  const background = await sharp(Buffer.from(mainBackgroundSvg(copy))).png().toBuffer();
  const result = await sharp(background)
    .composite([{ input: popup, left: 783, top: 78 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  return result;
};

const makeSettingsScreenshot = async (copy) => {
  const settings = await sharp(join(liveRoot, copy.settings))
    .resize({ width: 384 })
    .png()
    .toBuffer();
  const background = await sharp(Buffer.from(settingsBackgroundSvg(copy))).png().toBuffer();
  return sharp(background)
    .composite([{ input: settings, left: 798, top: 64 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const makePromo = async (copy, width, height, large) => {
  const iconSize = large ? 64 : 78;
  const icon = await sharp(iconPath).resize(iconSize, iconSize).png().toBuffer();
  const background = await sharp(
    Buffer.from(promoSvg(copy, width, height, large)),
  )
    .png()
    .toBuffer();
  return sharp(background)
    .composite([
      {
        input: icon,
        left: large ? 88 : 38,
        top: large ? 94 : 40,
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

for (const [locale, copy] of Object.entries(localeCopy)) {
  const chromeDirectory = join(storeRoot, "chrome", locale);
  const edgeDirectory = join(storeRoot, "edge", locale);
  const videoDirectory = join(storeRoot, "video", locale);
  await mkdir(chromeDirectory, { recursive: true });
  await mkdir(edgeDirectory, { recursive: true });
  await mkdir(videoDirectory, { recursive: true });

  const mainScreenshot = await makeMainScreenshot(locale, copy);
  const promoSmall = await makePromo(copy, 440, 280, false);
  const promoLarge = await makePromo(copy, 1400, 560, true);
  const youtubeThumbnail = await sharp(mainScreenshot)
    .extract({ left: 0, top: 40, width: 1280, height: 720 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  for (const directory of [chromeDirectory, edgeDirectory]) {
    await writeFile(
      join(directory, "screenshot-01-any-input-1280x800.png"),
      mainScreenshot,
    );
    await writeFile(join(directory, "promo-small-440x280.png"), promoSmall);
    await writeFile(join(directory, "promo-large-1400x560.png"), promoLarge);
  }
  await writeFile(
    join(videoDirectory, "youtube-thumbnail-1280x720.png"),
    youtubeThumbnail,
  );

  if (copy.settings) {
    const settingsScreenshot = await makeSettingsScreenshot(copy);
    for (const directory of [chromeDirectory, edgeDirectory]) {
      await writeFile(
        join(directory, "screenshot-02-settings-1280x800.png"),
        settingsScreenshot,
      );
    }
  }
}

// Keep the existing top-level filenames as the Simplified Chinese defaults.
await copyFile(
  join(storeRoot, "chrome", "zh-CN", "screenshot-01-any-input-1280x800.png"),
  join(storeRoot, "chrome", "screenshot-main-1280x800.png"),
);
await copyFile(
  join(storeRoot, "chrome", "zh-CN", "screenshot-02-settings-1280x800.png"),
  join(storeRoot, "chrome", "screenshot-settings-1280x800.png"),
);
await copyFile(
  join(storeRoot, "chrome", "en", "promo-small-440x280.png"),
  join(storeRoot, "chrome", "promo-small-440x280.png"),
);
await copyFile(
  join(storeRoot, "chrome", "en", "promo-large-1400x560.png"),
  join(storeRoot, "chrome", "promo-marquee-1400x560.png"),
);

await copyFile(
  join(storeRoot, "edge", "zh-CN", "screenshot-01-any-input-1280x800.png"),
  join(storeRoot, "edge", "screenshot-main-1280x800.png"),
);
await copyFile(
  join(storeRoot, "edge", "zh-CN", "screenshot-02-settings-1280x800.png"),
  join(storeRoot, "edge", "screenshot-settings-1280x800.png"),
);
await copyFile(
  join(storeRoot, "edge", "zh-CN", "promo-small-440x280.png"),
  join(storeRoot, "edge", "promo-small-440x280.png"),
);
await copyFile(
  join(storeRoot, "edge", "zh-CN", "promo-large-1400x560.png"),
  join(storeRoot, "edge", "promo-large-1400x560.png"),
);

console.log(
  `Built localized store assets for ${Object.keys(localeCopy).join(", ")}`,
);
