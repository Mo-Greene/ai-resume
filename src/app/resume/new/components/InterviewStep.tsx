"use client"

import { useEffect, useRef, useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
  streaming?: boolean
}

interface ContextBadge {
  label: string
  value: string
}

interface Props {
  stepLabel: string
  title: string
  description: string
  contextBadges: ContextBadge[]
  firstMessage: string
  systemPrompt: string
  summaryPrompt: string
  onNext: (summary: string) => void
}

export default function InterviewStep({
  stepLabel,
  title,
  description,
  contextBadges,
  firstMessage,
  systemPrompt,
  summaryPrompt,
  onNext,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMessages([{ role: "assistant", content: firstMessage }])
    inputRef.current?.focus()
  }, [firstMessage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: Message = { role: "user", content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    const placeholder: Message = { role: "assistant", content: "", streaming: true }
    setMessages([...newMessages, placeholder])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gpt",
          systemPrompt,
          messages: newMessages,
          stream: true,
        }),
      })
      if (!res.ok || !res.body) throw new Error()

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "assistant", content: buffer, streaming: true }
          return updated
        })
      }

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "assistant", content: buffer, streaming: false }
        return updated
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: "assistant", content: "오류가 발생했습니다. 다시 시도해주세요." }
        return updated
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleNext = async () => {
    if (isSummarizing) return
    setIsSummarizing(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gpt",
          systemPrompt: summaryPrompt,
          messages,
        }),
      })
      const { content } = await res.json()
      onNext(content)
    } catch {
      onNext("")
    }
  }

  const canProceed = messages.length >= 3

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-56px-48px)]">
      {/* 상단(모바일) / 왼쪽(데스크탑): 안내 */}
      <div className="md:w-[280px] md:shrink-0 border-b md:border-b-0 md:border-r border-foreground px-6 md:px-8 py-6 md:py-14 flex flex-col md:justify-between gap-4 md:gap-0">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 md:mb-8">{stepLabel}</p>
          <h2 className="text-xl md:text-2xl font-black uppercase leading-tight tracking-tight mb-3 md:mb-6 whitespace-pre-line">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed hidden md:block">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 md:gap-3">
          {contextBadges.map(badge => (
            <div key={badge.label} className="border border-border/50 px-4 py-2 md:py-3 flex-1">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">{badge.label}</p>
              <p className="text-sm font-bold">{badge.value}</p>
            </div>
          ))}

          <button
            onClick={handleNext}
            disabled={isSummarizing || !canProceed}
            className="w-full flex items-center justify-between bg-foreground text-background px-5 py-3 md:py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-foreground/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSummarizing ? "정리 중..." : "다음 단계"}
            <span>→</span>
          </button>
          {!canProceed && (
            <p className="text-xs text-muted-foreground text-center">AI와 대화 후 활성화됩니다</p>
          )}
        </div>
      </div>

      {/* 채팅 */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ height: "calc(100vh - 56px - 48px - 180px)" }}>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4" style={{ minHeight: 0 }}>
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
              <div className={`inline-block max-w-[80%] text-sm leading-relaxed px-4 py-3 ${
                msg.role === "user"
                  ? "bg-foreground text-background"
                  : "border border-border text-foreground"
              }`}>
                <p className="whitespace-pre-wrap">
                  {msg.content}
                  {msg.streaming && (
                    <span className="inline-block w-0.5 h-4 bg-muted-foreground ml-0.5 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </div>
          ))}
          {isLoading && messages.length === 0 && (
            <div className="text-left">
              <div className="inline-block border border-border px-4 py-3">
                <span className="text-xs text-muted-foreground font-mono">준비 중...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 border-t border-foreground p-3 md:p-4">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="답변을 입력하세요... (Shift+Enter 줄바꿈)"
              rows={2}
              className="flex-1 resize-none text-sm outline-none placeholder:text-muted-foreground/40 leading-relaxed bg-background text-foreground"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="shrink-0 text-xs font-bold tracking-widest uppercase bg-foreground text-background px-4 py-2.5 hover:bg-foreground/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
