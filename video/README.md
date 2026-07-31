# 真汇算宣传视频工程

使用 Remotion 制作的 27 秒产品宣传片，画面来自扩展真实界面截图，没有模拟不存在的功能。

## 成片版本

运行：

```powershell
cd video
npm ci
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/render-all.ps1
```

商店发布用成片位于：

```text
out/delivery/zhen-huisuan-promo-zh.mp4
out/delivery/zhen-huisuan-promo-zh-no-bgm.mp4
out/delivery/zhen-huisuan-promo-en.mp4
out/delivery/zhen-huisuan-promo-en-no-bgm.mp4
```

有背景乐版本用于 YouTube 与商店商品页；无背景乐版本保留全部动作音效，方便以后增加口播或更换音乐。所有版本均为 1920×1080、30fps、H.264 + AAC。

## 核心演示

- 任意货币框都能直接输入
- `1,000` 按 1000 识别
- CNY 输入后 HKD、USD、VND 联动
- VND 输入后其他三种货币联动
- 2–8 种货币、自动语言和自愿赞助设置
- Chrome、Edge 与 GitHub 开源地址

视频使用的固定汇率只用于可重复演示，商品口径仍为“最新每日参考汇率，并非逐秒交易报价”。

声音素材与来源见 [AUDIO-CREDITS.md](AUDIO-CREDITS.md)。
