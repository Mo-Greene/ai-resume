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

경력 사항을 파악하기 위한 인터뷰를 진행하세요.
- 한 번에 하나의 질문만 하세요 (2-3문장 이내로 간결하게)
- 파악해야 할 정보: 회사명, 직책, 근무 기간, 주요 업무, 성과
- 성과를 물을 때는 반드시 수치(%, 금액, 횟수, 기간 단축 등)를 함께 묻어 구체화하세요.
- 신입이면 인턴십, 아르바이트, 동아리, 교내 활동도 포함
- 경력이 없으면 자연스럽게 프로젝트 단계로 넘어가도 됨
- 충분한 정보가 수집되면 "다음 단계 버튼을 눌러주세요"라고 안내하세요
- 절대 JSON 형식으로 응답하지 마세요, 자연스러운 대화체로만 응답하세요`

const SUMMARY_PROMPT =
  `지금까지의 대화를 바탕으로 지원자의 경력 사항을 이력서에 바로 사용할 수 있는 Markdown 형식으로 정리해주세요.
아래 형식으로 작성하세요 (없는 항목은 생략):

### 회사명 | 직책 (YYYY.MM - YYYY.MM)
- 주요 업무 및 성과

작성 원칙:
- 모든 성과는 수치(%, 금액, 횟수, 기간 등)를 포함해 구체적으로 작성하세요.
- 문장은 "주도했다", "구축했다", "개선했다", "달성했다" 등 능동 동사로 시작하세요.
- 업무 나열이 아닌 결과와 임팩트 중심으로 서술하세요.
JSON 없이 순수 Markdown만 출력하세요.`

export default function StepExperience({ data, onNext }: Props) {
  const firstMessage = data.experienceLevel === "신입"
    ? `안녕하세요, ${data.name}님! ${data.targetJob} 포지션을 목표로 하고 계시는군요. 신입이시니 인턴십, 아르바이트, 동아리 활동 등도 포함해서 경험을 이야기해주세요. 혹시 관련 경험이 있으신가요?`
    : `안녕하세요, ${data.name}님! ${data.targetJob} ${data.experienceLevel} 경력을 가지고 계시는군요. 가장 최근에 다니셨던 회사를 먼저 알려주세요.`

  return (
    <InterviewStep
      stepLabel="Step 02 — 경력 사항"
      title={"경력을\n알려주세요"}
      description="AI가 질문을 통해 경력 정보를 수집합니다. 충분히 답변 후 다음 단계로 넘어가세요."
      contextBadges={[
        { label: "직종", value: data.targetJob },
        { label: "연차", value: data.experienceLevel },
      ]}
      firstMessage={firstMessage}
      systemPrompt={buildSystemPrompt(data)}
      summaryPrompt={SUMMARY_PROMPT}
      onNext={(summary) => onNext({ experienceSummary: summary })}
    />
  )
}
