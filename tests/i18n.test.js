import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_UI_LOCALE,
  UI_MESSAGES,
  createTranslator,
  resolveUiLocale
} from "../i18n.js";

const projectDirectory = dirname(dirname(fileURLToPath(import.meta.url)));

test("resolves supported browser languages and falls back to English", () => {
  assert.equal(resolveUiLocale("zh-CN"), "zh-CN");
  assert.equal(resolveUiLocale("zh-HK"), "zh-TW");
  assert.equal(resolveUiLocale("zh-Hant-TW"), "zh-TW");
  assert.equal(resolveUiLocale("vi-VN"), "vi");
  assert.equal(resolveUiLocale("en-GB"), "en");
  assert.equal(resolveUiLocale("fr-FR"), DEFAULT_UI_LOCALE);
  assert.equal(resolveUiLocale(["fr-FR", "vi-VN"]), "vi");
});

test("all interface locales provide the same non-empty message keys", () => {
  const expectedKeys = Object.keys(UI_MESSAGES.en).sort();

  for (const [locale, messages] of Object.entries(UI_MESSAGES)) {
    assert.deepEqual(Object.keys(messages).sort(), expectedKeys, locale);
    for (const [key, value] of Object.entries(messages)) {
      assert.ok(value.trim(), `${locale}.${key} is empty`);
    }
  }
});

test("translates placeholders without losing unknown values", () => {
  const english = createTranslator("en-US");
  const traditionalChinese = createTranslator("zh-HK");

  assert.equal(english("addedCurrency", { currency: "Euro" }), "Added Euro");
  assert.equal(
    traditionalChinese("maximumCurrencies", { count: 8 }),
    "最多同時顯示 8 種貨幣"
  );
});

test("every popup translation key exists in every interface locale", async () => {
  const html = await readFile(join(projectDirectory, "popup.html"), "utf8");
  const keys = [
    ...html.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g)
  ].map((match) => match[1]);

  assert.ok(keys.length > 0);
  for (const [locale, messages] of Object.entries(UI_MESSAGES)) {
    for (const key of new Set(keys)) {
      assert.ok(messages[key], `${locale} is missing ${key}`);
    }
  }
});
