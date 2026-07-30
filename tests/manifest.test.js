import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(
  await readFile(join(projectDirectory, "manifest.json"), "utf8")
);

test("uses a minimal Manifest V3 permission surface", () => {
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.version, "2.1.0");
  assert.equal(manifest.name, "__MSG_extensionName__");
  assert.equal(manifest.description, "__MSG_extensionDescription__");
  assert.equal(manifest.default_locale, "en");
  assert.deepEqual(manifest.permissions, ["storage"]);
  assert.deepEqual(manifest.host_permissions, ["https://open.er-api.com/*"]);
  assert.equal("content_scripts" in manifest, false);
  assert.equal("background" in manifest, false);
});

test("all popup and icon files referenced by the manifest exist", async () => {
  const referencedFiles = [
    manifest.action.default_popup,
    ...Object.values(manifest.action.default_icon),
    ...Object.values(manifest.icons)
  ];

  for (const relativePath of new Set(referencedFiles)) {
    const absolutePath = join(projectDirectory, relativePath);
    await access(absolutePath);
    assert.ok((await stat(absolutePath)).size > 0, `${relativePath} is empty`);
  }
});

test("provides valid Chinese and English store locales", async () => {
  for (const locale of ["zh_CN", "zh_TW", "en", "vi"]) {
    const messages = JSON.parse(
      await readFile(
        join(projectDirectory, "_locales", locale, "messages.json"),
        "utf8"
      )
    );
    assert.ok(messages.extensionName?.message);
    assert.ok(messages.extensionDescription?.message);
  }
});

test("popup contains no remotely hosted executable code", async () => {
  const html = await readFile(
    join(projectDirectory, manifest.action.default_popup),
    "utf8"
  );

  const scriptSources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
    (match) => match[1]
  );
  assert.deepEqual(scriptSources, ["popup.js"]);
  assert.equal(/<script(?![^>]+src=)/i.test(html), false);
});

test("all popup image assets are local and present", async () => {
  const html = await readFile(
    join(projectDirectory, manifest.action.default_popup),
    "utf8"
  );
  const imageSources = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(
    (match) => match[1]
  );

  assert.deepEqual([...new Set(imageSources)], ["assets/sponsor-code.jpg"]);
  for (const relativePath of imageSources) {
    assert.equal(/^https?:/i.test(relativePath), false);
    await access(join(projectDirectory, relativePath));
  }
});
