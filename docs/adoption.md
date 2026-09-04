# 적용 가이드

## 설치 (git 의존성)

```bash
bun add "git+ssh://git@git.tyange.com/tyange-labs/design-system.git"
```

`package.json`에 아래처럼 기록된다. 버전을 고정하고 싶으면 `#<커밋SHA>`를 뒤에 붙인다.

```json
"@tyange-labs/design-system": "git+ssh://git@git.tyange.com/tyange-labs/design-system.git"
```

## Tailwind v4 CSS-first 프로젝트 (lovelog, palim, tyange-dev, …)

진입 CSS(`src/styles.css`, `app/globals.css` 등)에서 `@import "tailwindcss";` 바로
다음에 순서대로 추가한다. 순서가 중요하다 — `theme.css`는 반드시 `tokens.css`/
`dark.css`보다 뒤에 온다.

```css
@import "tailwindcss";
@import "@tyange-labs/design-system/tokens.css";
@import "@tyange-labs/design-system/dark.css";
@import "@tyange-labs/design-system/theme.css";

@custom-variant dark (&:where(.dark, .dark *));
```

다크 토글이 없고 OS 설정만 따르고 싶다면 `dark.css` 대신 `dark-auto.css`를 쓰고
`@custom-variant` 줄은 생략한다.

컴포넌트에서는 `bg-tl-surface`, `text-tl-fg-muted`, `border-tl-border`,
`rounded-tl-md`, `shadow-tl-sm`, `font-tl-sans` 같은 유틸리티를 쓴다.

## Tailwind 없는 프로젝트 (gotolib / SolidJS)

`theme.css`는 임포트하지 않는다(Tailwind가 없으면 `@theme` 블록이 조용히 무시된다 —
`docs/decisions.md` 참고). 진입 CSS 맨 위에서 원시 변수만 가져온다.

```css
/* src/index.css 최상단 */
@import "@tyange-labs/design-system/tokens.css";
@import "@tyange-labs/design-system/dark-auto.css"; /* OS 다크 설정을 따름 */
```

이후 컴포넌트 CSS(`App.css`)에서 `var(--tl-accent)`, `var(--tl-border)`처럼 그대로
쓴다. gotolib은 이미 `--muted`/`--border`/`--accent`/`--accent-soft`라는 자체
변수 4개를 쓰고 있으므로, 한 번에 다 바꾸는 대신 **별칭으로 이어붙여** 점진적으로
옮길 수 있다:

```css
:root {
  --muted: var(--tl-fg-muted);
  --border: var(--tl-border);
  --accent: var(--tl-accent);
  --accent-soft: var(--tl-accent-soft);
}
```

이렇게 하면 기존 클래스(`.badge--warn` 등)는 그대로 두고 색만 DS 값으로 바뀐다.
이후 여유될 때 컴포넌트별로 `var(--muted)` → `var(--tl-fg-muted)`로 직접 치환하며
별칭을 지워나간다.

## daisyUI / Nuxt UI를 쓰는 프로젝트 (tyange-blog, tyange-cms)

이번 1차 범위에는 포함하지 않는다. 나중에 적용할 때는 `tokens.css` + `theme.css`만
얹고(`tl-` 네임스페이스라 daisyUI/Nuxt UI 자체 변수와 충돌하지 않는다), 브랜드
색을 실제로 반영하려면 **각 앱이 소유하는 브리지**를 앱 쪽 CSS에 따로 작성한다.
DS 저장소에는 이 브리지를 두지 않는다 — daisyUI/Nuxt UI 버전에 DS가 종속되지
않게 하기 위해서다.

```css
/* tyange-blog 예시 — daisyUI 커스텀 테마 */
@plugin "daisyui/theme" {
  name: "tyange";
  --color-primary: var(--tl-accent);
  --color-base-100: var(--tl-surface);
}
```

## 폰트

DS는 폰트 파일을 갖지 않고 `--tl-font-sans` 변수(Pretendard Variable → 시스템
폴백)만 정의한다. 실제 로딩은 앱마다:

- **self-host** (tyange-dev, tyange-blog가 이미 쓰는 방식): `next/font/local` 또는
  `@font-face`로 서브셋 woff2를 직접 서빙.
- **CDN** (빠르게 붙일 때): `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">`

둘 다 로딩만 하면 `--tl-font-sans`가 자동으로 "Pretendard Variable"을 가리킨다.
