# 설계 결정

## 왜 `--tl-` 접두사, 그리고 Tailwind 브리지도 `tl-` 네임스페이스인가

원시/시맨틱 CSS 변수(`--tl-bg`, `--tl-accent` …)뿐 아니라, `css/theme.css`가 Tailwind에
노출하는 유틸리티 이름(`--color-tl-*`, `--font-tl-*`, `--radius-tl-*` …)도 전부 `tl-`
접두사를 쓴다. 처음엔 `--color-accent`, `--color-success`처럼 접두사 없는 이름으로
`@theme inline`을 짰는데, daisyUI 5(tyange-blog가 사용 중)가 **자신의 테마 슬롯으로
이미 그 이름들을 쓴다** — `--color-primary`, `--color-accent`, `--color-neutral`,
`--color-success`, `--color-warning`, `--color-error`, `--color-base-100/200/300`,
`--color-base-content`. 이 상태에서 `theme.css`를 daisyUI 적용 앱에 얹으면 값이
서로 덮어써진다. Nuxt UI(tyange-cms)는 `--ui-*`를 쓰므로 직접 충돌은 없지만, 앞으로
어떤 라이브러리를 더 얹을지 모르니 원칙을 하나로 통일했다 — **DS가 노출하는 모든
이름은 예외 없이 네임스페이스를 가진다.**

결과 유틸리티는 `bg-tl-accent`, `text-tl-fg-muted`, `rounded-tl-md`처럼 약간 길어지지만,
어떤 UI 라이브러리를 앱에 얹어도 절대 충돌하지 않는다는 보장과 바꾼 것이다.

## 왜 DS 안에서 Tailwind 유틸리티 클래스를 쓰지 않는가

1. gotolib(SolidJS)에는 Tailwind가 아예 없다 — 유틸리티 클래스를 써봐야 스타일이
   적용되지 않는다.
2. Tailwind v4는 기본적으로 `node_modules`를 스캔하지 않는다(공식 문서: gitignore
   대상·node_modules·바이너리·CSS 파일·락파일 제외). git 의존성으로 설치된 DS 안의
   유틸리티 클래스는 소비자가 `@source "../node_modules/@tyange-labs/design-system"`을
   직접 추가하지 않는 한 생성되지 않는다. 6개 앱 전부에 그 설정을 요구하는 대신,
   애초에 순수 CSS로 배포해 이 문제를 없앤다.

## 왜 `@theme` 블록을 `theme.css` 한 파일에만 격리하는가

`@theme`는 Tailwind가 처리하는 at-rule이다. Tailwind가 없는 파이프라인(PostCSS 없이
그냥 CSS로 로드하는 경우)에서는 파싱 에러 없이 **조용히 무시**된다 — 즉 gotolib에서
`theme.css`를 실수로 임포트해도 에러는 안 나지만 아무 효과도 없다. 에러 없이 조용히
안 먹는 것은 에러가 나는 것보다 나쁘다(왜 안 먹는지 디버깅하기 어렵다). 그래서
`@theme`가 들어간 파일은 `theme.css` 하나로 격리하고, "Tailwind 없는 앱은 이 파일을
임포트하지 않는다"를 문서(`docs/adoption.md`)에 명시한다. `tokens.css`/`dark.css`/
`dark-auto.css`/`base.css`는 순수 CSS만 담아 어떤 파이프라인에서도 안전하게 동작한다.

## 왜 `package.json`의 CSS 서브패스가 전부 평범한 문자열인가

```json
"./tokens.css": "./css/tokens.css"
```

`{ "import": "./css/tokens.css" }`처럼 조건부 객체로 쓰지 않는다. Tailwind가 CSS
`@import`를 resolve할 때 쓰는 리졸버는 `style` 조건만 인식하고 `import`/`default`
조건은 보지 않는다. `exports` 필드가 존재하는 순간 목록에 없는 서브패스는 강제
차단되므로, 조건부 객체로 썼다가 `style` 조건을 빠뜨리면 **모든 Tailwind 소비자에서
CSS import가 깨진다.** 평범한 문자열이면 조건과 무관하게 항상 resolve된다.

## 왜 폰트 파일을 DS가 갖지 않는가

tyange-dev·tyange-blog가 이미 각자 Pretendard subset을 self-host하고 있다. 폰트
파일을 상대 경로 `url()`로 CSS에 박아 배포하면 Vite/Next/Nuxt마다 rebase 방식이
달라 깨지기 쉽다. 대신 `--tl-font-sans` 변수(Pretendard Variable → 시스템 폴백)만
제공하고, 실제 폰트 로딩(self-host 또는 CDN)은 각 앱의 기존 방식을 그대로 쓰게
`docs/adoption.md`에서 안내한다.

## 다음 단계(컴포넌트 패키지)를 위해 미리 적어두는 것

이번 1차는 토큰 레이어만 다루지만, 나중에 Base UI(React) / Reka UI(Vue) /
Kobalte(Solid) 기반 컴포넌트를 이 저장소에 추가할 때 반드시 다시 검토해야 할
사항들이다(설계 조사에서 확인됨, 아직 미착수):

- **git 의존성은 서브디렉토리를 지정할 수 없다** (Bun 포함) — 저장소 자체가 곧
  배포되는 패키지여야 한다. 지금의 "저장소 루트 = 패키지" 구조를 유지할 것.
- **`bun install`은 git 의존성의 `prepare` 스크립트를 신뢰성 있게 빌드해주지
  않는다**(devDependencies가 먼저 설치되지 않는 버그가 열려 있음). 컴포넌트에
  빌드가 필요해지면 **`dist/`를 커밋**하고 CI에 `git diff --exit-code -- dist/`
  같은 신선도 게이트를 두는 방식을 검토할 것 — 설치 시점 빌드에 의존하지 말 것.
- **Solid 컴포넌트는 컴파일된 DOM 산출물이 아니라 JSX를 보존한 채 `solid` export
  조건으로 배포**해야 한다(Kobalte가 이 방식). 그래야 소비자의 `vite-plugin-solid`가
  자기 환경에 맞게 컴파일한다.
- **React 컴포넌트가 `"use client"`를 쓴다면 번들러가 지시어를 지워버리지 않는지
  확인**할 것(Next 16 `output: "export"`를 쓰는 tyange-dev가 소비자이므로).
- **peerDependencies는 전부 optional로 선언**해 React 전용 소비자가 Vue/Solid를
  같이 설치하지 않게 할 것.
