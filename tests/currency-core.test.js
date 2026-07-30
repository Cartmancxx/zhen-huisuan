import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_CURRENCY_CODES,
  FALLBACK_SNAPSHOT,
  convertAmount,
  createSnapshotFromApi,
  formatAmount,
  getCurrencyFractionDigits,
  getCurrencyName,
  isValidSnapshot,
  normalizeCurrencySelection,
  parseAmount
} from "../currency-core.js";

test("parses common thousands separators and decimal formats", () => {
  assert.equal(parseAmount("1,234.56", "CNY"), 1234.56);
  assert.equal(parseAmount("1，234.56", "CNY"), 1234.56);
  assert.equal(parseAmount("1.234,56", "CNY"), 1234.56);
  assert.equal(parseAmount("1 234 567,89", "HKD"), 1234567.89);
  assert.equal(parseAmount("1,234,567.89", "USD"), 1234567.89);
  assert.equal(parseAmount("26.252.670", "VND"), 26252670);
  assert.equal(parseAmount("1.000", "VND"), 1000);
  assert.equal(parseAmount("1.000", "JPY"), 1000);
  assert.equal(parseAmount("1.234", "USD"), 1.234);
});

test("parses pasted symbols, full-width digits, negatives and apostrophes", () => {
  assert.equal(parseAmount("￥ １，２３４．５０", "CNY"), 1234.5);
  assert.equal(parseAmount("HK$ 12'345.67", "HKD"), 12345.67);
  assert.equal(parseAmount("(1,250.50)", "USD"), -1250.5);
  assert.equal(parseAmount("- 2 500", "USD"), -2500);
});

test("rejects empty and non-numeric values", () => {
  assert.equal(parseAmount("", "CNY"), null);
  assert.equal(parseAmount("人民币", "CNY"), null);
  assert.equal(parseAmount(null, "USD"), null);
});

test("formats currencies with useful precision and thousands separators", () => {
  assert.equal(formatAmount(1234.5, "CNY"), "1,234.50");
  assert.equal(formatAmount(1234.5, "USD"), "1,234.50");
  assert.equal(formatAmount(1234.5, "VND"), "1,235");
  assert.equal(formatAmount(1234.5, "JPY"), "1,235");
  assert.equal(formatAmount(1.2345, "KWD"), "1.235");
  assert.equal(formatAmount(0.000456, "USD"), "0.000456");
  assert.equal(formatAmount(1234.5, "USD", "en"), "1,234.50");
  assert.equal(formatAmount(1234.5, "USD", "vi"), "1.234,50");
});

test("converts configurable target currencies through the USD base rate", () => {
  const rates = {
    ...FALLBACK_SNAPSHOT.rates,
    EUR: 0.875
  };
  const result = convertAmount(
    rates.CNY,
    "CNY",
    rates,
    ["USD", "HKD", "EUR"]
  );

  assert.ok(result);
  assert.equal(result.USD, 1);
  assert.equal(result.HKD, rates.HKD);
  assert.equal(result.EUR, rates.EUR);
  assert.equal("VND" in result, false);
});

test("normalizes dynamic currency selections and metadata", () => {
  assert.deepEqual(
    normalizeCurrencySelection(["usd", "EUR", "USD", "JPY"]),
    ["USD", "EUR", "JPY"]
  );
  assert.deepEqual(normalizeCurrencySelection(["USD"]), DEFAULT_CURRENCY_CODES);
  assert.equal(
    normalizeCurrencySelection([
      "USD",
      "EUR",
      "JPY",
      "GBP",
      "CNY",
      "HKD",
      "VND",
      "SGD",
      "AUD"
    ]).length,
    8
  );
  assert.equal(getCurrencyName("CNY"), "人民币");
  assert.equal(getCurrencyName("HKD"), "港币");
  assert.notEqual(getCurrencyName("USD", "en"), getCurrencyName("USD", "zh-CN"));
  assert.notEqual(getCurrencyName("VND", "vi"), "VND");
  assert.equal(getCurrencyFractionDigits("VND"), 0);
  assert.equal(getCurrencyFractionDigits("KWD"), 3);
});

test("validates and normalizes API payloads", () => {
  const payload = {
    result: "success",
    base_code: "USD",
    time_last_update_unix: 1700000000,
    time_next_update_unix: 1700086400,
    rates: {
      USD: 1,
      CNY: 7.1,
      HKD: 7.8,
      VND: 25000,
      EUR: 0.92
    }
  };

  const snapshot = createSnapshotFromApi(payload, 1700000000000);
  assert.equal(snapshot.source, "api");
  assert.equal(snapshot.rates.VND, 25000);
  assert.equal(snapshot.rates.EUR, 0.92);
  assert.equal(isValidSnapshot(snapshot), true);
  assert.throws(
    () => createSnapshotFromApi({ ...payload, rates: { EUR: 1 } }),
    /无效数据/
  );
});
