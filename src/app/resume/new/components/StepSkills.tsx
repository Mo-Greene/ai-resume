"use client"

import { useState } from "react"
import { NewResumeData } from "../page"

interface Props {
  onNext: (partial: Partial<NewResumeData>) => void
}

export default function StepSkills({ onNext }: Props) {
  const [skills, setSkills] = useState("")
  const [education, setEducation] = useState("")
  const [certifications, setCertifications] = useState("")

  const handleNext = () => {
    onNext({ skills, education, certifications })
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* 왼쪽: 설명 */}
      <div className="md:w-[40%] border-b md:border-b-0 md:border-r border-black px-6 md:px-10 py-10 md:py-14 flex flex-col justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-8">Step 04 — 스킬 & 기타</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-[1.05] tracking-tight mb-8">
            스킬을<br />입력하세요
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
            기술 스택, 학력, 자격증 정보를 입력해주세요.
            모두 선택 사항이며 없는 항목은 비워두셔도 됩니다.
          </p>
        </div>
        <div className="space-y-3 text-xs text-neutral-400">
          {["모든 항목 선택 사항", "쉼표로 구분하거나 자유롭게 작성", "AI가 이력서 형식으로 정리해드립니다"].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-mono">—</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: 폼 */}
      <div className="flex-1 px-6 md:px-10 py-10 md:py-14 flex flex-col justify-center gap-6">
        {/* 기술 스택 */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            기술 스택 / 스킬
          </label>
          <textarea
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="예: React, TypeScript, Node.js, Python, Figma, Git..."
            rows={3}
            className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-neutral-300 resize-none leading-relaxed"
          />
        </div>

        {/* 학력 */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            학력
          </label>
          <textarea
            value={education}
            onChange={e => setEducation(e.target.value)}
            placeholder="예: OO대학교 컴퓨터공학과 졸업 (2020), OO고등학교 졸업 (2016)..."
            rows={2}
            className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-neutral-300 resize-none leading-relaxed"
          />
        </div>

        {/* 자격증 */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
            자격증 / 수상 / 기타
          </label>
          <textarea
            value={certifications}
            onChange={e => setCertifications(e.target.value)}
            placeholder="예: 정보처리기사 (2022), TOEIC 850 (2023), OO 해커톤 최우수상..."
            rows={2}
            className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-neutral-300 resize-none leading-relaxed"
          />
        </div>

        <button
          onClick={handleNext}
          className="w-full flex items-center justify-between bg-black text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors mt-2"
        >
          이력서 생성하기
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
