"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ResumeData {
  id: string
  fileName: string
  rawText: string
  markdown: string
  createdAt: string
}

interface Message {
  role: "user" | "assistant"
  content: string
  type?: "edit" | "advice"
  streaming?: boolean
}

const buildSystemPrompt = (markdown: string) =>
  `당신은 전문 이력서 작성 도우미입니다.

아래는 현재 사용자의 이력서(Markdown)입니다:
---
${markdown}
---

반드시 아래 형식으로만 응답하세요. 첫 줄에 타입만 작성하고 다음 줄부터 내용을 쓰세요.

이력서 내용 수정 시:
TYPE:EDIT
(수정된 전체 Markdown)

조언/피드백/질문 답변 시:
TYPE:ADVICE
(한국어 응답 텍스트)

규칙:
- 수정 요청 → TYPE:EDIT + 전체 Markdown
- 조언/분석 요청 → TYPE:ADVICE + 텍스트
- 첫 줄은 반드시 TYPE:EDIT 또는 TYPE:ADVICE 만 작성`

function parseTypeResponse(raw: string): { type: "edit" | "advice"; content: string } {
  const idx = raw.indexOf("\n")
  if (idx === -1) return { type: "advice", content: raw }
  const firstLine = raw.slice(0, idx).trim()
  const body = raw.slice(idx + 1)
  return { type: firstLine === "TYPE:EDIT" ? "edit" : "advice", content: body }
}

const SUGGESTIONS = [
  "경력 섹션을 더 임팩트 있게 수정해줘",
  "전체적으로 더 간결하게 만들어줘",
  "부족한 부분이 뭔지 알려줘",
  "성과 수치를 강조해줘",
]

export default function EditPage() {
  const params = useParams()
  const id = params.id as string

  const [resume, setResume] = useState<ResumeData | null>(null)
  const [markdown, setMarkdown] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raw = localStorage.getItem(id)
    if (raw) {
      const data = JSON.parse(raw) as ResumeData
      setResume(data)
      setMarkdown(data.markdown)
      askFirstQuestion(data.markdown)
    }
  }, [id])

  const askFirstQuestion = async (md: string) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gpt",
          systemPrompt: buildSystemPrompt(md),
          messages: [{
            role: "user",
            content: "이 이력서를 분석해서 가장 보완이 필요한 부분 1가지를 구체적인 질문으로 물어봐줘.",
          }],
        }),
      })
      if (!res.ok) return
      const { content } = await res.json()
      const parsed = parseTypeResponse(content)
      setMessages([{ role: "assistant", content: parsed.content, type: "advice" }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 자동 저장
  useEffect(() => {
    if (!resume || !markdown) return
    localStorage.setItem(id, JSON.stringify({ ...resume, markdown }))
  }, [markdown, id, resume])

  const sendMessage = async (overrideInput?: string) => {
    const text = overrideInput ?? input
    if (!text.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    // 스트리밍 placeholder 추가
    const placeholder: Message = { role: "assistant", content: "", type: "advice", streaming: true }
    setMessages([...newMessages, placeholder])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gpt",
          systemPrompt: buildSystemPrompt(markdown),
          messages: newMessages,
          stream: true,
        }),
      })
      if (!res.ok || !res.body) throw new Error()

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let typeResolved = false
      let msgType: "edit" | "advice" = "advice"
      let contentStart = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        if (!typeResolved) {
          const newlineIdx = buffer.indexOf("\n")
          if (newlineIdx !== -1) {
            const firstLine = buffer.slice(0, newlineIdx).trim()
            msgType = firstLine === "TYPE:EDIT" ? "edit" : "advice"
            contentStart = newlineIdx + 1
            typeResolved = true
          }
        }

        if (typeResolved) {
          const visibleContent = buffer.slice(contentStart)
          if (msgType === "advice") {
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: "assistant", content: visibleContent, type: "advice", streaming: true }
              return updated
            })
          } else {
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { role: "assistant", content: "이력서 수정 중...", type: "edit", streaming: true }
              return updated
            })
          }
        }
      }

      // 스트림 완료
      const finalContent = buffer.slice(contentStart)
      if (msgType === "edit") setMarkdown(finalContent)

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "assistant", content: finalContent, type: msgType, streaming: false }
        return updated
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "assistant", content: "오류가 발생했습니다. 다시 시도해주세요.", type: "advice" }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!resume) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-sm text-neutral-400">이력서를 불러오는 중...</p>
    </div>
  )

  return (
    <div className="h-screen bg-white text-black font-sans flex flex-col overflow-hidden">

      {/* 미리보기 모달 */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <header className="shrink-0 h-14 border-b border-black px-10 flex items-center justify-between">
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">미리보기</span>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="text-xs tracking-widest uppercase font-bold border border-black px-5 py-2 hover:bg-black hover:text-white transition-colors"
            >
              닫기 ✕
            </button>
          </header>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-10 py-14
              [&_h1]:text-3xl [&_h1]:font-black [&_h1]:uppercase [&_h1]:tracking-tight [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-black [&_h1]:pb-4
              [&_h2]:text-xs [&_h2]:font-bold [&_h2]:tracking-[0.2em] [&_h2]:uppercase [&_h2]:text-neutral-400 [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2
              [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-neutral-700 [&_p]:mb-3
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
              [&_li]:text-sm [&_li]:text-neutral-700 [&_li]:leading-relaxed
              [&_strong]:font-bold [&_strong]:text-black
              [&_hr]:border-neutral-200 [&_hr]:my-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="shrink-0 bg-white border-b border-black h-14 px-10 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold tracking-[0.2em] uppercase hover:opacity-60 transition-opacity">
          ResumeAI
        </Link>
        <span className="text-xs text-neutral-400 font-mono truncate max-w-[200px]">{resume.fileName}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="text-xs tracking-widest uppercase font-bold border border-black px-5 py-2 hover:bg-black hover:text-white transition-colors"
          >
            미리보기
          </button>
          <button className="text-xs tracking-widest uppercase font-bold bg-black text-white px-5 py-2 hover:bg-neutral-800 transition-colors">
            PDF 저장
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 grid grid-cols-[1fr_380px] overflow-hidden">

        {/* 좌: Markdown 에디터 */}
        <div className="flex flex-col border-r border-black overflow-hidden">
          <div className="shrink-0 border-b border-neutral-200 px-6 py-3 flex items-center justify-between">
            <span className="text-xs tracking-[0.2em] uppercase text-neutral-400">Markdown 편집</span>
            <span className="text-xs font-mono text-neutral-300">{markdown.length} chars</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 resize-none p-6 font-mono text-sm leading-relaxed outline-none text-black placeholder:text-neutral-300"
            placeholder="이력서 내용이 여기에 표시됩니다..."
            spellCheck={false}
          />
        </div>

        {/* 우: AI 채팅 */}
        <div className="flex flex-col overflow-hidden">
          <div className="shrink-0 border-b border-neutral-200 px-6 py-3 flex items-center">
            <span className="text-xs tracking-[0.2em] uppercase text-neutral-400">AI 어시스턴트</span>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  이력서를 AI와 함께 다듬어보세요.
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="block w-full text-left text-xs text-neutral-500 border border-neutral-200 px-4 py-3 hover:border-black hover:text-black transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                {msg.role === "assistant" && msg.type === "edit" && !msg.streaming ? (
                  <div className="inline-block max-w-[92%] border border-black px-4 py-3 text-sm">
                    <p className="text-xs tracking-widest uppercase font-bold text-black mb-2">✓ 에디터에 자동 적용됨</p>
                    <p className="text-neutral-400 text-xs font-mono">{msg.content.slice(0, 80)}...</p>
                  </div>
                ) : (
                  <div className={`inline-block max-w-[92%] text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-black text-white px-4 py-3"
                      : "border border-neutral-200 px-4 py-3 text-black"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}
                      {msg.streaming && <span className="inline-block w-0.5 h-4 bg-neutral-400 ml-0.5 animate-pulse align-middle" />}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages.length === 0 && (
              <div className="text-left">
                <div className="inline-block border border-neutral-200 px-4 py-3">
                  <span className="text-xs text-neutral-400 font-mono">분석 중...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div className="shrink-0 border-t border-black p-4">
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="AI에게 수정을 요청하세요... (Shift+Enter 줄바꿈)"
                rows={2}
                className="flex-1 resize-none text-sm outline-none placeholder:text-neutral-300 leading-relaxed"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="shrink-0 text-xs font-bold tracking-widest uppercase bg-black text-white px-4 py-2.5 hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
