import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = dirname(scriptDirectory);
const iconDirectory = join(projectDirectory, "icons");
const edgeAssetDirectory = join(projectDirectory, "store-assets", "edge");
const source = await readFile(join(iconDirectory, "icon.svg"));

for (const size of [16, 32, 48, 128]) {
  await sharp(source)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(join(iconDirectory, `icon-${size}.png`));
}

await mkdir(edgeAssetDirectory, { recursive: true });
await sharp(source)
  .resize(300, 300)
  .png({ compressionLevel: 9 })
  .toFile(join(edgeAssetDirectory, "logo-300x300.png"));

console.log("Generated extension icons: 16, 32, 48, 128 px; Edge logo: 300 px");
