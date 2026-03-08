# AI Resume Builder

## 프로젝트 개요
이력서를 AI와 함께 작업하는 웹 서비스. 사용자가 경험을 입력하면 AI가 질문으로 내용을 보완하고, 임팩트 있는 이력서 문구로 다듬어준다.

## 기술 스택
- **프레임워크**: Next.js (App Router, TypeScript)
- **스타일**: Tailwind CSS
- **AI**: Claude (Anthropic), GPT-4o (OpenAI), Gemini 2.0 Flash (Google)
- **배포 예정**: Vercel

## 서비스 진입점

### A. PDF 이력서가 있는 경우
1. PDF 업로드
2. 텍스트 파싱 (PDF → 구조화된 데이터)
3. AI가 기존 이력서 분석 → 부족한 부분 파악
4. AI가 보완 질문으로 내용 강화
5. 사용자 수정 요청 반영 ("더 임팩트 있게", "간결하게")
6. 최종 출력 파이프라인으로

### B. PDF 이력서가 없는 경우 (처음부터 작성)
단계별 AI 인터뷰 방식으로 데이터 수집:
- Step 1. 기본 정보 (이름, 연락처, 직무 목표)
- Step 2. 경력 사항 (회사, 직무, 기간)
- Step 3. 프로젝트 & 성과 (수치, 기여도)
- Step 4. 학력 / 자격증 / 스킬
- 각 단계마다 AI가 내용 보완 질문 → 문구 다듬기

## 출력 파이프라인 (공통)
```
구조화된 JSON 데이터
        ↓
   Markdown 파일 생성
        ↓
   PDF 파일 export
```
- 중간 단계 Markdown을 저장해두면 언제든 재편집 가능
- PDF는 Markdown 렌더링 기반으로 일관된 디자인 유지

## 폴더 구조
```
src/
├── app/
│   ├── api/chat/        ← AI 채팅 API Route
│   └── resume/          ← 이력서 페이지
├── components/
│   ├── resume/          ← 이력서 관련 컴포넌트
│   └── ui/              ← 공통 UI 컴포넌트
├── lib/
│   └── ai/
│       ├── index.ts     ← 통합 인터페이스 (provider 패턴)
│       ├── claude.ts    ← Anthropic SDK
│       ├── openai.ts    ← OpenAI SDK
│       └── gemini.ts    ← Google Generative AI SDK
└── types/
    └── resume.ts        ← 공통 타입 정의
```

## AI Provider 패턴
모든 AI는 `src/lib/ai/index.ts`의 `chat()` 함수로 통합 호출.
```ts
chat(provider: "claude" | "gpt" | "gemini", messages, systemPrompt)
```

## 환경 변수 (.env.local)
```
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
```

## 페이지 구조
```
/                       ← 랜딩 (PDF 있음 / 없음 선택)
/resume/new             ← 처음부터 작성 (단계별 AI 인터뷰)
/resume/upload          ← PDF 업로드 → 분석
/resume/[id]/edit       ← AI 채팅 사이드바 + 이력서 편집
/resume/[id]/preview    ← Markdown 기반 미리보기
/resume/[id]/export     ← PDF 다운로드
```

## 개발 진행 상황
- [x] Next.js 프로젝트 생성
- [x] AI SDK 3개 설치 (@anthropic-ai/sdk, openai, @google/generative-ai)
- [x] AI Provider 통합 구조 세팅
- [x] 타입 정의 (resume.ts)
- [ ] 서비스 흐름 확정 및 페이지 구조 설계
- [ ] API Route 생성 (`/api/chat`)
- [ ] 랜딩 페이지 (진입점 선택)
- [ ] 단계별 이력서 작성 페이지 (`/resume/new`)
- [ ] PDF 업로드 & 파싱 (`/resume/upload`)
- [ ] AI 채팅 + 이력서 편집 (`/resume/[id]/edit`)
- [ ] Markdown 미리보기 & PDF export

## 다음 작업
1. `.env.local`에 API 키 입력
2. 랜딩 페이지 구현 (진입점 A/B 선택 UI)
3. `/resume/new` 단계별 인터뷰 페이지

## 코딩 컨벤션
- 컴포넌트: PascalCase
- 함수/변수: camelCase
- 타입: `src/types/resume.ts`에 통합 관리
- 서버 컴포넌트 기본, 클라이언트는 필요시 `"use client"`
