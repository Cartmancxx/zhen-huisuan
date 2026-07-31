# 真汇算

[简体中文](README.md) · [English](README_EN.md)

一个极简、开源的 Chrome / Edge 汇率换算扩展。

无需先选择“从哪种货币换到哪种货币”：直接在任意货币框中输入数字，其他货币会立即联动换算。币种和数量都可自由调整，同时显示 2–8 种货币。

> Chrome Web Store 已正式上线；Microsoft Edge Add-ons 的上架包、四语商品页和宣传素材也已准备完成。Edge 审核通过前仍可从 GitHub Releases 手动安装。

[Chrome Web Store 安装](https://chromewebstore.google.com/detail/zhen-hui-suan/lbhpoliodgeipgbpbjlhfcniiipcpndj) · [在 YouTube 观看宣传片](https://www.youtube.com/watch?v=aU-nN0AAS9w)

![真汇算：任意币种输入并识别千分符](store-assets/chrome/zh-CN/screenshot-01-any-input-1280x800.png)

## 特点

- 任意货币框输入，其他结果即时联动
- 默认显示人民币、港币、美元、越南盾
- 支持约 165 种货币，可增加、删除和替换
- 支持常见千分符、全角数字和粘贴格式：
  - `1,234.56`
  - `1.234,56`
  - `1 234 567,89`
  - `26.252.670`（零小数货币）
  - `￥１，２３４．５６`
- 自动保存币种设置和上次输入
- 汇率缓存到本地；断网时可继续使用最近一次成功数据
- 不读取网页，不收集浏览记录，不含广告
- Manifest V3，只有 `storage` 和汇率接口两项必要权限

> “即时”指输入后的换算结果立即更新。免费数据源提供的是最新每日参考汇率，并非逐秒交易报价；银行、支付平台和报关结算价可能不同。

## 多语言

插件自动识别浏览器界面语言，无需手动选择：

- 简体中文
- 繁体中文
- English
- Tiếng Việt

其他语言环境默认使用英语。货币名称、数字格式、状态提示和无障碍标签会一起切换。

## 安装

### Chrome Web Store

[从 Chrome Web Store 安装真汇算](https://chromewebstore.google.com/detail/zhen-hui-suan/lbhpoliodgeipgbpbjlhfcniiipcpndj)。商店版可以自动更新。

### Microsoft Edge Add-ons

Edge 商店资料已准备完成，正式商品页链接会在审核通过后补充。

### 从源码安装

1. 下载本仓库并解压。
2. 打开 Chrome 的 `chrome://extensions`，或 Edge 的 `edge://extensions`。
3. 打开“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择本项目根目录。

### 从发布包安装

1. 在 [Releases](https://github.com/Cartmancxx/zhen-huisuan/releases) 下载最新 ZIP。
2. 将 ZIP 完整解压到一个固定文件夹。
3. 打开 Chrome 的 `chrome://extensions`，或 Edge 的 `edge://extensions`。
4. 打开“开发者模式”，点击“加载已解压的扩展程序”。
5. 选择刚才解压出的文件夹。

浏览器不会自动更新这种手动加载的扩展；有新版本时，请重新下载并覆盖文件，然后在扩展管理页点击“重新加载”。

## 使用

1. 点击工具栏里的“真汇算”。
2. 在任意一行输入金额。
3. 点击右上角齿轮，可替换、增加或删除币种。
4. 按 `Esc` 清空；按 `↑` / `↓` 快速切换输入框。

![真汇算币种设置与自愿赞助入口](store-assets/chrome/zh-CN/screenshot-02-settings-1280x800.png)

## 汇率来源

项目使用 [ExchangeRate-API Open Access](https://www.exchangerate-api.com/docs/free)：

```text
https://open.er-api.com/v6/latest/USD
```

该接口无需 API Key，官方说明为每日更新并要求署名。插件只在缓存到期或用户点击“刷新”时请求接口。

## 隐私与权限

- `storage`：保存汇率缓存、币种设置和上次输入。
- `https://open.er-api.com/*`：读取公开汇率 JSON。

插件没有 content script，不读取或修改网页，不收集个人数据。完整说明见 [PRIVACY.md](PRIVACY.md)。

## 赞助

真汇算永久免费、完整开源，不设置付费功能，也不会通过赞助解锁任何能力。如果它确实帮你节省了时间，可以自愿请作者喝杯咖啡：

<img src="assets/sponsor-code.jpg" alt="程鑫的赞赏码" width="360">

赞助完全自愿。插件只展示这张本地图片，不读取或上传任何支付信息。

## 开发

环境要求：Node.js 20+。

```powershell
npm install
npm test
npm run icons
```

本地预览：

```powershell
npm run serve
```

然后访问 `http://127.0.0.1:8765/popup.html`。

## 贡献

欢迎提交 Issue 和 Pull Request。开始前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 与 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

维护者发布新版本时请参照 [PUBLISHING.md](PUBLISHING.md)。
商店上传步骤、素材路径和隐私申报见 [STORE_SUBMISSION_GUIDE.md](STORE_SUBMISSION_GUIDE.md)。

## 宣传视频

宣传片真实演示任意币种输入、`1,000` 千分符识别、四币种联动、自动语言和自愿赞助入口。视频工程与可重复渲染说明见 [video/README.md](video/README.md)。

[![在 YouTube 观看真汇算宣传视频](store-assets/video/zh-CN/youtube-thumbnail-1280x720.png)](https://www.youtube.com/watch?v=aU-nN0AAS9w)

[下载仓库内中文 MP4](store-assets/video/zh-CN/zhen-huisuan-promo-zh.mp4) · [下载仓库内英文 MP4](store-assets/video/en/zhen-huisuan-promo-en.mp4)

## 许可证

[MIT License](LICENSE)
