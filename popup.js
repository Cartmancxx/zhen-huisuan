import {
  DEFAULT_CURRENCY_CODES,
  FALLBACK_SNAPSHOT,
  MAX_VISIBLE_CURRENCIES,
  MIN_VISIBLE_CURRENCIES,
  convertAmount,
  createSnapshotFromApi,
  formatAmount,
  getCurrencyFractionDigits,
  getCurrencyName,
  isValidSnapshot,
  normalizeCurrencySelection,
  parseAmount,
  sortCurrencyCodes
} from "./currency-core.js";
import {
  createTranslator,
  detectUiLocale
} from "./i18n.js";

const API_URL = "https://open.er-api.com/v6/latest/USD";
const RATES_CACHE_KEY = "fxRatesCacheV2";
const LEGACY_RATES_CACHE_KEY = "fxRatesCacheV1";
const LAST_INPUT_KEY = "fxLastInputV1";
const SELECTED_CURRENCIES_KEY = "fxSelectedCurrenciesV1";
const REQUEST_TIMEOUT_MS = 8000;
const MAX_CACHE_AGE_MS = 26 * 60 * 60 * 1000;
const uiLocale = detectUiLocale();
const t = createTranslator(uiLocale);

const converterView = document.querySelector("#converter-view");
const settingsView = document.querySelector("#settings-view");
const currencyList = document.querySelector("#currency-list");
const settingsList = document.querySelector("#settings-list");
const statusText = document.querySelector("#status-text");
const connectionDot = document.querySelector("#connection-dot");
const refreshButton = document.querySelector("#refresh-button");
const settingsButton = document.querySelector("#settings-button");
const backButton = document.querySelector("#back-button");
const doneButton = document.querySelector("#done-button");
const addCurrencyButton = document.querySelector("#add-currency-button");
const sponsorButton = document.querySelector("#sponsor-button");
const sponsorDialog = document.querySelector("#sponsor-dialog");
const sponsorCloseButton = document.querySelector("#sponsor-close-button");
const liveAnnouncer = document.querySelector("#live-announcer");

const inputs = new Map();
const rows = new Map();

const state = {
  snapshot: FALLBACK_SNAPSHOT,
  selectedCodes: [...DEFAULT_CURRENCY_CODES],
  sourceCode: "CNY",
  sourceAmount: 1000,
  sourceRaw: "1,000.00",
  isLoading: false
};

let persistTimer = null;

function applyStaticTranslations() {
  document.documentElement.lang = uiLocale;

  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }

  const translatedAttributes = [
    ["data-i18n-aria-label", "aria-label"],
    ["data-i18n-title", "title"],
    ["data-i18n-alt", "alt"]
  ];

  for (const [dataAttribute, targetAttribute] of translatedAttributes) {
    for (const element of document.querySelectorAll(`[${dataAttribute}]`)) {
      element.setAttribute(
        targetAttribute,
        t(element.getAttribute(dataAttribute))
      );
    }
  }

  document.title = t("appName");
}

function currencyName(code) {
  return getCurrencyName(code, uiLocale);
}

function formatCurrencyAmount(value, code) {
  return formatAmount(value, code, uiLocale);
}

function storageGet(keys) {
  if (globalThis.chrome?.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result) => resolve(result ?? {}));
    });
  }

  return Promise.resolve(
    Object.fromEntries(
      keys.map((key) => {
        try {
          return [key, JSON.parse(localStorage.getItem(key))];
        } catch {
          return [key, null];
        }
      })
    )
  );
}

function storageSet(values) {
  if (globalThis.chrome?.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.set(values, () => resolve());
    });
  }

  for (const [key, value] of Object.entries(values)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  return Promise.resolve();
}

function announce(message) {
  liveAnnouncer.textContent = "";
  requestAnimationFrame(() => {
    liveAnnouncer.textContent = message;
  });
}

function getAvailableCurrencyCodes() {
  return sortCurrencyCodes([
    ...state.selectedCodes,
    ...Object.keys(state.snapshot.rates ?? {})
  ], uiLocale);
}

function createCurrencyRow(code) {
  const row = document.createElement("label");
  row.className = "currency-row";
  row.dataset.code = code;

  const meta = document.createElement("span");
  meta.className = "currency-meta";

  const name = document.createElement("span");
  name.className = "currency-name";
  name.textContent = currencyName(code);
  name.title = currencyName(code);

  const currencyCode = document.createElement("span");
  currencyCode.className = "currency-code";
  currencyCode.textContent = code;

  const input = document.createElement("input");
  input.className = "currency-input";
  input.dataset.code = code;
  input.type = "text";
  input.inputMode = "decimal";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute(
    "aria-label",
    t("amountLabel", { currency: currencyName(code) })
  );
  input.placeholder = getCurrencyFractionDigits(code) === 0 ? "0" : "0.00";

  meta.append(name, currencyCode);
  row.append(meta, input);

  input.addEventListener("input", handleInput);
  input.addEventListener("blur", handleBlur);
  input.addEventListener("keydown", handleInputKeydown);
  input.addEventListener("focus", () => {
    requestAnimationFrame(() => input.select());
  });

  inputs.set(code, input);
  rows.set(code, row);
  return row;
}

function clearInvalidStates() {
  for (const [code, row] of rows) {
    row.classList.remove("is-invalid");
    inputs.get(code)?.removeAttribute("aria-invalid");
  }
}

function clearDerivedInputs(sourceCode) {
  for (const [code, input] of inputs) {
    if (code !== sourceCode) {
      input.value = "";
    }
  }
}

function renderConversions({ preserveSource = true } = {}) {
  if (!Number.isFinite(state.sourceAmount)) {
    clearDerivedInputs(state.sourceCode);
    return;
  }

  const converted = convertAmount(
    state.sourceAmount,
    state.sourceCode,
    state.snapshot.rates,
    state.selectedCodes
  );

  for (const [code, input] of inputs) {
    if (preserveSource && code === state.sourceCode) {
      continue;
    }
    input.value = converted?.[code] === undefined
      ? ""
      : formatCurrencyAmount(converted[code], code);
  }
}

function renderConverterRows({ focusSource = false } = {}) {
  inputs.clear();
  rows.clear();
  currencyList.replaceChildren(
    ...state.selectedCodes.map((code) => createCurrencyRow(code))
  );
  currencyList.dataset.count = String(state.selectedCodes.length);

  const sourceInput = inputs.get(state.sourceCode);
  if (sourceInput) {
    sourceInput.value = state.sourceRaw;
  }
  renderConversions({ preserveSource: true });

  if (focusSource && sourceInput) {
    focusAndSelect(sourceInput);
  }
}

function formatUpdateTime(unixSeconds) {
  const date = new Date(Number(unixSeconds) * 1000);
  if (Number.isNaN(date.getTime())) {
    return t("updateUnknown");
  }

  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const time = new Intl.DateTimeFormat(uiLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);

  if (isToday) {
    return t("todayRate", { time });
  }

  const day = new Intl.DateTimeFormat(uiLocale, {
    month: "numeric",
    day: "numeric"
  }).format(date);
  return t("datedRate", { date: day, time });
}

function setConnectionState(kind, message, announcement = "") {
  const states = ["is-live", "is-cached", "is-fallback", "is-loading", "is-error"];
  connectionDot.classList.remove(...states);
  connectionDot.classList.add(`is-${kind}`);
  connectionDot.setAttribute("aria-label", message);
  statusText.textContent = message;
  statusText.title = message;
  refreshButton.classList.toggle("is-loading", kind === "loading");
  refreshButton.disabled = kind === "loading";

  if (announcement) {
    announce(announcement);
  }
}

function showCurrentSnapshotStatus(kind = "live") {
  setConnectionState(
    kind,
    formatUpdateTime(state.snapshot.timeLastUpdateUnix),
    t("ratesUpdated")
  );
}

function queueLastInputSave() {
  window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    void storageSet({
      [LAST_INPUT_KEY]: {
        code: state.sourceCode,
        raw: state.sourceRaw
      }
    });
  }, 180);
}

function handleInput(event) {
  const input = event.currentTarget;
  const code = input.dataset.code;
  const raw = input.value;
  const amount = parseAmount(raw, code);

  state.sourceCode = code;
  state.sourceRaw = raw;
  clearInvalidStates();

  if (!raw.trim()) {
    state.sourceAmount = null;
    clearDerivedInputs(code);
    queueLastInputSave();
    return;
  }

  if (amount === null) {
    state.sourceAmount = null;
    rows.get(code)?.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    clearDerivedInputs(code);
    announce(t("invalidNumber"));
    queueLastInputSave();
    return;
  }

  state.sourceAmount = amount;
  renderConversions({ preserveSource: true });
  queueLastInputSave();
}

function handleBlur(event) {
  const input = event.currentTarget;
  const code = input.dataset.code;
  const amount = parseAmount(input.value, code);

  if (amount !== null) {
    input.value = formatCurrencyAmount(amount, code);
    if (state.sourceCode === code) {
      state.sourceRaw = input.value;
      queueLastInputSave();
    }
  }
}

function focusAndSelect(input) {
  input?.focus();
  requestAnimationFrame(() => input?.select());
}

function handleInputKeydown(event) {
  const input = event.currentTarget;
  const code = input.dataset.code;
  const index = state.selectedCodes.indexOf(code);

  if (event.key === "Escape") {
    event.preventDefault();
    clearInvalidStates();
    state.sourceCode = code;
    state.sourceAmount = null;
    state.sourceRaw = "";
    for (const field of inputs.values()) {
      field.value = "";
    }
    queueLastInputSave();
    focusAndSelect(input);
    return;
  }

  if (event.key === "ArrowDown" && index < state.selectedCodes.length - 1) {
    event.preventDefault();
    focusAndSelect(inputs.get(state.selectedCodes[index + 1]));
  }

  if (event.key === "ArrowUp" && index > 0) {
    event.preventDefault();
    focusAndSelect(inputs.get(state.selectedCodes[index - 1]));
  }
}

function isCacheFresh(snapshot) {
  if (
    !isValidSnapshot(snapshot, state.selectedCodes) ||
    snapshot.source !== "api"
  ) {
    return false;
  }

  const now = Date.now();
  const nextUpdateAt = Number(snapshot.timeNextUpdateUnix) * 1000;
  const fetchedAt = Number(snapshot.fetchedAt);
  const isWithinMaxAge =
    Number.isFinite(fetchedAt) && now - fetchedAt < MAX_CACHE_AGE_MS;
  const isBeforeNextUpdate =
    Number.isFinite(nextUpdateAt) && nextUpdateAt > now;

  return isWithinMaxAge && isBeforeNextUpdate;
}

async function refreshRates({ force = false } = {}) {
  if (state.isLoading) {
    return;
  }

  if (!force && isCacheFresh(state.snapshot)) {
    showCurrentSnapshotStatus("live");
    return;
  }

  state.isLoading = true;
  setConnectionState("loading", t("updatingRates"));

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(t("fetchError", { status: response.status }));
    }

    const payload = await response.json();
    const snapshot = createSnapshotFromApi(payload);
    state.snapshot = snapshot;
    await storageSet({ [RATES_CACHE_KEY]: snapshot });
    renderConverterRows();
    renderSettings();
    showCurrentSnapshotStatus("live");
  } catch (error) {
    const hasCachedApiRates = state.snapshot.source === "api";
    const message = hasCachedApiRates
      ? t("networkCached", {
          timeStatus: formatUpdateTime(state.snapshot.timeLastUpdateUnix)
        })
      : t("networkFallback");

    setConnectionState(
      hasCachedApiRates ? "cached" : "fallback",
      message,
      t("updateFailedUsingCache")
    );
    console.warn(error);
  } finally {
    window.clearTimeout(timeout);
    state.isLoading = false;
    refreshButton.classList.remove("is-loading");
    refreshButton.disabled = false;
  }
}

function createSettingRow(code, index, availableCodes, selectedSet) {
  const row = document.createElement("div");
  row.className = "setting-row";
  row.dataset.index = String(index);

  const selectShell = document.createElement("div");
  selectShell.className = "select-shell";

  const select = document.createElement("select");
  select.className = "currency-select";
  select.dataset.index = String(index);
  select.setAttribute(
    "aria-label",
    t("currencyPosition", { position: index + 1 })
  );

  for (const optionCode of availableCodes) {
    const option = document.createElement("option");
    option.value = optionCode;
    option.textContent = `${currencyName(optionCode)} · ${optionCode}`;
    option.selected = optionCode === code;
    option.disabled = optionCode !== code && selectedSet.has(optionCode);
    select.append(option);
  }

  const chevron = document.createElement("span");
  chevron.className = "select-chevron";
  chevron.setAttribute("aria-hidden", "true");
  selectShell.append(select, chevron);

  const removeButton = document.createElement("button");
  removeButton.className = "remove-currency-button";
  removeButton.type = "button";
  removeButton.dataset.index = String(index);
  removeButton.disabled =
    state.selectedCodes.length <= MIN_VISIBLE_CURRENCIES;
  removeButton.setAttribute(
    "aria-label",
    t("removeCurrency", { currency: currencyName(code) })
  );
  removeButton.title = state.selectedCodes.length <= MIN_VISIBLE_CURRENCIES
    ? t("minimumCurrencies", { count: MIN_VISIBLE_CURRENCIES })
    : t("removeCurrency", { currency: currencyName(code) });
  removeButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17"></path>
    </svg>
  `;

  select.addEventListener("change", handleCurrencyReplacement);
  removeButton.addEventListener("click", handleCurrencyRemoval);
  row.append(selectShell, removeButton);
  return row;
}

function renderSettings({ focusIndex = null } = {}) {
  const availableCodes = getAvailableCurrencyCodes();
  const selectedSet = new Set(state.selectedCodes);
  settingsList.replaceChildren(
    ...state.selectedCodes.map((code, index) =>
      createSettingRow(code, index, availableCodes, selectedSet)
    )
  );

  const unusedCodes = availableCodes.filter((code) => !selectedSet.has(code));
  const reachedMaximum =
    state.selectedCodes.length >= MAX_VISIBLE_CURRENCIES;
  addCurrencyButton.disabled = reachedMaximum || unusedCodes.length === 0;
  addCurrencyButton.title = reachedMaximum
    ? t("maximumCurrencies", { count: MAX_VISIBLE_CURRENCIES })
    : unusedCodes.length === 0
      ? t("addAfterOnline")
      : t("addCurrency");

  if (focusIndex !== null) {
    requestAnimationFrame(() => {
      settingsList
        .querySelector(`select[data-index="${focusIndex}"]`)
        ?.focus();
    });
  }
}

function persistCurrencySelection() {
  void storageSet({
    [SELECTED_CURRENCIES_KEY]: state.selectedCodes,
    [LAST_INPUT_KEY]: {
      code: state.sourceCode,
      raw: state.sourceRaw
    }
  });
}

function applySelectedCodes(nextCodes, preferredSourceIndex = 0) {
  const normalizedCodes = normalizeCurrencySelection(nextCodes);
  const sourceStillVisible = normalizedCodes.includes(state.sourceCode);

  if (!sourceStillVisible) {
    const nextSourceCode =
      normalizedCodes[Math.min(preferredSourceIndex, normalizedCodes.length - 1)] ??
      normalizedCodes[0];
    const converted = convertAmount(
      state.sourceAmount,
      state.sourceCode,
      state.snapshot.rates,
      [nextSourceCode]
    );
    const nextAmount = converted?.[nextSourceCode];

    state.sourceCode = nextSourceCode;
    state.sourceAmount = Number.isFinite(nextAmount) ? nextAmount : null;
    state.sourceRaw = Number.isFinite(nextAmount)
      ? formatCurrencyAmount(nextAmount, nextSourceCode)
      : "";
  }

  state.selectedCodes = normalizedCodes;
  renderConverterRows();
  persistCurrencySelection();
}

function handleCurrencyReplacement(event) {
  const select = event.currentTarget;
  const index = Number(select.dataset.index);
  const nextCode = select.value;
  const nextCodes = [...state.selectedCodes];

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= nextCodes.length ||
    nextCodes.some((code, codeIndex) => code === nextCode && codeIndex !== index)
  ) {
    renderSettings({ focusIndex: index });
    return;
  }

  nextCodes[index] = nextCode;
  applySelectedCodes(nextCodes, index);
  renderSettings({ focusIndex: index });
  announce(t("replacedCurrency", { currency: currencyName(nextCode) }));
}

function handleCurrencyRemoval(event) {
  if (state.selectedCodes.length <= MIN_VISIBLE_CURRENCIES) {
    return;
  }

  const index = Number(event.currentTarget.dataset.index);
  if (!Number.isInteger(index) || index < 0 || index >= state.selectedCodes.length) {
    return;
  }

  const removedCode = state.selectedCodes[index];
  const nextCodes = state.selectedCodes.filter(
    (_code, codeIndex) => codeIndex !== index
  );
  applySelectedCodes(nextCodes, Math.min(index, nextCodes.length - 1));
  renderSettings({ focusIndex: Math.min(index, nextCodes.length - 1) });
  announce(t("removedCurrency", { currency: currencyName(removedCode) }));
}

function handleCurrencyAddition() {
  if (state.selectedCodes.length >= MAX_VISIBLE_CURRENCIES) {
    return;
  }

  const selectedSet = new Set(state.selectedCodes);
  const nextCode = getAvailableCurrencyCodes().find(
    (code) => !selectedSet.has(code)
  );
  if (!nextCode) {
    announce(t("addAfterOnline"));
    return;
  }

  const nextCodes = [...state.selectedCodes, nextCode];
  applySelectedCodes(nextCodes);
  renderSettings({ focusIndex: nextCodes.length - 1 });
  announce(t("addedCurrency", { currency: currencyName(nextCode) }));
}

function openSettings() {
  converterView.hidden = true;
  settingsView.hidden = false;
  document.title = t("settingsDocumentTitle");
  renderSettings({ focusIndex: 0 });
}

function closeSettings() {
  if (sponsorDialog.open) {
    sponsorDialog.close();
  }
  settingsView.hidden = true;
  converterView.hidden = false;
  document.title = t("appName");
  renderConverterRows({ focusSource: true });
}

function openSponsorDialog() {
  if (!sponsorDialog.open) {
    sponsorDialog.showModal();
  }
}

function closeSponsorDialog() {
  if (sponsorDialog.open) {
    sponsorDialog.close();
  }
}

function restoreLastInput(savedInput) {
  const savedCode = String(savedInput?.code || "").toUpperCase();
  const code = state.selectedCodes.includes(savedCode)
    ? savedCode
    : state.selectedCodes[0];
  const raw = typeof savedInput?.raw === "string"
    ? savedInput.raw
    : formatCurrencyAmount(1000, code);

  state.sourceCode = code;
  state.sourceRaw = raw;
  state.sourceAmount = parseAmount(raw, code);
}

async function initialize() {
  applyStaticTranslations();
  refreshButton.addEventListener("click", () => {
    void refreshRates({ force: true });
  });
  settingsButton.addEventListener("click", openSettings);
  backButton.addEventListener("click", closeSettings);
  doneButton.addEventListener("click", closeSettings);
  addCurrencyButton.addEventListener("click", handleCurrencyAddition);
  sponsorButton.addEventListener("click", openSponsorDialog);
  sponsorCloseButton.addEventListener("click", closeSponsorDialog);
  sponsorDialog.addEventListener("click", (event) => {
    if (event.target === sponsorDialog) {
      closeSponsorDialog();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sponsorDialog.open) {
      return;
    }
    if (event.key === "Escape" && !settingsView.hidden) {
      event.preventDefault();
      closeSettings();
    }
  });

  const stored = await storageGet([
    RATES_CACHE_KEY,
    LEGACY_RATES_CACHE_KEY,
    LAST_INPUT_KEY,
    SELECTED_CURRENCIES_KEY
  ]);

  state.selectedCodes = normalizeCurrencySelection(
    stored[SELECTED_CURRENCIES_KEY]
  );

  const preferredCache = stored[RATES_CACHE_KEY];
  const legacyCache = stored[LEGACY_RATES_CACHE_KEY];
  const cachedSnapshot = isValidSnapshot(preferredCache)
    ? preferredCache
    : isValidSnapshot(legacyCache)
      ? legacyCache
      : null;

  if (cachedSnapshot) {
    state.snapshot = cachedSnapshot;
    showCurrentSnapshotStatus(
      isCacheFresh(cachedSnapshot) ? "live" : "cached"
    );
  } else {
    state.snapshot = FALLBACK_SNAPSHOT;
    setConnectionState("fallback", t("connectingFallback"));
  }

  restoreLastInput(stored[LAST_INPUT_KEY]);
  renderConverterRows({ focusSource: true });
  renderSettings();
  await refreshRates();
}

void initialize();
