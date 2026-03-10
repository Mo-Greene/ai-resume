# PLAN

이 파일은 에이전트 간 작업 충돌 방지와 작업 백로그 관리를 위한 공용 보드다.

## 규칙
- 작업 시작 전에 이 파일을 먼저 확인한다.
- 새 작업을 시작하면 진행 중 작업에 자신의 항목을 추가한다.
- 각 항목에는 최소한 `Agent`, `Task`, `Files`를 적는다.
- 작업을 완료하면 자신의 항목을 즉시 삭제한다.
- 완료 이력은 이 파일에 남기지 않는다.

## 진행 중 작업

없음.

## 완료된 기능 (요약)
랜딩, PDF 업로드/파싱, Markdown 편집+AI 채팅, PDF export, `/resume/new` 5단계 인터뷰, 모바일 반응형, API 검증, 기본 보안 보완

## 개선 필요 사항

### 보안
- [ ] Rate Limiting - `/api/chat`, `/api/parse-pdf` 미적용
- [ ] 인증(Auth) - 로그인 없이 전체 서비스 접근 가능

### 기능
- [ ] 이력서 목록 페이지 (`/resume`)
- [ ] Cloudinary 이미지 업로드
- [ ] Step 2, 3 뒤로가기 시 대화 내용 유지
- [ ] PDF 페이지 나눔 제어

### UX / 코드
- [ ] 에러 바운더리
- [ ] 이력서 제목 편집
- [ ] DB 연동

## 다음 작업 우선순위
1. 이력서 목록 페이지 (`/resume`)
2. Rate Limiting
3. Cloudinary 이미지 업로드
4. DB 연동 (Supabase + Prisma)

## 항목 형식

```md
- Agent: Codex
  Task: `/resume` 목록 페이지 레이아웃 구현
  Files: `src/app/resume/page.tsx`, `src/components/resume-list.tsx`
```
