"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/AppHeader"

type Step = "upload" | "parsing" | "converting"

const CONVERT_TO_MD_PROMPT = `당신은 이력서 전문가입니다.
주어진 이력서 텍스트를 아래 Markdown 형식으로 변환하세요.
JSON이나 다른 형식 없이 순수 Markdown만 출력하세요. 코드 블록(\`\`\`)도 사용하지 마세요.

출력 형식:
# 이름

## 연락처
- 이메일:
- 전화:
- 링크:

## 요약
(2-3문장 전문 요약)

## 경력
### 회사명 | 직책 (YYYY.MM - YYYY.MM)
- 주요 업무 및 성과

## 프로젝트
### 프로젝트명
- 설명, 기술 스택, 성과

## 학력
### 학교명 (YYYY 졸업)
- 전공

## 스킬
- 기술1, 기술2, ...

## 자격증
- 자격증명 (YYYY)

없는 섹션은 생략하세요.`

const STEPS = [
  { id: "parsing", label: "PDF 읽기", desc: "텍스트 추출 중" },
  { id: "converting", label: "Markdown 변환", desc: "구조화 중" },
  { id: "done", label: "편집 시작", desc: "곧 이동합니다" },
]

export default function UploadPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>("upload")
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [statusText, setStatusText] = useState("")
  const [pageCount, setPageCount] = useState<number | null>(null)

  const validateFile = (f: File) => {
    if (f.type !== "application/pdf") return "PDF 파일만 업로드 가능합니다."
    if (f.size > 10 * 1024 * 1024) return "파일 크기는 10MB 이하여야 합니다."
    return null
  }

  const handleFile = useCallback((f: File) => {
    const err = validateFile(f)
    if (err) { setError(err); return }
    setError(null)
    setFile(f)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const startAnalysis = async () => {
    if (!file) return
    setError(null)
    setStep("parsing")
    setStatusText("PDF 읽는 중...")

    try {
      const formData = new FormData()
      formData.append("file", file)
      const parseRes = await fetch("/api/parse-pdf", { method: "POST", body: formData })
      if (!parseRes.ok) {
        const { error } = await parseRes.json()
        throw new Error(error)
      }
      const { text, pageCount: pc } = await parseRes.json()
      setPageCount(pc)
      setStatusText(`${pc}페이지 완료 — Markdown 변환 중...`)
      setStep("converting")

      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gpt",
          systemPrompt: CONVERT_TO_MD_PROMPT,
          messages: [{ role: "user", content: `다음 이력서 텍스트를 Markdown으로 변환해주세요:\n\n${text.slice(0, 8000)}` }],
        }),
      })
      if (!chatRes.ok) throw new Error("Markdown 변환에 실패했습니다.")
      const { content } = await chatRes.json()

      const resumeId = `resume_${Date.now()}`
      localStorage.setItem(resumeId, JSON.stringify({
        id: resumeId,
        source: "upload",
        fileName: file.name,
        rawText: text,
        markdown: content.trim(),
        createdAt: new Date().toISOString(),
      }))
      localStorage.setItem("lastResumeId", resumeId)
      router.push(`/resume/${resumeId}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.")
      setStep("upload")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <style>{`
        @keyframes scan-x {
          0%   { left: -35%; }
          100% { left: 110%; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <AppHeader label="PDF 업로드" />

      <main className="min-h-[calc(100vh-56px)] flex">

        {/* ── Step 1: Upload ── */}
        {step === "upload" && (
          <div className="flex-1 grid md:grid-cols-2">
            <div className="border-b md:border-b-0 md:border-r border-foreground px-6 md:px-10 py-10 md:py-14 flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">Flow A — PDF 보강</p>
                <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase leading-[1.05] tracking-tight mb-8">
                  이력서<br />업로드
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  기존 PDF 이력서를 업로드하면 AI가 Markdown 형식으로 변환합니다.
                  이후 직접 수정하거나 AI에게 다듬기를 요청할 수 있습니다.
                </p>
              </div>
              <div className="space-y-3 text-xs text-muted-foreground">
                {["PDF 파일만 가능", "최대 10MB", "내용은 외부에 저장되지 않습니다"].map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-mono">—</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 md:px-10 py-10 md:py-14 flex flex-col justify-center gap-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`
                  border-2 border-dashed cursor-pointer flex flex-col items-center justify-center
                  py-20 px-8 text-center transition-colors
                  ${isDragging ? "border-foreground bg-muted/30" : "border-border hover:border-foreground"}
                  ${file ? "border-foreground" : ""}
                `}
              >
                <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={onInputChange} />
                {file ? (
                  <>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">선택된 파일</p>
                    <p className="text-lg font-bold">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                      {isDragging ? "여기에 놓으세요" : "드래그 또는 클릭"}
                    </p>
                    <p className="text-sm text-muted-foreground">PDF 파일을 선택하세요</p>
                  </>
                )}
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <button
                onClick={startAnalysis}
                disabled={!file}
                className="w-full flex items-center justify-between bg-foreground text-background px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-foreground/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                변환 시작하기
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2/3: 처리 중 ── */}
        {(step === "parsing" || step === "converting") && (
          <div className="flex-1 grid md:grid-cols-2">

            {/* 왼쪽: 파일 정보 */}
            <div className="border-b md:border-b-0 md:border-r border-foreground px-6 md:px-10 py-10 md:py-14 flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">
                  {step === "parsing" ? "분석 중" : "변환 중"}
                </p>
                <h2
                  className="font-black tracking-tight leading-tight break-all mb-6"
                  style={{
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    animation: "fade-up 0.5s ease both",
                  }}
                >
                  {file?.name}
                </h2>
                <div className="space-y-1 font-mono text-xs text-muted-foreground">
                  <p>{file && (file.size / 1024 / 1024).toFixed(2)} MB</p>
                  {pageCount && (
                    <p style={{ animation: "fade-up 0.4s ease both" }}>
                      {pageCount} pages · {pageCount > 1 ? "다중 페이지" : "단일 페이지"}
                    </p>
                  )}
                </div>
              </div>

              {/* 스캔 바 */}
              <div className="space-y-3">
                <div className="h-px bg-muted w-full relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 bg-foreground"
                    style={{ width: "35%", animation: "scan-x 1.6s ease-in-out infinite" }}
                  />
                </div>
                <p className="text-xs font-mono text-muted-foreground">{statusText}</p>
              </div>
            </div>

            {/* 오른쪽: 단계 진행 */}
            <div className="px-6 md:px-10 py-10 md:py-14 flex flex-col justify-center gap-8">
              {STEPS.map((s, i) => {
                const isActive = step === s.id
                const isDone = (step === "converting" && s.id === "parsing")
                const isPending = !isActive && !isDone

                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-5 transition-opacity"
                    style={{
                      opacity: isPending ? 0.2 : 1,
                      animation: isActive ? `fade-up 0.4s ease ${i * 0.1}s both` : undefined,
                    }}
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

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${isActive ? "text-foreground" : isDone ? "text-muted-foreground" : "text-border"}`}>
                        {s.label}
                      </p>
                      {isActive && (
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">{s.desc}</p>
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
          </div>
        )}
      </main>
    </div>
  )
}
