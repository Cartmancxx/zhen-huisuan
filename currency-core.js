export const DEFAULT_CURRENCY_CODES = Object.freeze([
  "CNY",
  "HKD",
  "USD",
  "VND"
]);

export const MIN_VISIBLE_CURRENCIES = 2;
export const MAX_VISIBLE_CURRENCIES = 8;

export const COMMON_CURRENCY_CODES = Object.freeze([
  "CNY",
  "HKD",
  "USD",
  "VND",
  "EUR",
  "GBP",
  "JPY",
  "KRW",
  "SGD",
  "THB",
  "MYR",
  "IDR",
  "MOP",
  "TWD",
  "AUD",
  "CAD",
  "CHF",
  "NZD",
  "PHP",
  "INR",
  "AED",
  "SAR"
]);

const CURRENCY_NAME_OVERRIDES = Object.freeze({
  CNY: "人民币",
  CNH: "离岸人民币",
  HKD: "港币",
  USD: "美元",
  VND: "越南盾",
  EUR: "欧元",
  GBP: "英镑",
  JPY: "日元",
  KRW: "韩元",
  SGD: "新加坡元",
  THB: "泰铢",
  MYR: "马来西亚林吉特",
  IDR: "印尼盾",
  MOP: "澳门元",
  TWD: "新台币"
});

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "ISK",
  "JPY",
  "KMF",
  "KRW",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF"
]);

const THREE_DECIMAL_CURRENCIES = new Set([
  "BHD",
  "IQD",
  "JOD",
  "KWD",
  "LYD",
  "OMR",
  "TND"
]);

let currencyDisplayNames;
try {
  currencyDisplayNames = new Intl.DisplayNames(["zh-CN"], { type: "currency" });
} catch {
  currencyDisplayNames = null;
}

// 首次安装且离线时使用。联网成功后会被包含全部可用币种的最新缓存替换。
export const FALLBACK_SNAPSHOT = Object.freeze({
  baseCode: "USD",
  rates: Object.freeze({
    USD: 1,
    CNY: 6.773647,
    HKD: 7.842148,
    VND: 26254.003815
  }),
  timeLastUpdateUnix: 1785369751,
  timeNextUpdateUnix: 1785456381,
  fetchedAt: 1785369751000,
  source: "fallback"
});

export function getCurrencyName(currencyCode) {
  const code = String(currencyCode || "").toUpperCase();
  if (CURRENCY_NAME_OVERRIDES[code]) {
    return CURRENCY_NAME_OVERRIDES[code];
  }

  try {
    const localizedName = currencyDisplayNames?.of(code);
    return localizedName && localizedName !== code ? localizedName : code;
  } catch {
    return code;
  }
}

export function getCurrencyFractionDigits(currencyCode) {
  const code = String(currencyCode || "").toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(code)) {
    return 0;
  }
  if (THREE_DECIMAL_CURRENCIES.has(code)) {
    return 3;
  }
  if (code === "CLF") {
    return 4;
  }
  return 2;
}

export function sortCurrencyCodes(currencyCodes) {
  const uniqueCodes = [
    ...new Set(
      currencyCodes
        .map((code) => String(code).toUpperCase())
        .filter((code) => /^[A-Z]{3}$/.test(code))
    )
  ];
  const commonRank = new Map(
    COMMON_CURRENCY_CODES.map((code, index) => [code, index])
  );

  return uniqueCodes.sort((left, right) => {
    const leftRank = commonRank.get(left);
    const rightRank = commonRank.get(right);
    if (leftRank !== undefined || rightRank !== undefined) {
      return (leftRank ?? Number.MAX_SAFE_INTEGER) -
        (rightRank ?? Number.MAX_SAFE_INTEGER);
    }

    return getCurrencyName(left).localeCompare(getCurrencyName(right), "zh-CN");
  });
}

export function normalizeCurrencySelection(
  currencyCodes,
  fallback = DEFAULT_CURRENCY_CODES
) {
  const normalized = [
    ...new Set(
      (Array.isArray(currencyCodes) ? currencyCodes : [])
        .map((code) => String(code).toUpperCase())
        .filter((code) => /^[A-Z]{3}$/.test(code))
    )
  ].slice(0, MAX_VISIBLE_CURRENCIES);

  if (normalized.length < MIN_VISIBLE_CURRENCIES) {
    return [...fallback];
  }
  return normalized;
}

function normalizeCharacters(value) {
  return String(value)
    .replace(/[０-９]/g, (character) =>
      String.fromCharCode(character.charCodeAt(0) - 0xfee0)
    )
    .replace(/[，､]/g, ",")
    .replace(/[。．]/g, ".")
    .replace(/[−–—]/g, "-");
}

function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

function parseSingleSeparator(value, separator, currencyCode) {
  const parts = value.split(separator);

  if (parts.length > 2) {
    const groupingParts = parts.slice(1);
    const isWesternGrouping = groupingParts.every((part) => part.length === 3);
    const isIndianGrouping =
      groupingParts.at(-1)?.length === 3 &&
      groupingParts.slice(0, -1).every((part) => part.length === 2);

    if (isWesternGrouping || isIndianGrouping) {
      return parts.join("");
    }

    const fraction = digitsOnly(parts.pop() ?? "");
    const integer = digitsOnly(parts.join(""));
    return fraction ? `${integer || "0"}.${fraction}` : integer;
  }

  const [integerPart = "", fractionPart = ""] = parts;
  const integer = digitsOnly(integerPart);
  const fraction = digitsOnly(fractionPart);

  if (!fraction) {
    return integer;
  }

  const isLikelyThousandsSeparator =
    fraction.length === 3 &&
    (separator === "," || getCurrencyFractionDigits(currencyCode) === 0) &&
    integer.length > 0 &&
    integer !== "0";

  if (isLikelyThousandsSeparator) {
    return `${integer}${fraction}`;
  }

  return `${integer || "0"}.${fraction}`;
}

/**
 * 支持：
 * 1,234.56 / 1.234,56 / 1 234 567,89 / 26.252.670 / 全角数字。
 * 零小数币种中，单个 "." 后恰好三位时按千分符处理。
 */
export function parseAmount(rawValue, currencyCode = "") {
  if (rawValue === null || rawValue === undefined) {
    return null;
  }

  const normalized = normalizeCharacters(rawValue).trim();
  if (!normalized) {
    return null;
  }

  const isParenthesizedNegative =
    normalized.startsWith("(") && normalized.endsWith(")");
  const isSignedNegative = normalized.replace(/^[^\d-]*/, "").startsWith("-");
  const isNegative = isParenthesizedNegative || isSignedNegative;

  const numericText = normalized
    .replace(/[^\d.,'’\s\u00a0\u202f+-]/g, "")
    .replace(/[+-]/g, "")
    .replace(/['’\s\u00a0\u202f]/g, "");

  if (!/\d/.test(numericText)) {
    return null;
  }

  const lastComma = numericText.lastIndexOf(",");
  const lastDot = numericText.lastIndexOf(".");
  let machineValue;

  if (lastComma >= 0 && lastDot >= 0) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const decimalIndex = numericText.lastIndexOf(decimalSeparator);
    const integer = digitsOnly(numericText.slice(0, decimalIndex));
    const fraction = digitsOnly(numericText.slice(decimalIndex + 1));
    machineValue = fraction ? `${integer || "0"}.${fraction}` : integer;
  } else if (lastComma >= 0) {
    machineValue = parseSingleSeparator(numericText, ",", currencyCode);
  } else if (lastDot >= 0) {
    machineValue = parseSingleSeparator(numericText, ".", currencyCode);
  } else {
    machineValue = digitsOnly(numericText);
  }

  if (!machineValue) {
    return null;
  }

  const amount = Number(machineValue) * (isNegative ? -1 : 1);
  return Number.isFinite(amount) ? amount : null;
}

export function formatAmount(value, currencyCode) {
  if (!Number.isFinite(value)) {
    return "";
  }

  const baseFractionDigits = getCurrencyFractionDigits(currencyCode);
  const absoluteValue = Math.abs(value);
  const needsSmallValuePrecision =
    baseFractionDigits > 0 && absoluteValue > 0 && absoluteValue < 0.01;
  const maximumFractionDigits = needsSmallValuePrecision
    ? Math.max(6, baseFractionDigits)
    : baseFractionDigits;
  const safeValue = Math.abs(value) < 1e-12 ? 0 : value;

  return new Intl.NumberFormat("zh-CN", {
    useGrouping: true,
    minimumFractionDigits: baseFractionDigits,
    maximumFractionDigits
  }).format(safeValue);
}

function isPositiveRate(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

export function hasUsableRates(rates, currencyCodes = ["USD"]) {
  return (
    rates !== null &&
    typeof rates === "object" &&
    currencyCodes.every((code) => isPositiveRate(rates[code]))
  );
}

export function isValidSnapshot(snapshot, currencyCodes = ["USD"]) {
  return (
    snapshot !== null &&
    typeof snapshot === "object" &&
    snapshot.baseCode === "USD" &&
    hasUsableRates(snapshot.rates, currencyCodes) &&
    Number.isFinite(Number(snapshot.timeLastUpdateUnix))
  );
}

export function createSnapshotFromApi(payload, fetchedAt = Date.now()) {
  if (
    payload?.result !== "success" ||
    payload?.base_code !== "USD" ||
    !hasUsableRates(payload?.rates, ["USD"])
  ) {
    throw new Error("汇率接口返回了无效数据");
  }

  const rates = Object.fromEntries(
    Object.entries(payload.rates)
      .filter(([code, value]) => /^[A-Z]{3}$/.test(code) && isPositiveRate(value))
      .map(([code, value]) => [code, Number(value)])
  );

  return {
    baseCode: "USD",
    rates,
    timeLastUpdateUnix: Number(payload.time_last_update_unix),
    timeNextUpdateUnix: Number(payload.time_next_update_unix) || 0,
    fetchedAt,
    source: "api"
  };
}

export function convertAmount(
  amount,
  sourceCode,
  rates,
  targetCodes = Object.keys(rates ?? {})
) {
  if (!Number.isFinite(amount) || !isPositiveRate(rates?.[sourceCode])) {
    return null;
  }

  const amountInUsd = amount / Number(rates[sourceCode]);
  return Object.fromEntries(
    targetCodes
      .filter((code) => isPositiveRate(rates[code]))
      .map((code) => [code, amountInUsd * Number(rates[code])])
  );
}
