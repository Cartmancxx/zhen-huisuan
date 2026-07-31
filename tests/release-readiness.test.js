import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = dirname(dirname(fileURLToPath(import.meta.url)));

async function assertNonEmpty(relativePath) {
  const absolutePath = join(projectDirectory, relativePath);
  await access(absolutePath);
  assert.ok((await stat(absolutePath)).size > 0, `${relativePath} is empty`);
}

async function readPngDimensions(relativePath) {
  const data = await readFile(join(projectDirectory, relativePath));
  assert.equal(data.subarray(1, 4).toString("ascii"), "PNG");
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20)
  };
}

test("includes the required open-source and release documentation", async () => {
  for (const relativePath of [
    "LICENSE",
    "README.md",
    "README_EN.md",
    "PRIVACY.md",
    "PRIVACY_EN.md",
    "CONTRIBUTING.md",
    "PUBLISHING.md",
    "STORE_SUBMISSION_GUIDE.md",
    "SECURITY.md",
    "CODE_OF_CONDUCT.md",
    "CHANGELOG.md",
    "store-listing/chrome-zh-CN.md",
    "store-listing/chrome-zh-TW.md",
    "store-listing/chrome-en.md",
    "store-listing/chrome-vi.md",
    "store-listing/edge-zh-CN.md",
    "store-listing/edge-zh-TW.md",
    "store-listing/edge-en.md",
    "store-listing/edge-vi.md",
    "store-listing/YOUTUBE_UPLOAD.md",
    "video/README.md",
    "video/AUDIO-CREDITS.md",
    "social/小红书宣发稿.md"
  ]) {
    await assertNonEmpty(relativePath);
  }

  const license = await readFile(join(projectDirectory, "LICENSE"), "utf8");
  assert.match(license, /MIT License/);
  const readme = await readFile(join(projectDirectory, "README.md"), "utf8");
  assert.match(readme, /^# 真汇算/m);
  assert.match(readme, /assets\/sponsor-code\.jpg/);
  await assertNonEmpty("assets/sponsor-code.jpg");

  for (const relativePath of [
    "store-assets/video/zh-CN/zhen-huisuan-promo-zh.mp4",
    "store-assets/video/en/zhen-huisuan-promo-en.mp4"
  ]) {
    const video = await readFile(join(projectDirectory, relativePath));
    assert.ok(video.length > 1_000_000, `${relativePath} is unexpectedly small`);
    assert.equal(video.subarray(4, 8).toString("ascii"), "ftyp");
  }
});

test("store images use the required dimensions", async () => {
  const expected = new Map([
    ["store-assets/chrome/screenshot-main-1280x800.png", [1280, 800]],
    ["store-assets/chrome/screenshot-settings-1280x800.png", [1280, 800]],
    ["store-assets/chrome/promo-small-440x280.png", [440, 280]],
    ["store-assets/chrome/promo-marquee-1400x560.png", [1400, 560]],
    ["store-assets/edge/logo-300x300.png", [300, 300]],
    ["store-assets/edge/screenshot-main-1280x800.png", [1280, 800]],
    ["store-assets/edge/screenshot-settings-1280x800.png", [1280, 800]],
    ["store-assets/edge/promo-small-440x280.png", [440, 280]],
    ["store-assets/edge/promo-large-1400x560.png", [1400, 560]],
    ["store-assets/video/zh-CN/youtube-thumbnail-1280x720.png", [1280, 720]],
    ["store-assets/video/zh-TW/youtube-thumbnail-1280x720.png", [1280, 720]],
    ["store-assets/video/en/youtube-thumbnail-1280x720.png", [1280, 720]],
    ["store-assets/video/vi/youtube-thumbnail-1280x720.png", [1280, 720]]
  ]);

  for (const store of ["chrome", "edge"]) {
    for (const locale of ["zh-CN", "zh-TW", "en", "vi"]) {
      expected.set(
        `store-assets/${store}/${locale}/screenshot-01-any-input-1280x800.png`,
        [1280, 800]
      );
      expected.set(
        `store-assets/${store}/${locale}/promo-small-440x280.png`,
        [440, 280]
      );
      expected.set(
        `store-assets/${store}/${locale}/promo-large-1400x560.png`,
        [1400, 560]
      );
    }

    for (const locale of ["zh-CN", "en"]) {
      expected.set(
        `store-assets/${store}/${locale}/screenshot-02-settings-1280x800.png`,
        [1280, 800]
      );
    }
  }

  for (const [relativePath, [width, height]] of expected) {
    assert.deepEqual(await readPngDimensions(relativePath), { width, height });
  }
});

test("store copy explains localized amount parsing without scientific notation claims", async () => {
  for (const relativePath of [
    "store-listing/chrome-zh-CN.md",
    "store-listing/chrome-en.md",
    "store-listing/edge-zh-CN.md",
    "store-listing/edge-en.md"
  ]) {
    const content = await readFile(join(projectDirectory, relativePath), "utf8");
    assert.match(content, /1,000/);
    assert.match(content, /1000/);
    assert.doesNotMatch(content, /科学计数法|scientific notation/i);
  }
});

test("store copy describes the daily reference-rate limitation", async () => {
  for (const relativePath of [
    "store-listing/chrome-zh-CN.md",
    "store-listing/edge-zh-CN.md",
    "social/小红书宣发稿.md"
  ]) {
    const content = await readFile(join(projectDirectory, relativePath), "utf8");
    assert.match(content, /每日参考|每日更新/);
    assert.match(content, /不是逐秒|并非逐秒/);
  }
});
