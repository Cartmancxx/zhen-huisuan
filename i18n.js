export const DEFAULT_UI_LOCALE = "en";

export const UI_MESSAGES = Object.freeze({
  "zh-CN": Object.freeze({
    appName: "真汇算",
    loadingRatesAria: "正在读取汇率",
    currencySettings: "币种设置",
    converterAria: "货币金额换算",
    loadingRates: "正在读取汇率…",
    providerCredit: "数据：ExchangeRate-API",
    refreshRates: "刷新汇率",
    refresh: "刷新",
    backToConverter: "返回换算",
    settingsTitle: "币种设置",
    done: "完成",
    selectedCurrenciesAria: "已选择币种",
    addCurrency: "添加币种",
    settingsHelper: "同时显示 2–8 种货币 · 自动保存",
    sponsorTitle: "赞助开源项目",
    sponsorDescription: "完全自愿 · 不影响任何功能",
    openSponsor: "查看赞助码",
    sponsorDialogTitle: "喜欢真汇算？",
    sponsorDialogDescription:
      "真汇算永久免费开源。觉得好用，可以请作者喝杯咖啡。",
    sponsorImageAlt: "程鑫的赞赏码",
    sponsorNote: "赞助完全自愿，不解锁功能，也不影响更新。",
    closeSponsor: "关闭赞助码",
    amountLabel: "{currency}金额",
    updateUnknown: "更新时间未知",
    todayRate: "今日汇率 · {time}",
    datedRate: "{date}汇率 · {time}",
    ratesUpdated: "汇率已更新",
    invalidNumber: "请输入有效数字",
    updatingRates: "正在更新汇率…",
    networkCached: "网络异常 · {timeStatus}",
    networkFallback: "网络异常 · 使用离线参考汇率",
    updateFailedUsingCache: "汇率更新失败，已继续使用本地汇率",
    currencyPosition: "第 {position} 个币种",
    removeCurrency: "移除{currency}",
    minimumCurrencies: "至少保留 {count} 种货币",
    maximumCurrencies: "最多同时显示 {count} 种货币",
    addAfterOnline: "联网获取汇率后可添加更多币种",
    replacedCurrency: "已替换为{currency}",
    removedCurrency: "已移除{currency}",
    addedCurrency: "已添加{currency}",
    settingsDocumentTitle: "币种设置 · 真汇算",
    connectingFallback: "连接中 · 暂用离线参考汇率",
    fetchError: "汇率请求失败：{status}"
  }),
  "zh-TW": Object.freeze({
    appName: "真匯算",
    loadingRatesAria: "正在讀取匯率",
    currencySettings: "幣種設定",
    converterAria: "貨幣金額換算",
    loadingRates: "正在讀取匯率…",
    providerCredit: "資料：ExchangeRate-API",
    refreshRates: "重新整理匯率",
    refresh: "重新整理",
    backToConverter: "返回換算",
    settingsTitle: "幣種設定",
    done: "完成",
    selectedCurrenciesAria: "已選擇幣種",
    addCurrency: "新增幣種",
    settingsHelper: "同時顯示 2–8 種貨幣 · 自動儲存",
    sponsorTitle: "贊助開源專案",
    sponsorDescription: "完全自願 · 不影響任何功能",
    openSponsor: "查看贊賞碼",
    sponsorDialogTitle: "喜歡真匯算？",
    sponsorDialogDescription:
      "真匯算永久免費開源。覺得好用，可以請作者喝杯咖啡。",
    sponsorImageAlt: "程鑫的贊賞碼",
    sponsorNote: "贊助完全自願，不會解鎖功能，也不影響更新。",
    closeSponsor: "關閉贊賞碼",
    amountLabel: "{currency}金額",
    updateUnknown: "更新時間未知",
    todayRate: "今日匯率 · {time}",
    datedRate: "{date}匯率 · {time}",
    ratesUpdated: "匯率已更新",
    invalidNumber: "請輸入有效數字",
    updatingRates: "正在更新匯率…",
    networkCached: "網路異常 · {timeStatus}",
    networkFallback: "網路異常 · 使用離線參考匯率",
    updateFailedUsingCache: "匯率更新失敗，已繼續使用本機匯率",
    currencyPosition: "第 {position} 個幣種",
    removeCurrency: "移除{currency}",
    minimumCurrencies: "至少保留 {count} 種貨幣",
    maximumCurrencies: "最多同時顯示 {count} 種貨幣",
    addAfterOnline: "連線取得匯率後可新增更多幣種",
    replacedCurrency: "已替換為{currency}",
    removedCurrency: "已移除{currency}",
    addedCurrency: "已新增{currency}",
    settingsDocumentTitle: "幣種設定 · 真匯算",
    connectingFallback: "連線中 · 暫用離線參考匯率",
    fetchError: "匯率請求失敗：{status}"
  }),
  en: Object.freeze({
    appName: "Zhen Hui Suan",
    loadingRatesAria: "Loading exchange rates",
    currencySettings: "Currency settings",
    converterAria: "Currency conversion amounts",
    loadingRates: "Loading exchange rates…",
    providerCredit: "Data: ExchangeRate-API",
    refreshRates: "Refresh exchange rates",
    refresh: "Refresh",
    backToConverter: "Back to converter",
    settingsTitle: "Currency settings",
    done: "Done",
    selectedCurrenciesAria: "Selected currencies",
    addCurrency: "Add currency",
    settingsHelper: "Show 2–8 currencies · Saved automatically",
    sponsorTitle: "Support this open-source project",
    sponsorDescription: "Optional · No features are locked",
    openSponsor: "View sponsorship QR code",
    sponsorDialogTitle: "Enjoying Zhen Hui Suan?",
    sponsorDialogDescription:
      "Zhen Hui Suan is free and open source. If it saves you time, you can buy the maintainer a coffee.",
    sponsorImageAlt: "Cheng Xin's sponsorship QR code",
    sponsorNote:
      "Sponsorship is optional. It never unlocks features or affects updates.",
    closeSponsor: "Close sponsorship QR code",
    amountLabel: "{currency} amount",
    updateUnknown: "Update time unavailable",
    todayRate: "Rates today · {time}",
    datedRate: "Rates {date} · {time}",
    ratesUpdated: "Exchange rates updated",
    invalidNumber: "Enter a valid number",
    updatingRates: "Updating exchange rates…",
    networkCached: "Network issue · {timeStatus}",
    networkFallback: "Network issue · Using offline reference rates",
    updateFailedUsingCache:
      "Could not update rates. Local reference rates are still in use.",
    currencyPosition: "Currency {position}",
    removeCurrency: "Remove {currency}",
    minimumCurrencies: "Keep at least {count} currencies",
    maximumCurrencies: "Show up to {count} currencies",
    addAfterOnline: "Connect to load more currencies",
    replacedCurrency: "Switched to {currency}",
    removedCurrency: "Removed {currency}",
    addedCurrency: "Added {currency}",
    settingsDocumentTitle: "Currency settings · Zhen Hui Suan",
    connectingFallback: "Connecting · Using offline reference rates",
    fetchError: "Exchange-rate request failed: {status}"
  }),
  vi: Object.freeze({
    appName: "Zhen Hui Suan",
    loadingRatesAria: "Đang tải tỷ giá",
    currencySettings: "Cài đặt tiền tệ",
    converterAria: "Số tiền quy đổi",
    loadingRates: "Đang tải tỷ giá…",
    providerCredit: "Dữ liệu: ExchangeRate-API",
    refreshRates: "Làm mới tỷ giá",
    refresh: "Làm mới",
    backToConverter: "Quay lại quy đổi",
    settingsTitle: "Cài đặt tiền tệ",
    done: "Xong",
    selectedCurrenciesAria: "Tiền tệ đã chọn",
    addCurrency: "Thêm tiền tệ",
    settingsHelper: "Hiển thị 2–8 loại tiền · Tự động lưu",
    sponsorTitle: "Ủng hộ dự án mã nguồn mở",
    sponsorDescription: "Hoàn toàn tự nguyện · Không khóa tính năng",
    openSponsor: "Xem mã QR ủng hộ",
    sponsorDialogTitle: "Bạn thích Zhen Hui Suan?",
    sponsorDialogDescription:
      "Zhen Hui Suan luôn miễn phí và mã nguồn mở. Nếu công cụ giúp ích cho bạn, bạn có thể mời tác giả một ly cà phê.",
    sponsorImageAlt: "Mã QR ủng hộ của Cheng Xin",
    sponsorNote:
      "Việc ủng hộ hoàn toàn tự nguyện, không mở khóa tính năng và không ảnh hưởng đến cập nhật.",
    closeSponsor: "Đóng mã QR ủng hộ",
    amountLabel: "Số tiền {currency}",
    updateUnknown: "Không có thời gian cập nhật",
    todayRate: "Tỷ giá hôm nay · {time}",
    datedRate: "Tỷ giá {date} · {time}",
    ratesUpdated: "Đã cập nhật tỷ giá",
    invalidNumber: "Hãy nhập một số hợp lệ",
    updatingRates: "Đang cập nhật tỷ giá…",
    networkCached: "Lỗi mạng · {timeStatus}",
    networkFallback: "Lỗi mạng · Đang dùng tỷ giá tham khảo ngoại tuyến",
    updateFailedUsingCache:
      "Không thể cập nhật tỷ giá. Dữ liệu tham khảo cục bộ vẫn đang được sử dụng.",
    currencyPosition: "Tiền tệ thứ {position}",
    removeCurrency: "Xóa {currency}",
    minimumCurrencies: "Giữ ít nhất {count} loại tiền",
    maximumCurrencies: "Hiển thị tối đa {count} loại tiền",
    addAfterOnline: "Kết nối mạng để tải thêm tiền tệ",
    replacedCurrency: "Đã đổi sang {currency}",
    removedCurrency: "Đã xóa {currency}",
    addedCurrency: "Đã thêm {currency}",
    settingsDocumentTitle: "Cài đặt tiền tệ · Zhen Hui Suan",
    connectingFallback: "Đang kết nối · Tạm dùng tỷ giá ngoại tuyến",
    fetchError: "Yêu cầu tỷ giá thất bại: {status}"
  })
});

function normalizeLocaleCandidate(language) {
  const normalized = String(language || "")
    .trim()
    .replaceAll("_", "-")
    .toLowerCase();

  if (!normalized) {
    return null;
  }
  if (normalized.startsWith("zh-hant") || normalized.startsWith("zh-tw") ||
      normalized.startsWith("zh-hk") || normalized.startsWith("zh-mo")) {
    return "zh-TW";
  }
  if (normalized.startsWith("zh")) {
    return "zh-CN";
  }
  if (normalized.startsWith("vi")) {
    return "vi";
  }
  if (normalized.startsWith("en")) {
    return "en";
  }
  return null;
}

export function resolveUiLocale(...candidates) {
  for (const candidate of candidates.flat(Infinity)) {
    const locale = normalizeLocaleCandidate(candidate);
    if (locale) {
      return locale;
    }
  }
  return DEFAULT_UI_LOCALE;
}

export function detectUiLocale() {
  let previewLanguage = "";
  try {
    previewLanguage = new URLSearchParams(globalThis.location?.search ?? "")
      .get("lang") ?? "";
  } catch {
    previewLanguage = "";
  }

  let browserLanguage = "";
  try {
    browserLanguage = globalThis.chrome?.i18n?.getUILanguage?.() ?? "";
  } catch {
    browserLanguage = "";
  }

  return resolveUiLocale(
    previewLanguage,
    browserLanguage,
    globalThis.navigator?.languages ?? [],
    globalThis.navigator?.language
  );
}

export function createTranslator(locale) {
  const resolvedLocale = resolveUiLocale(locale);
  const catalog = UI_MESSAGES[resolvedLocale] ?? UI_MESSAGES[DEFAULT_UI_LOCALE];

  return (key, replacements = {}) => {
    const template =
      catalog[key] ??
      UI_MESSAGES[DEFAULT_UI_LOCALE][key] ??
      key;
    return template.replace(/\{(\w+)\}/g, (match, name) =>
      Object.hasOwn(replacements, name)
        ? String(replacements[name])
        : match
    );
  };
}
