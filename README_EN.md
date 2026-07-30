# Zhen Hui Suan

[简体中文](README.md) · [English](README_EN.md)

A minimal, open-source multi-currency converter for Chrome and Edge.

There is no “from” or “to” selector. Enter an amount in any currency field and every other field updates immediately. You can show 2–8 currencies and freely add, remove, or replace them.

> The extension is distributed through GitHub only. Download the ZIP from Releases, extract it, and load the folder in your browser's developer mode.

![Zhen Hui Suan main view](design/zhenhuisuan-main-render.png)

## Features

- Use any currency field as the conversion source
- Defaults to CNY, HKD, USD, and VND
- Supports about 165 currencies from the exchange-rate source
- Recognizes common pasted number formats:
  - `1,234.56`
  - `1.234,56`
  - `1 234 567,89`
  - `26.252.670` for zero-decimal currencies
  - Full-width digits and currency symbols
- Remembers your currency list and most recent input
- Keeps a local rate cache for temporary offline use
- No ads, accounts, analytics, or access to web pages
- Manifest V3 with only `storage` and the exchange-rate host permission

> “Instant” describes the linked calculation after typing. The free data source provides the latest daily reference rates, not tick-by-tick trading quotes. Bank, payment-platform, and customs settlement rates may differ.

## Languages

The interface automatically follows the browser UI language:

- Simplified Chinese
- Traditional Chinese
- English
- Vietnamese

Unsupported languages fall back to English. Currency names, number formatting, status messages, and accessibility labels all follow the selected interface locale.

## Install

### From a Release

1. Download the latest ZIP from [Releases](https://github.com/Cartmancxx/zhen-huisuan/releases).
2. Extract the complete ZIP into a permanent folder.
3. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
4. Enable **Developer mode**.
5. Choose **Load unpacked** and select the extracted folder.

Manually loaded extensions do not update automatically. For a new version, download it again, replace the files, and click **Reload** on the browser's extension-management page.

### From source

Clone or download this repository, then load the repository root with **Load unpacked**.

## Use

1. Open Zhen Hui Suan from the browser toolbar.
2. Enter an amount in any row.
3. Open the gear menu to add, remove, or replace currencies.
4. Press `Esc` to clear values and `↑` / `↓` to move between fields.

![Zhen Hui Suan currency settings](design/zhenhuisuan-settings-render.png)

## Exchange-rate source

The project uses [ExchangeRate-API Open Access](https://www.exchangerate-api.com/docs/free):

```text
https://open.er-api.com/v6/latest/USD
```

It requires no API key. The provider documents daily updates and requires attribution, so the extension refreshes only when the cache expires or when you explicitly press Refresh.

## Privacy and permissions

- `storage`: Stores the rate cache, currency selection, and most recent input locally.
- `https://open.er-api.com/*`: Reads the public exchange-rate JSON.

There is no content script. The extension does not read or modify web pages and does not collect personal data. See [PRIVACY_EN.md](PRIVACY_EN.md).

## Support the project

Zhen Hui Suan is free and fully open source. Sponsorship never unlocks features and is never required. If the extension saves you time, you may optionally buy the maintainer a coffee:

<img src="assets/sponsor-code.jpg" alt="Cheng Xin's sponsorship QR code" width="360">

The extension only displays this local image. It cannot read or upload payment information.

## Development

Requires Node.js 20 or later.

```powershell
npm install
npm test
npm run serve
```

Open `http://127.0.0.1:8765/popup.html?lang=en` to preview the English interface.

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[MIT License](LICENSE)
