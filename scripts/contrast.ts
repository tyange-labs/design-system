#!/usr/bin/env bun
// 시맨틱 토큰의 fg/bg 조합이 WCAG 대비를 만족하는지 검사한다.
// 통과: 아무 출력 없이 exit 0. 실패: 미달 조합과 실제 수치를 출력하고 exit 1.
// `bun run contrast`로 실행. 색을 바꿀 때마다 이 스크립트가 최종 판정자다.

type HexColor = `#${string}`;

interface Palette {
  bg: HexColor;
  surface: HexColor;
  surfaceSunken: HexColor;
  overlay: HexColor;
  fg: HexColor;
  fgMuted: HexColor;
  fgSubtle: HexColor;
  fgOnAccent: HexColor;
  border: HexColor;
  borderStrong: HexColor;
  accent: HexColor;
  accentHover: HexColor;
  accentSoft: HexColor;
  danger: HexColor;
  dangerFg: HexColor;
  warning: HexColor;
  warningFg: HexColor;
  success: HexColor;
  successFg: HexColor;
}

// light/dark 값은 css/tokens.css, css/dark.css와 반드시 동기화한다.
// (지금은 두 곳에 중복 — 이 파일이 진실원천이고, CSS 작성 시 여기 값을 그대로 옮긴다.)
const light: Palette = {
  bg: "#faf9f7",
  surface: "#ffffff",
  surfaceSunken: "#f3f2ef",
  overlay: "#ffffff",
  fg: "#1a1917",
  fgMuted: "#5c5952",
  fgSubtle: "#8a8578",
  fgOnAccent: "#ffffff",
  border: "#e4e1da",
  borderStrong: "#8f897a",
  accent: "#5b5fee",
  accentHover: "#4a4ed9",
  accentSoft: "#eeeeff",
  danger: "#c8372c",
  dangerFg: "#ffffff",
  warning: "#a6620a",
  warningFg: "#ffffff",
  success: "#1f7a4d",
  successFg: "#ffffff",
};

const dark: Palette = {
  bg: "#171614",
  surface: "#201f1c",
  surfaceSunken: "#131211",
  overlay: "#26251f",
  fg: "#f2f0ea",
  fgMuted: "#b6b1a4",
  fgSubtle: "#847f72",
  fgOnAccent: "#0d0d12",
  border: "#38352d",
  borderStrong: "#7a7566",
  accent: "#9698ff",
  accentHover: "#aeb0ff",
  accentSoft: "#2a2a4a",
  danger: "#ff6b5e",
  dangerFg: "#1a0503",
  warning: "#e0a437",
  warningFg: "#1f1400",
  success: "#4fce93",
  successFg: "#03170d",
};

// 검사할 (전경, 배경, 최소비율, 설명) 목록.
// 4.5 = 본문 텍스트(WCAG AA), 3.0 = 큰 텍스트/UI 컴포넌트 경계.
function pairs(p: Palette): Array<[string, HexColor, HexColor, number]> {
  return [
    ["fg on bg", p.fg, p.bg, 4.5],
    ["fg on surface", p.fg, p.surface, 4.5],
    ["fg on surfaceSunken", p.fg, p.surfaceSunken, 4.5],
    ["fgMuted on bg", p.fgMuted, p.bg, 4.5],
    ["fgMuted on surface", p.fgMuted, p.surface, 4.5],
    ["fgSubtle on surface", p.fgSubtle, p.surface, 3.0], // 보조 라벨 취급
    ["fgOnAccent on accent", p.fgOnAccent, p.accent, 4.5],
    ["fgOnAccent on accentHover", p.fgOnAccent, p.accentHover, 4.5],
    ["accent on bg (large/UI)", p.accent, p.bg, 3.0],
    ["border on bg (UI)", p.borderStrong, p.bg, 3.0],
    ["dangerFg on danger", p.dangerFg, p.danger, 4.5],
    ["warningFg on warning", p.warningFg, p.warning, 4.5],
    ["successFg on success", p.successFg, p.success, 4.5],
    ["danger on surface (large/UI)", p.danger, p.surface, 3.0],
    ["warning on surface (large/UI)", p.warning, p.surface, 3.0],
    ["success on surface (large/UI)", p.success, p.surface, 3.0],
  ];
}

function hexToRgb(hex: HexColor): [number, number, number] {
  const h = hex.replace("#", "");
  const n = Number.parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [rl, gl, bl] = [toLinear(r), toLinear(g), toLinear(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(a: HexColor, b: HexColor): number {
  const la = relLuminance(hexToRgb(a));
  const lb = relLuminance(hexToRgb(b));
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

let failed = false;
for (const [modeName, palette] of [
  ["light", light],
  ["dark", dark],
] as const) {
  for (const [label, fg, bg, min] of pairs(palette)) {
    const ratio = contrastRatio(fg, bg);
    if (ratio < min) {
      failed = true;
      console.error(
        `[${modeName}] FAIL  ${label}: ${ratio.toFixed(2)}:1 (need ${min}:1)  fg=${fg} bg=${bg}`,
      );
    }
  }
}

if (failed) {
  console.error("\n대비 검사 실패. 위 조합의 색을 조정한 뒤 css/tokens.css · css/dark.css에도 반영할 것.");
  process.exit(1);
}

console.log("모든 시맨틱 조합이 WCAG 기준을 통과했습니다 (light + dark).");
