# 发布指南

本文供维护者发布真汇算的新版本。用户安装说明见 [README.md](README.md)。

本项目当前仅通过 GitHub Releases 分发，不提交 Chrome Web Store 或 Microsoft Edge Add-ons。下方商店材料仅作为未来可选项保留。

## 1. 发布前检查

1. 确认 `manifest.json` 与 `package.json` 中的版本号一致。
2. 更新 `CHANGELOG.md`。
3. 安装锁定依赖并运行验证：

   ```powershell
   npm ci
   npm audit
   npm test
   npm run icons
   npm run normalize-assets
   ```

4. 在 Chrome 和 Edge 中加载已解压扩展，手动验证：
   - 任意一行输入后其他币种联动；
   - 千分符与全角数字可识别；
   - 设置中可增加、删除和替换币种；
   - 最少 2 种、最多 8 种；
   - 刷新、缓存与离线提示正常。

## 2. GitHub 发布

将 `main` 推送到公开仓库后创建版本标签：

```powershell
git tag -a v2.0.0 -m "真汇算 2.0.0"
git push origin main
git push origin v2.0.0
```

`.github/workflows/release.yml` 会重新运行测试，生成只包含扩展运行文件和必要说明的 ZIP，同时发布 SHA-256 校验文件。

## 3. 可选：Chrome Web Store

- 上传包：`release/真汇算-v2.0.0.zip`
- 文案：`store-listing/chrome-zh-CN.md`
- 图标：扩展包中的 `icons/icon-128.png`
- 截图：
  - `store-assets/chrome/screenshot-main-1280x800.png`
  - `store-assets/chrome/screenshot-settings-1280x800.png`
- 小型宣传图：`store-assets/chrome/promo-small-440x280.png`
- Marquee：`store-assets/chrome/promo-marquee-1400x560.png`
- 隐私政策：公开仓库中的 `PRIVACY.md`

完成 Store Listing、Privacy、Distribution 和测试说明后，检查预览，再提交审核。

## 4. 可选：Microsoft Edge Add-ons

- 上传与 Chrome 相同的扩展 ZIP
- 文案：`store-listing/edge-zh-CN.md`
- 商店 Logo：`store-assets/edge/logo-300x300.png`
- 截图与宣传图：`store-assets/edge/`
- 隐私政策：公开仓库中的 `PRIVACY.md`

提交前确认所有地区语言的必填项已完成。

## 5. 发布口径

始终使用“输入即时联动”“最新每日参考汇率”等准确表述。不要写成“逐秒实时行情”，也不要暗示结果等同于银行、支付平台或报关结算价。
