"use client"

import { useState } from "react"
import StepBasicInfo from "./components/StepBasicInfo"
import StepExperience from "./components/StepExperience"
import StepProjects from "./components/StepProjects"
import StepSkills from "./components/StepSkills"
import StepGenerate from "./components/StepGenerate"
import { AppHeader } from "@/components/AppHeader"

export interface NewResumeData {
  // Step 1
  name: string
  email: string
  phone: string
  targetJob: string
  experienceLevel: "신입" | "1-3년" | "3-5년" | "5년+"
  // Step 2
  experienceSummary: string
  // Step 3
  projectSummary: string
  // Step 4
  skills: string
  education: string
  certifications: string
}

const STEPS = [
  { label: "기본 정보" },
  { label: "경력 사항" },
  { label: "프로젝트" },
  { label: "스킬 & 기타" },
  { label: "이력서 생성" },
]

export default function NewResumePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<NewResumeData>({
    name: "",
    email: "",
    phone: "",
    targetJob: "",
    experienceLevel: "신입",
    experienceSummary: "",
    projectSummary: "",
    skills: "",
    education: "",
    certifications: "",
  })

  const next = (partial?: Partial<NewResumeData>) => {
    if (partial) setData(prev => ({ ...prev, ...partial }))
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <AppHeader label="AI 인터뷰" className="sticky top-0 z-50 px-10" />

      {/* Progress Bar */}
      <div className="border-b border-foreground">
        <div className="flex">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep
            const isActive = i === currentStep
            return (
              <div
                key={i}
                className={`flex-1 px-2 md:px-4 py-3 flex items-center gap-1.5 md:gap-2 border-r border-foreground last:border-r-0 transition-colors ${
                  isActive ? "bg-foreground text-background" : isDone ? "bg-muted" : ""
                }`}
              >
                <span className={`text-xs font-mono shrink-0 ${isActive ? "text-background" : isDone ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                  {isDone ? "✓" : String(i + 1).padStart(2, "0")}
                </span>
                <span className={`text-xs font-bold tracking-[0.1em] uppercase truncate hidden sm:block ${
                  isActive ? "text-background" : isDone ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <main className="min-h-[calc(100vh-56px-48px)]">
        {currentStep === 0 && <StepBasicInfo onNext={next} />}
        {currentStep === 1 && <StepExperience data={data} onNext={next} />}
        {currentStep === 2 && <StepProjects data={data} onNext={next} />}
        {currentStep === 3 && <StepSkills onNext={next} />}
        {currentStep === 4 && <StepGenerate data={data} />}
      </main>
    </div>
  )
}
