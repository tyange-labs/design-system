# 토큰 계약

원시 스케일(`--tl-n-*`, `--tl-a-*`)은 CSS 파일 안에서만 쓴다. 앱 컴포넌트에서는
아래 **시맨틱** 변수만 참조한다 — 이름이 그대로 계약이라, 값이 바뀌어도 컴포넌트는
수정할 필요가 없다.

## 배경/표면

| 변수 | 용도 |
|---|---|
| `--tl-bg` | 페이지 바탕 |
| `--tl-surface` | 카드·패널처럼 bg 위에 떠 있는 표면 |
| `--tl-surface-sunken` | surface보다 한 단 낮은 표면(입력창, 코드 블록 배경 등) |
| `--tl-overlay` | 모달/드롭다운처럼 다른 콘텐츠 위를 덮는 표면 |

## 전경

| 변수 | 용도 |
|---|---|
| `--tl-fg` | 본문 텍스트 |
| `--tl-fg-muted` | 보조 텍스트(캡션, 타임스탬프) |
| `--tl-fg-subtle` | 더 옅은 보조 텍스트. 본문 대비 기준(4.5:1)은 보장하지 않으므로 3.0:1이면 되는 큰 텍스트/라벨에만 쓴다 |
| `--tl-fg-on-accent` | `--tl-accent` 배경 위의 텍스트 |

## 경계

| 변수 | 용도 |
|---|---|
| `--tl-border` | 카드·구분선처럼 장식적인 경계 |
| `--tl-border-strong` | 입력창 외곽선처럼 의미 있는 UI 경계 (3:1 대비 보장) |
| `--tl-ring` | 포커스 링 |

## 액센트 / 상태

`--tl-accent` / `-hover` / `-soft`, `--tl-danger` / `-fg` / `-soft`, `--tl-warning` / …,
`--tl-success` / … — 각 상태는 텍스트 컬러(`--tl-{state}`), 그 위에 놓는 텍스트
(`--tl-{state}-fg`), 옅은 배경(`--tl-{state}-soft`) 세 벌로 구성된다.

## 타이포그래피

`--tl-font-sans` / `--tl-font-mono`, `--tl-text-{xs..4xl}` + 대응 `-lh`(line-height),
한글 제목에 쓰는 `--tl-tracking-tight`.

## 간격 / 라디우스 / 그림자 / 모션 / z-index

`--tl-space-{1..16}`(4px 배수), `--tl-radius-{sm..full}`, `--tl-shadow-{sm,md,lg}`,
`--tl-duration-{fast,base,slow}` + `--tl-ease-{out,in-out}`,
`--tl-z-{dropdown,sticky,overlay,modal,popover,toast}`.

## 대비 보증

`scripts/contrast.ts`가 색을 바꿀 때마다 실행하는 게이트다. 본문류(4.5:1)와
UI/큰 텍스트류(3:1)를 라이트·다크 양쪽에서 검사한다. 새 시맨틱 조합을 추가하면
`pairs()` 목록에도 추가한다 — 검사되지 않는 조합은 보증되지 않는 조합이다.
