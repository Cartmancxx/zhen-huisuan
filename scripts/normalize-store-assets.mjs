import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = dirname(scriptDirectory);
const storeAssetDirectory = join(projectDirectory, "store-assets");

const files = [
  ["chrome", "screenshot-main-1280x800.png"],
  ["chrome", "screenshot-settings-1280x800.png"],
  ["chrome", "promo-small-440x280.png"],
  ["chrome", "promo-marquee-1400x560.png"],
  ["edge", "screenshot-main-1280x800.png"],
  ["edge", "screenshot-settings-1280x800.png"],
  ["edge", "promo-small-440x280.png"],
  ["edge", "promo-large-1400x560.png"]
];

for (const segments of files) {
  const path = join(storeAssetDirectory, ...segments);
  const source = await readFile(path);
  const png = await sharp(source).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(path, png);
}

console.log(`Normalized ${files.length} store images to PNG`);
