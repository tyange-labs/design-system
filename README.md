# @tyange-labs/design-system

tyange-labs 프로젝트들이 공유하는 디자인 토큰. 미니멀 뉴트럴 톤, 라이트/다크 겸용,
React·Vue·Solid·Tailwind 유무와 무관하게 순수 CSS 커스텀 프로퍼티로 배포한다.

**1차(현재): 토큰 레이어만.** Base UI(React)/Reka UI(Vue)/Kobalte(Solid) 기반
컴포넌트 패키지는 다음 단계 — 배경과 근거는 `docs/decisions.md` 참고.

## 설치

```bash
bun add "git+ssh://git@git.tyange.com/tyange-labs/design-system.git"
```

## 빠른 시작

Tailwind v4 프로젝트:

```css
@import "tailwindcss";
@import "@tyange-labs/design-system/tokens.css";
@import "@tyange-labs/design-system/dark.css";
@import "@tyange-labs/design-system/theme.css";
```

Tailwind 없는 프로젝트(gotolib 등):

```css
@import "@tyange-labs/design-system/tokens.css";
@import "@tyange-labs/design-system/dark-auto.css";
```

스택별 자세한 적용법은 `docs/adoption.md`, 토큰 이름과 용도는 `docs/tokens.md`,
설계 근거는 `docs/decisions.md`를 참고한다.

## 미리보기

```bash
bun run preview   # preview/index.html을 로컬 서버로 띄움
```

전체 색상/타이포/간격/라디우스/그림자 토큰과 라이트·다크 토글을 한 화면에서 확인한다.
색을 바꿀 때 이 페이지가 1차 판정 지점이다.

## 검증

```bash
bun run contrast
```

시맨틱 fg/bg 조합의 WCAG 대비를 라이트·다크 양쪽에서 검사한다. 색을 바꾸면
반드시 통과시키고 나서 `css/tokens.css`·`css/dark.css`·`css/dark-auto.css`에도
같은 값을 반영한다(지금은 `scripts/contrast.ts`가 진실원천, CSS는 수동 동기화).

## 저장소 구조

```
css/       배포되는 CSS (tokens/dark/dark-auto/theme/base/index)
docs/      토큰 계약, 스택별 적용 가이드, 설계 결정
preview/   전 토큰 렌더링 페이지 (오라클)
scripts/   contrast.ts (WCAG 대비 게이트)
```
