"use client"

import { useState } from "react"
import { NewResumeData } from "../page"

interface Props {
  onNext: (data: Partial<NewResumeData>) => void
}

const EXPERIENCE_LEVELS: NewResumeData["experienceLevel"][] = ["신입", "1-3년", "3-5년", "5년+"]

export default function StepBasicInfo({ onNext }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [targetJob, setTargetJob] = useState("")
  const [experienceLevel, setExperienceLevel] = useState<NewResumeData["experienceLevel"]>("신입")
  const [error, setError] = useState("")

  const handleNext = () => {
    if (!name.trim() || !targetJob.trim()) {
      setError("이름과 희망 직종은 필수입니다.")
      return
    }
    setError("")
    onNext({ name, email, phone, targetJob, experienceLevel })
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* 왼쪽: 설명 */}
      <div className="border-b md:border-b-0 md:border-r border-foreground px-6 md:px-10 py-10 md:py-14 flex flex-col justify-between md:w-[40%]">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">Step 01 — 기본 정보</p>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-[1.05] tracking-tight mb-8">
            당신을<br />소개해주세요
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            기본 정보와 목표 직종을 입력하면
            AI가 맞춤형 질문으로 이력서를 완성해드립니다.
          </p>
        </div>
        <div className="space-y-3 text-xs text-muted-foreground">
          {["이름과 희망 직종은 필수", "연락처 정보는 선택 사항", "내용은 외부에 저장되지 않습니다"].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-mono">—</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: 폼 */}
      <div className="flex-1 px-6 md:px-10 py-10 md:py-14 flex flex-col justify-center gap-6">
        {/* 이름 */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            이름 <span className="text-foreground">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="홍길동"
            className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 bg-background text-foreground"
          />
        </div>

        {/* 희망 직종 */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            희망 직종 <span className="text-foreground">*</span>
          </label>
          <input
            type="text"
            value={targetJob}
            onChange={e => setTargetJob(e.target.value)}
            placeholder="예: 프론트엔드 개발자, 마케터, 데이터 분석가..."
            className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 bg-background text-foreground"
          />
        </div>

        {/* 현재 연차 */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
            현재 연차
          </label>
          <div className="flex gap-2 flex-wrap">
            {EXPERIENCE_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setExperienceLevel(level)}
                className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase border transition-colors ${
                  experienceLevel === level
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 bg-background text-foreground"
          />
        </div>

        {/* 연락처 */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            연락처
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/40 bg-background text-foreground"
          />
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <button
          onClick={handleNext}
          className="w-full flex items-center justify-between bg-foreground text-background px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-foreground/80 transition-colors mt-2"
        >
          다음 단계 — 경력 사항
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
