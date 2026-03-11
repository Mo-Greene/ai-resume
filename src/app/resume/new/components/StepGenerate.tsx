"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NewResumeData } from "../page"

interface Props {
  data: NewResumeData
}

const buildGeneratePrompt = (data: NewResumeData) =>
  `당신은 이력서 작성 전문가입니다.
아래 정보를 바탕으로 전문적이고 간결한 이력서를 Markdown 형식으로 작성해주세요.
JSON이나 다른 형식 없이 순수 Markdown만 출력하세요. 코드 블록(\`\`\`)도 사용하지 마세요.

[핵심 작성 원칙]
- 모든 성과는 수치(%, 금액, 횟수, 기간 등)를 포함해 구체적으로 작성하세요.
- 문장은 "주도했다", "구축했다", "개선했다", "달성했다" 등 강한 능동 동사로 시작하세요.
- 담당 업무 나열이 아닌 결과와 임팩트 중심으로 서술하세요.

[기본 정보]
이름: ${data.name}
이메일: ${data.email || "미입력"}
연락처: ${data.phone || "미입력"}
희망 직종: ${data.targetJob}
연차: ${data.experienceLevel}

[경력 사항]
${data.experienceSummary || "없음"}

[프로젝트]
${data.projectSummary || "없음"}

[스킬]
${data.skills || "없음"}

[학력]
${data.education || "없음"}

[자격증 & 기타]
${data.certifications || "없음"}

출력 형식:
# 이름

## 연락처
- 이메일:
- 전화:

## 요약
(2-3문장 전문 요약, 직종과 연차 기반으로 작성)

## 경력
### 회사명 | 직책 (YYYY.MM - YYYY.MM)
- 주요 업무 및 성과

## 프로젝트
### 프로젝트명
- 기술 스택, 역할, 성과

## 스킬
- 기술1, 기술2, ...

## 학력
### 학교명 (YYYY 졸업)
- 전공

## 자격증
- 자격증명 (YYYY)

없는 섹션은 생략하세요.`

export default function StepGenerate({ data }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<"generating" | "done" | "error">("generating")
  const [statusText, setStatusText] = useState("이력서를 생성하고 있습니다...")

  useEffect(() => {
    generate()
  }, [])

  const generate = async () => {
    setStatus("generating")
    setStatusText("수집된 정보를 분석하는 중...")

    try {
      await new Promise(r => setTimeout(r, 800))
      setStatusText("이력서 초안을 작성하는 중...")

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gpt",
          systemPrompt: buildGeneratePrompt(data),
          messages: [{ role: "user", content: "위 정보를 바탕으로 이력서를 Markdown 형식으로 작성해주세요." }],
        }),
      })

      if (!res.ok) throw new Error()
      const { content } = await res.json()

      setStatusText("저장하는 중...")
      await new Promise(r => setTimeout(r, 400))

      const resumeId = `resume_${Date.now()}`
      localStorage.setItem(resumeId, JSON.stringify({
        id: resumeId,
        source: "new",
        fileName: `${data.name} — ${data.targetJob}`,
        rawText: "",
        markdown: content.trim(),
        createdAt: new Date().toISOString(),
      }))
      localStorage.setItem("lastResumeId", resumeId)

      setStatus("done")
      setStatusText("완료! 편집 페이지로 이동합니다.")

      await new Promise(r => setTimeout(r, 800))
      router.push(`/resume/${resumeId}/edit`)
    } catch {
      setStatus("error")
      setStatusText("오류가 발생했습니다.")
    }
  }

  const PROCESS_STEPS = [
    { label: "정보 분석", desc: "수집된 정보 구조화" },
    { label: "초안 작성", desc: "AI 이력서 생성" },
    { label: "편집 이동", desc: "에디터로 이동" },
  ]

  const currentProcessStep =
    statusText.includes("분석") ? 0 :
    statusText.includes("작성") ? 1 : 2

  return (
    <div className="flex flex-col md:flex-row">
      {/* 왼쪽: 정보 요약 */}
      <div className="md:w-[40%] border-b md:border-b-0 md:border-r border-foreground px-6 md:px-10 py-10 md:py-14 flex flex-col justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">Step 05 — 이력서 생성</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-[1.05] tracking-tight mb-8">
            {status === "error" ? "오류 발생" : "생성 중"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
            지금까지 수집한 정보를 바탕으로 AI가 이력서를 작성합니다.
            완료 후 편집 페이지에서 자유롭게 수정할 수 있습니다.
          </p>

          {/* 수집 정보 요약 */}
          <div className="space-y-2">
            {[
              { label: "이름", value: data.name },
              { label: "직종", value: data.targetJob },
              { label: "연차", value: data.experienceLevel },
              { label: "경력", value: data.experienceSummary ? "수집됨" : "없음" },
              { label: "프로젝트", value: data.projectSummary ? "수집됨" : "없음" },
              { label: "스킬", value: data.skills || "없음" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground w-16 shrink-0">{item.label}</span>
                <span className="font-mono text-muted-foreground truncate">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {status === "error" && (
          <button
            onClick={generate}
            className="w-full flex items-center justify-between bg-foreground text-background px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-foreground/80 transition-colors"
          >
            다시 시도
            <span>→</span>
          </button>
        )}
      </div>

      {/* 오른쪽: 진행 상태 */}
      <div className="flex-1 px-6 md:px-10 py-10 md:py-14 flex flex-col justify-center gap-10">
        {/* 스캔 바 */}
        {status === "generating" && (
          <div className="space-y-3">
            <style>{`
              @keyframes scan-x {
                0%   { left: -35%; }
                100% { left: 110%; }
              }
            `}</style>
            <div className="h-px bg-muted w-full relative overflow-hidden">
              <div
                className="absolute inset-y-0 bg-foreground"
                style={{ width: "35%", animation: "scan-x 1.6s ease-in-out infinite" }}
              />
            </div>
            <p className="text-xs font-mono text-muted-foreground">{statusText}</p>
          </div>
        )}

        {/* 단계 표시 */}
        <div className="space-y-8">
          {PROCESS_STEPS.map((step, i) => {
            const isDone = status === "done" || i < currentProcessStep
            const isActive = status === "generating" && i === currentProcessStep
            const isPending = !isDone && !isActive

            return (
              <div
                key={step.label}
                className="flex items-center gap-5 transition-opacity"
                style={{ opacity: isPending ? 0.2 : 1 }}
              >
                <div className={`w-9 h-9 border-2 flex items-center justify-center text-xs font-mono shrink-0 transition-all ${
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : isDone
                    ? "border-muted-foreground text-muted-foreground"
                    : "border-border text-border"
                }`}>
                  {isDone ? "✓" : i + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${isActive ? "text-foreground" : isDone ? "text-muted-foreground" : "text-border"}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{step.desc}</p>
                  )}
                </div>
                {isActive && (
                  <div className="relative w-5 h-5 shrink-0">
                    <div className="absolute inset-0 border border-border rounded-full" />
                    <div className="absolute inset-0 border border-foreground border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {status === "done" && (
          <p className="text-xs font-mono text-muted-foreground">{statusText}</p>
        )}
      </div>
    </div>
  )
}
