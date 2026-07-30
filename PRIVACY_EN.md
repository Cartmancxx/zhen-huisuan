# Zhen Hui Suan Privacy Policy

Last updated: July 30, 2026

Zhen Hui Suan respects user privacy. The maintainer does not collect, sell, share, or use personal data for advertising through this extension.

## Data stored locally

The extension uses browser extension storage for:

- Selected currencies and their order
- The most recent amount and source currency
- The most recently downloaded exchange rates and update time

This data stays in the user's browser. The maintainer cannot access it. Browsers normally remove this local data when the extension is uninstalled.

## Network requests

The extension only requests public exchange-rate JSON from:

```text
https://open.er-api.com/v6/latest/USD
```

The request does not contain entered amounts, selected currencies, page content, browsing history, or account information. The network provider may process ordinary connection information such as an IP address under its own policy; see the [ExchangeRate-API privacy policy](https://www.exchangerate-api.com/privacy).

## Optional sponsorship

The settings page displays a sponsorship QR code stored as a local image. The extension does not initiate payments, determine whether anyone sponsored the project, or read and upload payment amounts, payment accounts, or transaction results. Any scan and payment action is independently handled by the external payment app chosen by the user.

## Data the extension does not access

Zhen Hui Suan does not read or modify the current web page. It does not access browsing history, bookmarks, cookies, the clipboard, location, contacts, files, camera, microphone, or account information.

## Permissions

- `storage`: Saves local settings, input, and the exchange-rate cache.
- `https://open.er-api.com/*`: Retrieves public exchange-rate data.

## Changes and contact

Material changes will be published with the corresponding extension version and source code. Questions can be submitted through [GitHub Issues](https://github.com/Cartmancxx/zhen-huisuan/issues).
