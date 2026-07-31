# Chrome / Edge 商店上传指南

这份指南对应真汇算 2.1.0。扩展 ZIP、商品页文案、四语图片和中英宣传视频已经分别准备；宣传视频不放进扩展 ZIP，而是先上传 YouTube，再把 URL 填到两个商店后台。

## 1. 生成并检查扩展 ZIP

在项目根目录运行：

```powershell
npm ci
npm test
npm run store-assets
npm run package:store
```

生成文件：

```text
release/zhen-huisuan-v2.1.0-store.zip
```

打开 ZIP 后，`manifest.json` 必须直接位于压缩包根目录，不能再套一层项目文件夹。不要把 `video/`、测试、设计稿或商店图片放进扩展 ZIP。

## 2. 先上传 YouTube 宣传视频

按照 [store-listing/YOUTUBE_UPLOAD.md](store-listing/YOUTUBE_UPLOAD.md) 上传：

- 中文：`store-assets/video/zh-CN/zhen-huisuan-promo-zh.mp4`
- English：`store-assets/video/en/zhen-huisuan-promo-en.mp4`

视频设为“公开”或“不公开”，不能设为“私享”；开启允许嵌入。Microsoft Edge 要求关闭视频广告。保存两个 YouTube URL，后面分别填入简中/繁中和英文/越南文商品页。

## 3. 上传 Chrome Web Store

1. 打开 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)。
2. 点击 **New item**，上传 `release/zhen-huisuan-v2.1.0-store.zip`。
3. 在 **Store listing** 中添加四个语言版本：
   - 简体中文：`store-listing/chrome-zh-CN.md`
   - English：`store-listing/chrome-en.md`
   - 繁體中文：`store-listing/chrome-zh-TW.md`
   - Tiếng Việt：`store-listing/chrome-vi.md`
4. 按各文档“图片与视频 / Media”段落上传本地化截图。
5. 在 Localized promo video 填入相应 YouTube URL。中文视频用于简中和繁中，英文视频用于英文和越南文。
6. Chrome 的小型宣传图和 Marquee 不能按语言本地化，只上传一套全局素材；建议使用：
   - `store-assets/chrome/en/promo-small-440x280.png`
   - `store-assets/chrome/en/promo-large-1400x560.png`
7. 在 **Privacy** 中填写：
   - 单一用途：多币种金额联动换算。
   - `storage`：只在本地保存币种、最近输入和汇率缓存。
   - Host permission：只读取 `https://open.er-api.com/v6/latest/USD` 的公开 JSON。
   - 用户输入金额不上传；无广告、无分析、无远程代码、无个人数据收集。
8. 隐私政策 URL：
   - 中文：`https://github.com/Cartmancxx/zhen-huisuan/blob/main/PRIVACY.md`
   - English：`https://github.com/Cartmancxx/zhen-huisuan/blob/main/PRIVACY_EN.md`
9. 在 **Distribution** 选择公开范围与地区，检查预览。
10. 粘贴文档中的“审核测试说明”，再提交审核。

Chrome 素材规格：

- 图标：128×128
- 截图：1280×800
- 小型宣传图：440×280，全局一套
- Marquee：1400×560，全局一套，可选
- 视频：YouTube URL

## 4. 上传 Microsoft Edge Add-ons

1. 打开 [Microsoft Partner Center / Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/overview)。
2. 创建新扩展并上传同一个 `release/zhen-huisuan-v2.1.0-store.zip`。
3. 填写扩展属性、可用地区与支持信息。
4. 添加四个商品页语言：
   - 简体中文：`store-listing/edge-zh-CN.md`
   - English：`store-listing/edge-en.md`
   - 繁體中文：`store-listing/edge-zh-TW.md`
   - Tiếng Việt：`store-listing/edge-vi.md`
   Edge 的名称和短说明来自扩展包中的 `manifest.json` / `_locales`，后台通常只读；各文档中的长说明复制到 Description。
5. 上传 `store-assets/edge/logo-300x300.png`，再按语言上传截图和宣传图。
6. 填入相应 YouTube URL，并确认该视频没有广告。
7. 隐私政策、权限用途和审核说明与 Chrome 保持一致。
8. 检查预览后点击发布。

Edge 素材规格：

- 商店 Logo：300×300
- 截图：1280×800
- 小型宣传图：440×280
- 大型宣传图：1400×560
- 视频：YouTube URL，广告关闭

## 5. 审核口径

始终使用这些准确表述：

- “任意输入框都能作为换算起点”
- “输入后立即联动”
- “`1,000` 会识别为 1000”
- “最新每日参考汇率”

不要写“逐秒实时行情”，也不要暗示结果等同于银行、支付平台或报关结算价。

## 6. 审核通过后

把 Chrome 与 Edge 的正式商品页 URL 加到 `README.md` 和 `README_EN.md`，并在 GitHub Release 说明中同时提供：

- Chrome Web Store
- Microsoft Edge Add-ons
- GitHub 手动安装包

官方参考：

- [Chrome Web Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing/)
- [Chrome publish guide](https://developer.chrome.com/docs/webstore/publish/)
- [Microsoft Edge publish guide](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension)
