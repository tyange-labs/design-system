# CLAUDE.md

tyange-labs 프로젝트 6개(gotolib · lovelog · palim · tyange-blog · tyange-cms ·
tyange-dev)가 공유하는 디자인 시스템. 1차 범위는 **토큰 레이어**뿐이다. 컴포넌트
패키지(Base UI/Reka UI/Kobalte)는 아직 없다 — 시작하기 전에 `docs/decisions.md`의
"다음 단계를 위해 미리 적어두는 것" 섹션을 반드시 읽는다.

## 스택

- **런타임/패키지 매니저: Bun.**
- 빌드 단계 없음 — `css/`는 배포되는 최종 파일 그대로다. 컴파일러 없이 바로
  git 의존성으로 소비된다.
- 검증: `bun run contrast` (WCAG 대비), `bun run preview` (전 토큰 시각 확인).

## 컨벤션

- **모든 노출 이름(CSS 변수·Tailwind 유틸리티)은 `tl-` 접두사를 갖는다.** 예외 없음.
  이유는 `docs/decisions.md` 참고 — daisyUI/Nuxt UI 같은 소비 앱의 기존 이름과
  충돌하지 않기 위함이다.
- **`@theme` 블록은 `css/theme.css`에만 존재한다.** 다른 CSS 파일에 Tailwind
  전용 at-rule을 섞지 않는다 — Tailwind 없는 소비자(gotolib)가 조용히 깨진다.
- **`package.json`의 CSS 서브패스는 항상 평범한 문자열**로 둔다(`{ "import": … }`
  같은 조건부 객체 금지). Tailwind의 CSS 리졸버가 `style` 조건만 인식하기 때문에,
  조건부로 쓰면 Tailwind 소비자에서 import가 깨진다.
- **색을 바꾸면 세 곳을 함께 고친다**: `scripts/contrast.ts`의 `light`/`dark`
  팔레트 → `css/tokens.css` → `css/dark.css`/`css/dark-auto.css`. 지금은 자동
  동기화가 없으니 수동으로 맞춘다. `bun run contrast`가 통과해야 커밋한다.
- 커밋 메시지: 한국어, Conventional Commits(`feat:`/`fix:`/`docs:`…).
- **코드에 "왜"를 남길 땐 인라인 주석보다 `docs/decisions.md`를 우선한다** —
  다른 tyange-labs 저장소들의 컨벤션과 동일.

## 검증 원칙 (frontend-loop 스킬 계승)

기능을 만들기 전에 무인·객관적 판정기를 먼저 만든다. 이 저장소에서 그 판정기는:

1. `scripts/contrast.ts` — 색 조합이 WCAG 기준을 만족하는지 수치로 판정 (exit 1/0).
2. `preview/index.html` — 사람이 봐야 하는 것(팔레트 느낌, 타입 스케일 리듬)만
   여기서 확인한다. 대비처럼 수치화 가능한 것은 여기 맡기지 않는다.

새 토큰이나 카테고리를 추가하면 두 곳에 모두 반영한다 — 프리뷰에 없는 토큰은
아무도 눈으로 확인하지 않은 토큰이고, contrast에 없는 조합은 보증되지 않은
조합이다.
