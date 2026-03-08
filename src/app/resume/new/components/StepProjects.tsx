"use client"

import { NewResumeData } from "../page"
import InterviewStep from "./InterviewStep"

interface Props {
  data: NewResumeData
  onNext: (partial: Partial<NewResumeData>) => void
}

const buildSystemPrompt = (data: NewResumeData) =>
  `당신은 이력서 작성 전문가입니다.
지원자 정보: 이름 ${data.name}, 목표 직종: ${data.targetJob}, 연차: ${data.experienceLevel}

주요 프로젝트를 파악하기 위한 인터뷰를 진행하세요.
- 한 번에 하나의 질문만 하세요 (2-3문장 이내로 간결하게)
- 파악해야 할 정보: 프로젝트명, 기술 스택, 본인의 역할, 성과/결과
- 개인 프로젝트, 팀 프로젝트, 사이드 프로젝트 모두 포함
- 신입이면 학교 과제, 해커톤, 개인 공부 프로젝트도 포함
- 충분한 정보가 수집되면 "다음 단계 버튼을 눌러주세요"라고 안내하세요
- 절대 JSON 형식으로 응답하지 마세요, 자연스러운 대화체로만 응답하세요`

const SUMMARY_PROMPT =
  `지금까지의 대화를 바탕으로 지원자의 주요 프로젝트를 이력서에 바로 사용할 수 있는 Markdown 형식으로 정리해주세요.
아래 형식으로 작성하세요 (없는 항목은 생략):

### 프로젝트명
- 기술 스택: ...
- 역할: ...
- 성과: ...

JSON 없이 순수 Markdown만 출력하세요.`

export default function StepProjects({ data, onNext }: Props) {
  return (
    <InterviewStep
      stepLabel="Step 03 — 프로젝트"
      title={"프로젝트를\n소개해주세요"}
      description="개인 프로젝트, 팀 프로젝트, 사이드 프로젝트 무엇이든 좋습니다. AI가 핵심 내용을 뽑아 이력서에 담아드립니다."
      contextBadges={[
        { label: "직종", value: data.targetJob },
      ]}
      firstMessage={`좋습니다! 이번엔 프로젝트 경험을 알려주세요. ${data.name}님이 가장 자신 있거나 인상 깊었던 프로젝트가 있으신가요? 개인 프로젝트나 사이드 프로젝트도 좋습니다.`}
      systemPrompt={buildSystemPrompt(data)}
      summaryPrompt={SUMMARY_PROMPT}
      onNext={(summary) => onNext({ projectSummary: summary })}
    />
  )
}
