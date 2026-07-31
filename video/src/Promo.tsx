import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const PROMO_DURATION = 810;

type PromoLocale = "zh-CN" | "en";

type PromoProps = {
  locale: PromoLocale;
  withBgm: boolean;
};

const SHOTS = {
  hook: { from: 0, duration: 84 },
  hero: { from: 84, duration: 120 },
  input: { from: 204, duration: 174 },
  vnd: { from: 378, duration: 138 },
  panel: { from: 516, duration: 126 },
  outro: { from: 642, duration: 168 },
} as const;

const COLORS = {
  blue: "#1265e9",
  blueDeep: "#0759d8",
  ink: "#13161b",
  muted: "#737983",
  line: "#e5e8ed",
  pale: "#f4f8ff",
  night: "#071426",
  nightSoft: "#0b1f3a",
  green: "#2ab24b",
  white: "#ffffff",
};

const FONT =
  '"Segoe UI Variable","Segoe UI","PingFang SC","Microsoft YaHei UI","Microsoft YaHei",sans-serif';

const frameFile = (name: string) => staticFile(`textures/live/${name}`);

type SfxCue = {
  from: number;
  duration: number;
  file: string;
  volume: number;
};

const SFX_CUES: readonly SfxCue[] = [
  {
    from: SHOTS.hook.from + 24,
    duration: 16,
    file: "typewriter-hit-soft.mp3",
    volume: 0.2,
  },
  {
    from: SHOTS.hook.from + 30,
    duration: 16,
    file: "typewriter-hit-hard.mp3",
    volume: 0.16,
  },
  {
    from: SHOTS.hook.from + 36,
    duration: 16,
    file: "typewriter-hit-soft.mp3",
    volume: 0.18,
  },
  {
    from: SHOTS.hook.from + 53,
    duration: 28,
    file: "marker-pen-line.mp3",
    volume: 0.34,
  },
  {
    from: SHOTS.hook.from + 71,
    duration: 48,
    file: "whoosh-fast.mp3",
    volume: 0.24,
  },
  {
    from: SHOTS.hero.from + 28,
    duration: 62,
    file: "air-woosh-deep.mp3",
    volume: 0.2,
  },
  {
    from: SHOTS.hero.from + 101,
    duration: 24,
    file: "transition-snap.mp3",
    volume: 0.3,
  },
  {
    from: SHOTS.input.from + 30,
    duration: 18,
    file: "click-camera.mp3",
    volume: 0.34,
  },
  {
    from: SHOTS.input.from + 44,
    duration: 16,
    file: "typewriter-hit-soft.mp3",
    volume: 0.26,
  },
  {
    from: SHOTS.input.from + 52,
    duration: 16,
    file: "typewriter-hit-hard.mp3",
    volume: 0.22,
  },
  {
    from: SHOTS.input.from + 60,
    duration: 16,
    file: "typewriter-hit-soft.mp3",
    volume: 0.24,
  },
  {
    from: SHOTS.input.from + 68,
    duration: 20,
    file: "typewriter-hit-hard.mp3",
    volume: 0.3,
  },
  {
    from: SHOTS.vnd.from,
    duration: 42,
    file: "transition-soft.mp3",
    volume: 0.2,
  },
  {
    from: SHOTS.vnd.from + 59,
    duration: 24,
    file: "switch-click-quick.mp3",
    volume: 0.28,
  },
  {
    from: SHOTS.panel.from + 10,
    duration: 18,
    file: "camera-shutter-hard.mp3",
    volume: 0.2,
  },
  {
    from: SHOTS.panel.from + 12,
    duration: 32,
    file: "camera-lens-shutter.mp3",
    volume: 0.16,
  },
  {
    from: SHOTS.panel.from + 14,
    duration: 18,
    file: "click-camera.mp3",
    volume: 0.18,
  },
  {
    from: SHOTS.panel.from + 58,
    duration: 48,
    file: "whoosh-fast.mp3",
    volume: 0.22,
  },
  {
    from: SHOTS.outro.from + 24,
    duration: 54,
    file: "air-whoosh-powerful.mp3",
    volume: 0.22,
  },
  {
    from: SHOTS.outro.from + 76,
    duration: 42,
    file: "impact-deep-whoosh.mp3",
    volume: 0.32,
  },
  {
    from: SHOTS.outro.from + 101,
    duration: 52,
    file: "shimmer-sparkle-sweep.mp3",
    volume: 0.15,
  },
];

const Soundtrack: React.FC<{ withBgm: boolean }> = ({ withBgm }) => {
  const frame = useCurrentFrame();
  const bgmVolume = interpolate(
    frame,
    [0, 24, 500, 620, 742, 780, PROMO_DURATION],
    [0, 0.2, 0.2, 0.22, 0.24, 0.16, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <>
      {withBgm ? (
        <Audio
          src={staticFile("audio/bgm/house-vibez.mp3")}
          volume={bgmVolume}
        />
      ) : null}
      {SFX_CUES.map((cue, index) => (
        <Sequence
          key={`${cue.file}-${cue.from}-${index}`}
          from={cue.from}
          durationInFrames={cue.duration}
          layout="none"
        >
          <Audio
            src={staticFile(`audio/sfx/${cue.file}`)}
            volume={cue.volume}
          />
        </Sequence>
      ))}
    </>
  );
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const fade = (
  frame: number,
  start: number,
  end: number,
  easing: (value: number) => number = Easing.out(Easing.cubic),
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const Copy = {
  "zh-CN": {
    hookEyebrow: "换汇，本来不用这么多步",
    hookLines: ["为什么还要", "选方向、点换算？"],
    hookSub: "金额已经在手里，就该直接得到所有结果。",
    steps: ["选择原币种", "选择目标币种", "输入金额"],
    convert: "换算",
    heroEyebrow: "任意框，都是输入框",
    heroLines: ["输入任意币种，", "全部金额马上更新。"],
    heroSub: "不选方向，不点按钮。多币种就在同一张表里完成。",
    live: "在线汇率已更新",
    inputEyebrow: "真实金额格式，直接识别",
    inputTitle: "千分符，直接贴。",
    readAs: "识别为 1000",
    sourceEyebrow: "任意币种都能成为入口",
    sourceTitle: "换一个币种，照样直接算。",
    paste: "粘贴 VND 金额",
    proof: "约 165 种币种 · 2–8 个同屏 · 自动语言",
    panelLabels: ["2–8 个同屏", "English", "自动语言"],
    wordmark: "真汇算",
    tagline: "多币种，即输即算",
    platforms: "Chrome · Edge · 免费开源",
    openSource: "开源地址",
  },
  en: {
    hookEyebrow: "Currency conversion needs fewer steps",
    hookLines: ["Why choose a direction,", "then click Convert?"],
    hookSub: "You already have the amount. Every result should follow.",
    steps: ["Choose source", "Choose target", "Enter amount"],
    convert: "Convert",
    heroEyebrow: "EVERY CURRENCY IS AN INPUT",
    heroLines: ["Enter any currency.", "Every amount updates."],
    heroSub: "No direction picker. No convert button. One table does it all.",
    live: "Online rates updated",
    inputEyebrow: "BUILT FOR REAL AMOUNTS",
    inputTitle: "Paste amounts as they are.",
    readAs: "Read as 1000",
    sourceEyebrow: "ANY CURRENCY CAN LEAD",
    sourceTitle: "Switch the source. Same instant result.",
    paste: "Paste VND amount",
    proof: "~165 currencies · 2–8 on screen · Auto language",
    panelLabels: ["2–8 on screen", "Tiếng Việt", "Auto language"],
    wordmark: "Zhen Hui Suan",
    tagline: "Any currency. Instant conversion.",
    platforms: "Chrome · Edge · Free & open source",
    openSource: "Open source",
  },
} as const;

const LogoMark: React.FC<{ size: number; shadow?: boolean }> = ({
  size,
  shadow = false,
}) => (
  <div
    style={{
      display: "grid",
      width: size,
      height: size,
      placeItems: "center",
      borderRadius: size * 0.26,
      background: COLORS.blue,
      boxShadow: shadow ? `0 ${size * 0.3}px ${size * 0.7}px rgba(7,89,216,.24)` : "none",
    }}
  >
    <svg
      width={size * 0.72}
      height={size * 0.72}
      viewBox="0 0 48 48"
      fill="none"
      stroke="#fff"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 17h26M31 11l6 6-6 6M37 31H11M17 25l-6 6 6 6" />
    </svg>
  </div>
);

const BrandMini: React.FC<{ light?: boolean }> = ({ light = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <LogoMark size={54} shadow />
    <span
      style={{
        color: light ? "#fff" : COLORS.ink,
        fontSize: 30,
        fontWeight: 780,
        letterSpacing: "-0.045em",
      }}
    >
      真汇算
    </span>
  </div>
);

const PopupCard: React.FC<{
  file: string;
  width: number;
  top?: number;
  left?: number;
  radius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ file, width, top, left, radius = 28, style, children }) => {
  const height = (width * 486) / 390;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,.16)",
        borderRadius: radius,
        background: "#fff",
        boxShadow:
          "0 56px 140px rgba(0,0,0,.38), 0 0 0 12px rgba(255,255,255,.045)",
        ...style,
      }}
    >
      <Img
        src={frameFile(file)}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      {children}
    </div>
  );
};

const Cursor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}> = ({ x, y, scale = 1, opacity = 1 }) => (
  <svg
    width={54}
    height={60}
    viewBox="0 0 40 44"
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      transform: `scale(${scale})`,
      filter: "drop-shadow(0 6px 10px rgba(0,0,0,.42))",
      zIndex: 30,
    }}
  >
    <path
      d="M4 2 L4 34 L13 26 L19 40 L26 37 L20 23 L32 22 Z"
      fill="#fff"
      stroke={COLORS.night}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </svg>
);

const bezierPoint = (
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
) => {
  const u = 1 - t;
  return {
    x:
      u * u * u * p0.x +
      3 * u * u * t * p1.x +
      3 * u * t * t * p2.x +
      t * t * t * p3.x,
    y:
      u * u * u * p0.y +
      3 * u * u * t * p1.y +
      3 * u * t * t * p2.y +
      t * t * t * p3.y,
  };
};

const HookScene: React.FC<{ locale: PromoLocale }> = ({ locale }) => {
  const frame = useCurrentFrame();
  const copy = Copy[locale];
  const titleIn = fade(frame, 8, 26);
  const cardIn = fade(frame, 18, 38, Easing.bezier(0.18, 0.9, 0.22, 1));
  const strike = fade(frame, 53, 68, Easing.inOut(Easing.cubic));
  const gate = fade(frame, 71, 83, Easing.in(Easing.cubic));

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 78% 42%, rgba(18,101,233,.11), transparent 34%), #fff",
        color: COLORS.ink,
        fontFamily: FONT,
      }}
    >
      <div style={{ position: "absolute", left: 124, top: 72 }}>
        <BrandMini />
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          top: 380,
          width: 850,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 26}px)`,
        }}
      >
        <div
          style={{
            marginBottom: 24,
            color: COLORS.blue,
            fontSize: 23,
            fontWeight: 760,
            letterSpacing: locale === "en" ? ".11em" : ".04em",
            textTransform: locale === "en" ? "uppercase" : "none",
          }}
        >
          {copy.hookEyebrow}
        </div>
        <div
          style={{
            fontSize: locale === "en" ? 80 : 94,
            fontWeight: 800,
            lineHeight: 1.03,
            letterSpacing: locale === "en" ? "-.055em" : "-.07em",
          }}
        >
          {copy.hookLines[0]}
          <br />
          {copy.hookLines[1]}
        </div>
        <div
          style={{
            marginTop: 30,
            width: 790,
            color: COLORS.muted,
            fontSize: locale === "en" ? 32 : 34,
            fontWeight: 540,
            lineHeight: 1.42,
            letterSpacing: "-.025em",
          }}
        >
          {copy.hookSub}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 140,
          top: 278,
          width: 650,
          padding: "42px 46px 46px",
          border: "1px solid rgba(18,101,233,.14)",
          borderRadius: 38,
          background: "rgba(255,255,255,.94)",
          boxShadow: "0 36px 110px rgba(7,20,38,.14)",
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 42}px) scale(${0.96 + cardIn * 0.04})`,
        }}
      >
        {copy.steps.map((step, index) => {
          const stepIn = fade(frame, 24 + index * 6, 34 + index * 6);
          return (
            <div
              key={step}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 44px",
                alignItems: "center",
                minHeight: 102,
                gap: 20,
                borderBottom: `1px solid ${COLORS.line}`,
                color: "#4d5560",
                fontSize: 28,
                fontWeight: 650,
                opacity: stepIn,
                transform: `translateX(${(1 - stepIn) * 28}px)`,
              }}
            >
              <span
                style={{
                  display: "grid",
                  width: 38,
                  height: 38,
                  placeItems: "center",
                  border: "1px solid #d7dde7",
                  borderRadius: "50%",
                  color: "#7b838e",
                  fontSize: 16,
                }}
              >
                {index + 1}
              </span>
              <span>{step}</span>
              <span style={{ color: "#b5bbc4", fontSize: 31, fontWeight: 400 }}>×</span>
            </div>
          );
        })}
        <div
          style={{
            display: "grid",
            height: 84,
            marginTop: 28,
            placeItems: "center",
            borderRadius: 18,
            background: "#dfe5ec",
            color: "#737b86",
            fontSize: 28,
            fontWeight: 740,
          }}
        >
          {copy.convert}
        </div>
        <svg
          width={760}
          height={360}
          viewBox="0 0 760 360"
          style={{
            position: "absolute",
            left: -52,
            top: 96,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <line
            x1={20}
            y1={310}
            x2={730}
            y2={40}
            stroke={COLORS.blue}
            strokeWidth={14}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - strike}
            style={{ filter: "drop-shadow(0 9px 26px rgba(18,101,233,.22))" }}
          />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1380,
          top: 510,
          width: 3100,
          height: 3100,
          borderRadius: "50%",
          background: COLORS.blue,
          transform: `translate(-50%,-50%) scale(${gate})`,
          zIndex: 50,
        }}
      />
    </AbsoluteFill>
  );
};

const HeroScene: React.FC<{ locale: PromoLocale }> = ({ locale }) => {
  const frame = useCurrentFrame();
  const copy = Copy[locale];
  const base = locale === "zh-CN" ? "zh-cn-cny-main.png" : "en-cny-main.png";
  const enter = fade(frame, 8, 28);
  const push = fade(frame, 28, 50, Easing.bezier(0.34, 0, 0.18, 1));
  const rise = fade(frame, 50, 62, Easing.bezier(0.18, 1.18, 0.25, 1));
  const reseat = fade(frame, 82, 101, Easing.bezier(0.38, 0, 0.25, 1));
  const lift = rise * (1 - reseat);
  const gateOut = fade(frame, 0, 12, Easing.out(Easing.cubic));
  const spotX = interpolate(frame, [12, 24, 36, 48], [26, 72, 44, 62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const spotY = interpolate(frame, [12, 24, 36, 48], [28, 42, 70, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        color: "#fff",
        fontFamily: FONT,
        background:
          "radial-gradient(circle at 72% 50%, rgba(18,101,233,.34), transparent 34%), linear-gradient(135deg,#071426 0%,#0b1f3a 62%,#08295c 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 224,
          width: 800,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 34}px)`,
        }}
      >
        <div
          style={{
            color: "#8ab7ff",
            fontSize: 24,
            fontWeight: 780,
            letterSpacing: locale === "en" ? ".12em" : ".04em",
            textTransform: locale === "en" ? "uppercase" : "none",
          }}
        >
          {copy.heroEyebrow}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: locale === "en" ? 82 : 86,
            fontWeight: 790,
            lineHeight: 1.05,
            letterSpacing: "-.06em",
          }}
        >
          {copy.heroLines[0]}
          <br />
          {copy.heroLines[1]}
        </div>
        <div
          style={{
            marginTop: 28,
            width: 760,
            color: "#b6c6df",
            fontSize: locale === "en" ? 30 : 32,
            fontWeight: 540,
            lineHeight: 1.45,
            letterSpacing: "-.02em",
          }}
        >
          {copy.heroSub}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 13,
            marginTop: 38,
            padding: "14px 20px",
            border: "1px solid rgba(255,255,255,.16)",
            borderRadius: 999,
            background: "rgba(255,255,255,.08)",
            color: "#e7f0ff",
            fontSize: 22,
            fontWeight: 690,
          }}
        >
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: COLORS.green,
              boxShadow: "0 0 0 6px rgba(42,178,75,.14)",
            }}
          />
          {copy.live}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1030,
          top: 95,
          width: 820,
          height: 890,
          opacity: enter,
          transform: `translateX(${(1 - push) * 64}px) scale(${0.92 + push * 0.08})`,
          transformOrigin: "58% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 42,
            width: 770,
            height: 770,
            border: "1px solid rgba(138,183,255,.18)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 104,
            top: 116,
            width: 622,
            height: 622,
            border: "1px solid rgba(138,183,255,.11)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(430px 350px at ${spotX}% ${spotY}%, rgba(138,183,255,.24), transparent 72%)`,
          }}
        />
        <PopupCard
          file={base}
          width={580}
          left={120}
          top={98 - lift * 22}
          style={{
            transform: `rotateY(${-push * 4}deg) scale(${1 + lift * 0.018})`,
            transformOrigin: "center",
            boxShadow: `0 ${56 + lift * 26}px ${140 + lift * 40}px rgba(0,0,0,.42), 0 0 0 12px rgba(255,255,255,.045)`,
          }}
        />
        {["CNY", "HKD", "USD", "VND"].map((code, index) => {
          const positions = [
            { left: 650, top: 122 },
            { left: 8, top: 300 },
            { left: 682, top: 632 },
            { left: 52, top: 760 },
          ];
          const itemIn = fade(frame, 40 + index * 3, 50 + index * 3);
          return (
            <div
              key={code}
              style={{
                position: "absolute",
                ...positions[index],
                display: "grid",
                minWidth: 100,
                height: 54,
                placeItems: "center",
                border: "1px solid rgba(255,255,255,.18)",
                borderRadius: 999,
                background: "rgba(5,17,34,.84)",
                boxShadow: "0 18px 44px rgba(0,0,0,.24)",
                color: "#dbe9ff",
                fontSize: 18,
                fontWeight: 780,
                letterSpacing: ".08em",
                opacity: itemIn,
                transform: `translateY(${(1 - itemIn) * 12}px)`,
              }}
            >
              {code}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          height: `${(1 - gateOut) * 1080}px`,
          background: COLORS.blue,
          zIndex: 80,
        }}
      />
    </AbsoluteFill>
  );
};

const InputScene: React.FC<{ locale: PromoLocale }> = ({ locale }) => {
  const frame = useCurrentFrame();
  const copy = Copy[locale];
  const base = locale === "zh-CN" ? "zh-cn-cny" : "en-cny";
  const finalFile = `${base}-main.png`;
  const imageFile =
    frame < 34
      ? finalFile
      : frame < 44
        ? `${base}-typing-blank.png`
        : frame < 52
          ? `${base}-typing-1.png`
          : frame < 60
            ? `${base}-typing-10.png`
            : frame < 68
              ? `${base}-typing-100.png`
              : `${base}-typing-1000.png`;

  const CARD = { left: 1082, top: 132, width: 650 };
  const cardHeight = (CARD.width * 486) / 390;
  const click = {
    x: CARD.left + (CARD.width * 334) / 390 - 8,
    y: CARD.top + (cardHeight * 112) / 486 - 6,
  };
  const cursorT =
    frame < 24
      ? interpolate(frame, [0, 24], [0, 1.05], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : interpolate(frame, [24, 30], [1.05, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.quad),
        });
  const cursor = bezierPoint(
    cursorT,
    { x: 710, y: 940 },
    { x: 980, y: 1020 },
    { x: 1810, y: 560 },
    click,
  );
  const press = interpolate(frame, [30, 32, 36], [1, 0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom =
    frame < 108
      ? interpolate(frame, [30, 43], [1, 1.08], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : interpolate(frame, [108, 130], [1.08, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });
  const proofIn = fade(frame, 71, 88);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        color: "#fff",
        fontFamily: FONT,
        background:
          "radial-gradient(circle at 76% 42%, rgba(18,101,233,.3), transparent 32%), linear-gradient(135deg,#071426,#0b1f3a 60%,#08295c)",
      }}
    >
      <div style={{ position: "absolute", left: 118, top: 156, width: 800 }}>
        <div
          style={{
            color: "#8ab7ff",
            fontSize: 24,
            fontWeight: 780,
            letterSpacing: locale === "en" ? ".12em" : ".04em",
            textTransform: locale === "en" ? "uppercase" : "none",
          }}
        >
          {copy.inputEyebrow}
        </div>
        <div
          style={{
            marginTop: 26,
            maxWidth: 820,
            fontSize: locale === "en" ? 76 : 88,
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-.06em",
          }}
        >
          {copy.inputTitle}
        </div>
        <div
          style={{
            width: 600,
            marginTop: 56,
            padding: "30px 34px",
            border: "1px solid rgba(138,183,255,.24)",
            borderRadius: 26,
            background: "rgba(255,255,255,.075)",
            opacity: proofIn,
            transform: `translateY(${(1 - proofIn) * 22}px)`,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: 78,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-.05em",
            }}
          >
            1,000
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,.12)",
              color: "#c7d5eb",
              fontSize: 34,
              fontWeight: 620,
            }}
          >
            <span
              style={{
                display: "grid",
                width: 36,
                height: 36,
                placeItems: "center",
                borderRadius: 12,
                background: "rgba(42,178,75,.16)",
                color: "#5cda7a",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              ✓
            </span>
            {copy.readAs}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          height: cardHeight,
          transform: `scale(${zoom})`,
          transformOrigin: `${(click.x - CARD.left) / CARD.width * 100}% ${(click.y - CARD.top) / cardHeight * 100}%`,
          zIndex: 5,
        }}
      >
        <PopupCard
          file={imageFile}
          width={CARD.width}
          left={0}
          top={0}
          style={{ boxShadow: "0 56px 140px rgba(0,0,0,.42)" }}
        >
          {[1, 2, 3].map((rowIndex, index) => {
            const start = 68 + index * 2;
            const spread = fade(frame, start, start + 5);
            const out = 1 - fade(frame, start + 5, start + 13, Easing.linear);
            const y = ((68 + (rowIndex + 1) * 88) / 486) * cardHeight - 2;
            return (
              <div
                key={rowIndex}
                style={{
                  position: "absolute",
                  left: `${(1 - spread) * 50}%`,
                  top: y,
                  width: `${spread * 100}%`,
                  height: 3,
                  borderRadius: 999,
                  background: COLORS.blue,
                  boxShadow: "0 0 12px rgba(18,101,233,.5)",
                  opacity: out,
                }}
              />
            );
          })}
        </PopupCard>
      </div>

      {frame <= 104 ? (
        <Cursor
          x={cursor.x}
          y={cursor.y}
          scale={press}
          opacity={1 - fade(frame, 91, 104)}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const VndScene: React.FC<{ locale: PromoLocale }> = ({ locale }) => {
  const frame = useCurrentFrame();
  const copy = Copy[locale];
  const base = locale === "zh-CN" ? "zh-cn-vnd" : "en-vnd";
  const oldFile = locale === "zh-CN" ? "zh-cn-cny-main.png" : "en-cny-main.png";
  const newFile = frame < 59 ? `${base}-blank.png` : `${base}-main.png`;
  const CARD = { left: 1082, top: 132, width: 650 };
  const cardHeight = (CARD.width * 486) / 390;
  const wipe = fade(frame, 0, 36, Easing.bezier(0.5, 0, 0.2, 1));
  const y0 = (68 / 486) * cardHeight;
  const h0 = (88 / 486) * cardHeight;
  const clipY = interpolate(wipe, [0, 1], [y0, 0]);
  const clipH = interpolate(wipe, [0, 1], [h0, cardHeight]);
  const clipR = interpolate(wipe, [0, 1], [14, 28]);
  const textIn = fade(frame, 38, 53);
  const paste = fade(frame, 56, 61, Easing.out(Easing.cubic));
  const ripple = frame >= 57 && frame <= 76 ? fade(frame, 57, 72) : 0;
  const gate = fade(frame, 124, 138, Easing.in(Easing.cubic));

  const vndClick = {
    x: CARD.left + (CARD.width * 332) / 390,
    y: CARD.top + (cardHeight * 376) / 486,
  };

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        color: "#fff",
        fontFamily: FONT,
        background:
          "radial-gradient(circle at 76% 58%, rgba(18,101,233,.3), transparent 34%), linear-gradient(135deg,#071426,#0b1f3a 60%,#08295c)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 164,
          width: 820,
          opacity: textIn,
          transform: `translateY(${(1 - textIn) * 26}px)`,
        }}
      >
        <div
          style={{
            color: "#8ab7ff",
            fontSize: 24,
            fontWeight: 780,
            letterSpacing: locale === "en" ? ".12em" : ".04em",
            textTransform: locale === "en" ? "uppercase" : "none",
          }}
        >
          {copy.sourceEyebrow}
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: locale === "en" ? 72 : 82,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-.06em",
          }}
        >
          {locale === "zh-CN" ? (
            <>
              换一个币种，
              <br />
              照样直接算。
            </>
          ) : (
            copy.sourceTitle
          )}
        </div>
        <div
          style={{
            marginTop: 54,
            color: "#9eb8df",
            fontSize: 30,
            fontWeight: 680,
          }}
        >
          {copy.paste}
        </div>
        <div
          style={{
            marginTop: 10,
            color: "#fff",
            fontSize: locale === "en" ? 72 : 82,
            fontWeight: 590,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-.055em",
            opacity: paste,
            transform: `translateY(${(1 - paste) * 18}px)`,
          }}
        >
          26.252.670
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          height: cardHeight,
          overflow: "hidden",
          borderRadius: 28,
          background: "#fff",
          boxShadow: "0 56px 140px rgba(0,0,0,.42)",
        }}
      >
        <Img
          src={frameFile(oldFile)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: clipY,
            width: CARD.width,
            height: clipH,
            overflow: "hidden",
            borderRadius: clipR,
            boxShadow:
              wipe > 0 && wipe < 1 ? "0 18px 56px rgba(7,20,38,.22)" : "none",
          }}
        >
          <Img
            src={frameFile(newFile)}
            style={{
              position: "absolute",
              left: 0,
              top: -clipY,
              width: CARD.width,
              height: cardHeight,
            }}
          />
        </div>
        {frame >= 58 && frame <= 76 ? (
          <div
            style={{
              position: "absolute",
              left: `${50 - ripple * 50}%`,
              top: ((68 + 3 * 88) / 486) * cardHeight + h0 - 2,
              width: `${ripple * 100}%`,
              height: 3,
              borderRadius: 999,
              background: COLORS.blue,
              boxShadow: "0 0 12px rgba(18,101,233,.5)",
              opacity: 1 - fade(frame, 68, 76, Easing.linear),
            }}
          />
        ) : null}
      </div>

      {frame >= 42 && frame <= 76 ? (
        <>
          <Cursor
            x={vndClick.x - 12}
            y={vndClick.y - 10}
            scale={interpolate(frame, [56, 58, 62], [1, 0.84, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            opacity={1 - fade(frame, 68, 76)}
          />
          {frame >= 56 ? (
            <div
              style={{
                position: "absolute",
                left: vndClick.x - 95 * ripple,
                top: vndClick.y - 95 * ripple,
                width: 190 * ripple,
                height: 190 * ripple,
                border: "4px solid rgba(18,101,233,.7)",
                borderRadius: "50%",
                opacity: 1 - ripple,
              }}
            />
          ) : null}
        </>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLORS.blue,
          transform: `translateX(${(1 - gate) * 100}%)`,
          zIndex: 60,
        }}
      />
    </AbsoluteFill>
  );
};

const PanelContent: React.FC<{
  file: string;
  centerX: number;
  width: number;
  label: string;
  settings?: boolean;
  background: string;
}> = ({ file, centerX, width, label, settings = false, background }) => {
  const height = settings ? (width * 580) / 390 : (width * 486) / 390;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background }}>
      <div
        style={{
          position: "absolute",
          left: centerX - width / 2,
          top: (1080 - height) / 2 + 24,
          width,
          height,
          overflow: "hidden",
          border: "1px solid rgba(7,20,38,.12)",
          borderRadius: 28,
          background: "#fff",
          boxShadow: "0 40px 110px rgba(7,20,38,.18)",
        }}
      >
        <Img src={frameFile(file)} style={{ width: "100%", height: "100%" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: 74,
          transform: "translateX(-50%)",
          padding: "13px 20px",
          border: "1px solid rgba(18,101,233,.18)",
          borderRadius: 999,
          background: "rgba(255,255,255,.92)",
          boxShadow: "0 14px 34px rgba(7,20,38,.08)",
          color: COLORS.blueDeep,
          fontSize: 32,
          fontWeight: 760,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};

const PanelScene: React.FC<{ locale: PromoLocale }> = ({ locale }) => {
  const frame = useCurrentFrame();
  const copy = Copy[locale];
  const gateOut = fade(frame, 0, 10, Easing.out(Easing.cubic));
  const expand = fade(frame, 58, 74, Easing.out(Easing.cubic));
  const proofIn = fade(frame, 22, 35);
  const proofOut = 1 - fade(frame, 52, 62);
  const currentMain = locale === "zh-CN" ? "zh-cn-cny-main.png" : "en-cny-main.png";
  const settings = locale === "zh-CN" ? "zh-cn-settings.png" : "en-settings.png";
  const middle = locale === "zh-CN" ? "en-cny-main.png" : "vi-cny-main.png";

  const panelSpecs = [
    {
      clip: "polygon(0 0, 760px 0, 530px 1080px, 0 1080px)",
      start: 10,
      content: (
        <PanelContent
          file={settings}
          centerX={360}
          width={500}
          label={copy.panelLabels[0]}
          settings
          background="#eef5ff"
        />
      ),
    },
    {
      clip: "polygon(755px 0, 1410px 0, 1180px 1080px, 525px 1080px)",
      start: 12,
      content: (
        <PanelContent
          file={middle}
          centerX={970}
          width={510}
          label={copy.panelLabels[1]}
          background="#f8fbff"
        />
      ),
    },
  ];

  const thirdTop = interpolate(expand, [0, 1], [1405, -80]);
  const thirdBottom = interpolate(expand, [0, 1], [1175, -310]);
  const thirdCenter = interpolate(expand, [0, 1], [1605, 960]);
  const thirdWidth = interpolate(expand, [0, 1], [500, 600]);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: "#fff",
        color: COLORS.ink,
        fontFamily: FONT,
      }}
    >
      {panelSpecs.map((panel, index) => {
        const panelIn = fade(frame, panel.start, panel.start + 3);
        if (frame < panel.start) return null;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: panel.clip,
              transform: `scale(${1.055 - panelIn * 0.055})`,
              transformOrigin: index === 0 ? "320px 540px" : "960px 540px",
              filter: `brightness(${0.78 + panelIn * 0.22})`,
            }}
          >
            {panel.content}
          </div>
        );
      })}

      {frame >= 14 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            clipPath: `polygon(${thirdTop}px 0, 1920px 0, 1920px 1080px, ${thirdBottom}px 1080px)`,
            transform: `scale(${1.055 - fade(frame, 14, 17) * 0.055})`,
            transformOrigin: "1600px 540px",
          }}
        >
          <PanelContent
            file={currentMain}
            centerX={thirdCenter}
            width={thirdWidth}
            label={copy.panelLabels[2]}
            background="#eaf2ff"
          />
        </div>
      ) : null}

      {frame >= 12 && frame < 74 ? (
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none" }}
        >
          <g opacity={1 - expand}>
            <line x1={750} y1={-10} x2={520} y2={1090} stroke={COLORS.night} strokeWidth={18} />
            <line x1={750} y1={-10} x2={520} y2={1090} stroke="#fff" strokeWidth={10} />
          </g>
          <g opacity={1 - fade(frame, 68, 74)}>
            <line x1={thirdTop - 5} y1={-10} x2={thirdBottom - 5} y2={1090} stroke={COLORS.night} strokeWidth={18} />
            <line x1={thirdTop - 5} y1={-10} x2={thirdBottom - 5} y2={1090} stroke="#fff" strokeWidth={10} />
          </g>
        </svg>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          bottom: 46,
          zIndex: 12,
          padding: "24px 34px",
          border: "1px solid rgba(18,101,233,.16)",
          borderRadius: 22,
          background: "rgba(255,255,255,.9)",
          boxShadow: "0 20px 54px rgba(7,20,38,.12)",
          color: COLORS.ink,
          fontSize: locale === "en" ? 50 : 58,
          fontWeight: 760,
          letterSpacing: "-.035em",
          textAlign: "center",
          opacity: proofIn * proofOut,
          transform: `translateY(${(1 - proofIn) * 18}px)`,
        }}
      >
        {copy.proof}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          height: `${(1 - gateOut) * 1080}px`,
          background: COLORS.blue,
          zIndex: 30,
        }}
      />
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ locale: PromoLocale }> = ({ locale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = Copy[locale];
  const main = locale === "zh-CN" ? "zh-cn-cny-main.png" : "en-cny-main.png";
  const row = locale === "zh-CN" ? "zh-cn-cny-row-cny.png" : "en-cny-row-cny.png";

  const CARD = { left: 660, top: 165, width: 600 };
  const cardHeight = (CARD.width * 486) / 390;
  const rowStart = {
    x: CARD.left,
    y: CARD.top + (68 / 486) * cardHeight,
    w: CARD.width,
    h: (88 / 486) * cardHeight,
  };
  const morphRaw = spring({
    frame: frame - 24,
    fps,
    config: { damping: 13, stiffness: 90, mass: 0.9 },
  });
  const morph = clamp01(morphRaw);
  const target = { x: 880, y: 242, w: 160, h: 160 };
  const x = interpolate(morph, [0, 1], [rowStart.x, target.x]);
  const y = interpolate(morph, [0, 1], [rowStart.y, target.y]);
  const w = interpolate(morph, [0, 1], [rowStart.w, target.w]);
  const h = interpolate(morph, [0, 1], [rowStart.h, target.h]);
  const radius = interpolate(morph, [0, 1], [2, 42]);
  const cardOut = 1 - fade(frame, 12, 28);
  const rowIn = fade(frame, 6, 15);
  const arrow = fade(frame, 54, 76, Easing.out(Easing.cubic));
  const wordIn = fade(frame, 76, 104);
  const taglineIn = fade(frame, 98, 116);
  const metaIn = fade(frame, 108, 122);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 24%, rgba(18,101,233,.12), transparent 30%), linear-gradient(180deg,#f6f9ff,#fff)",
        color: COLORS.ink,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          height: cardHeight,
          overflow: "hidden",
          border: "1px solid rgba(7,20,38,.12)",
          borderRadius: 28,
          background: "#fff",
          boxShadow: "0 40px 110px rgba(7,20,38,.16)",
          opacity: cardOut,
        }}
      >
        <Img src={frameFile(main)} style={{ width: "100%", height: "100%" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          overflow: "hidden",
          borderRadius: radius,
          background: `rgba(18,101,233,${morph})`,
          boxShadow:
            morph > 0.25
              ? `0 ${interpolate(morph, [0, 1], [18, 34])}px ${interpolate(morph, [0, 1], [50, 90])}px rgba(7,89,216,.24)`
              : "0 18px 46px rgba(7,20,38,.14)",
          opacity: rowIn,
        }}
      >
        <Img
          src={frameFile(row)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: Math.max(0, 1 - morph * 1.45),
          }}
        />
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 128 128"
          style={{ position: "absolute", inset: 0, opacity: arrow }}
        >
          <path
            d="M35 47h54M78 36l11 11-11 11M93 81H39M50 70 39 81l11 11"
            fill="none"
            stroke="#fff"
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - arrow}
          />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: 180,
          right: 180,
          top: 475,
          textAlign: "center",
          opacity: wordIn,
          transform: `translateY(${(1 - wordIn) * 22}px) scale(${1.03 - wordIn * 0.03})`,
          filter: `blur(${(1 - wordIn) * 8}px)`,
        }}
      >
        <div
          style={{
            fontSize: locale === "en" ? 108 : 126,
            fontWeight: 820,
            lineHeight: 1,
            letterSpacing: locale === "en" ? "-.055em" : "-.07em",
          }}
        >
          {copy.wordmark}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          top: 625,
          textAlign: "center",
          color: COLORS.blueDeep,
          fontSize: locale === "en" ? 66 : 72,
          fontWeight: 760,
          letterSpacing: locale === "en" ? "-.035em" : "-.045em",
          opacity: taglineIn,
          transform: `translateY(${(1 - taglineIn) * 18}px)`,
        }}
      >
        {copy.tagline}
      </div>

      <div
        style={{
          position: "absolute",
          left: 180,
          right: 180,
          top: 760,
          textAlign: "center",
          opacity: metaIn,
          transform: `translateY(${(1 - metaIn) * 16}px)`,
        }}
      >
        <div style={{ color: "#4b5665", fontSize: 42, fontWeight: 700 }}>
          {copy.platforms}
        </div>
        <div
          style={{
            marginTop: 28,
            color: COLORS.muted,
            fontSize: 34,
            fontWeight: 590,
            letterSpacing: "-.015em",
          }}
        >
          {copy.openSource} · github.com/Cartmancxx/zhen-huisuan
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Promo: React.FC<PromoProps> = ({ locale, withBgm }) => (
  <AbsoluteFill style={{ background: "#fff", fontFamily: FONT }}>
    <Sequence
      from={SHOTS.hook.from}
      durationInFrames={SHOTS.hook.duration}
      premountFor={30}
    >
      <HookScene locale={locale} />
    </Sequence>
    <Sequence
      from={SHOTS.hero.from}
      durationInFrames={SHOTS.hero.duration}
      premountFor={30}
    >
      <HeroScene locale={locale} />
    </Sequence>
    <Sequence
      from={SHOTS.input.from}
      durationInFrames={SHOTS.input.duration}
      premountFor={30}
    >
      <InputScene locale={locale} />
    </Sequence>
    <Sequence
      from={SHOTS.vnd.from}
      durationInFrames={SHOTS.vnd.duration}
      premountFor={30}
    >
      <VndScene locale={locale} />
    </Sequence>
    <Sequence
      from={SHOTS.panel.from}
      durationInFrames={SHOTS.panel.duration}
      premountFor={30}
    >
      <PanelScene locale={locale} />
    </Sequence>
    <Sequence
      from={SHOTS.outro.from}
      durationInFrames={SHOTS.outro.duration}
      premountFor={30}
    >
      <OutroScene locale={locale} />
    </Sequence>
    <Soundtrack withBgm={withBgm} />
  </AbsoluteFill>
);
