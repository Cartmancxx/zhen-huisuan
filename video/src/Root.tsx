import React from "react";
import { Composition } from "remotion";
import { Promo, PROMO_DURATION } from "./Promo";

const shared = {
  component: Promo,
  durationInFrames: PROMO_DURATION,
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

export const Root: React.FC = () => (
  <>
    <Composition
      id="ZhenHuiSuanZhBgm"
      {...shared}
      defaultProps={{ locale: "zh-CN", withBgm: true }}
    />
    <Composition
      id="ZhenHuiSuanZhNoBgm"
      {...shared}
      defaultProps={{ locale: "zh-CN", withBgm: false }}
    />
    <Composition
      id="ZhenHuiSuanEnBgm"
      {...shared}
      defaultProps={{ locale: "en", withBgm: true }}
    />
    <Composition
      id="ZhenHuiSuanEnNoBgm"
      {...shared}
      defaultProps={{ locale: "en", withBgm: false }}
    />
  </>
);
