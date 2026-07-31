# Chrome Web Store listing (English)

## Basic information

- Name: Zhen Hui Suan
- Category: Productivity
- Homepage: https://github.com/Cartmancxx/zhen-huisuan
- Support: https://github.com/Cartmancxx/zhen-huisuan/issues
- Privacy policy: https://github.com/Cartmancxx/zhen-huisuan/blob/main/PRIVACY_EN.md

## Short description

Enter an amount in any currency field. All others update instantly, with smart thousands-separator parsing.

## Detailed description

Stop choosing a “from” currency, a “to” currency, and then clicking Convert.

Zhen Hui Suan is built around a practical multi-currency workflow: every visible currency is an input. Enter an amount in CNY, HKD, USD, VND, or any currency you add, and every other amount updates instantly.

Pasted amounts work as they are. `1,000` is read as 1000. The parser also understands formats such as `1.234,56`, `1 234 567,89`, `26.252.670`, full-width digits, and common currency symbols.

Highlights:

- Use any currency field as the source
- Defaults to CNY, HKD, USD, and VND
- Show 2–8 currencies; add, remove, replace, and reorder them
- About 165 currencies from the exchange-rate source
- Automatically follows the browser language: Simplified Chinese, Traditional Chinese, English, and Vietnamese
- Remembers the currency list and most recent input
- Keeps a local rate cache for temporary offline use
- No ads, accounts, analytics, page access, or browsing-history access

Rates come from the free ExchangeRate-API Open Access endpoint. Linked calculations update instantly after input, while the source provides the latest daily reference rates—not tick-by-tick trading quotes. Bank, payment-platform, and customs settlement rates may differ.

Zhen Hui Suan is fully open source under the MIT License. The sponsorship link in Settings is optional and never unlocks or restricts features.

## Single purpose

The extension has one purpose: fast linked multi-currency conversion in a browser toolbar popup using public exchange-rate data.

## Permissions

### `storage`

Stores the selected currencies, their order, the most recent input, and the latest successful rate cache in the browser. The developer cannot access this local data.

### `https://open.er-api.com/*`

Only reads public JSON from `https://open.er-api.com/v6/latest/USD`. Entered amounts, page content, browsing history, and personal information are not included in the request.

## Privacy disclosure

- Amounts are processed locally and are not uploaded: Yes
- Personal or financial data collected or transmitted: No
- Location, browsing history, website content, or user activity collected: No
- Data sold or used for advertising: No
- Remote code: No
- Analytics: No

## Reviewer instructions

No account or special environment is required.

1. Open Zhen Hui Suan from the toolbar.
2. Type `1,000` in the CNY field; confirm it is read as 1000 and all other fields update.
3. Type `26.252.670` in the VND field; confirm it is read as 26,252,670.
4. Open Settings, replace one currency with EUR, and add another currency.
5. Press Refresh to request the public rate JSON again.

## Media

- Icon: `icons/icon-128.png`
- Screenshot 1: `store-assets/chrome/en/screenshot-01-any-input-1280x800.png`
- Screenshot 2: `store-assets/chrome/en/screenshot-02-settings-1280x800.png`
- Global small promo tile: `store-assets/chrome/en/promo-small-440x280.png`
- Global marquee: `store-assets/chrome/en/promo-large-1400x560.png`
- Promo video: `store-assets/video/en/zhen-huisuan-promo-en.mp4`
- Promo video: Paste the YouTube URL after upload

## Version 2.1.0

Adds automatic Simplified Chinese, Traditional Chinese, English, and Vietnamese interfaces plus a fully optional open-source sponsorship link in Settings. Linked inputs, localized number parsing, 2–8 configurable currencies, and offline rate caching remain available to everyone.
