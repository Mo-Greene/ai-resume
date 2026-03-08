import { NextRequest, NextResponse } from "next/server"
import { chat } from "@/lib/ai"
import { ChatMessage, AIProvider } from "@/types/resume"
import { validateChatRequest } from "@/lib/api/validate"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const validationError = validateChatRequest(body)
    if (validationError) return validationError

    const { messages, systemPrompt, provider = "gpt", stream = false } = body as {
      messages: ChatMessage[]
      systemPrompt?: string
      provider: AIProvider
      stream?: boolean
    }

    const system = systemPrompt ?? `당신은 전문 이력서 작성 도우미입니다.
사용자의 경험과 정보를 바탕으로 임팩트 있는 이력서 문구를 작성해줍니다.
수치와 성과를 강조하고, 능동적인 동사를 사용하며, 간결하고 명확하게 한국어로 응답하세요.`

    if (stream && provider === "gpt") {
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const streamRes = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              max_tokens: 4096,
              messages: [{ role: "system", content: system }, ...messages],
              stream: true,
            })
            for await (const chunk of streamRes) {
              const text = chunk.choices[0]?.delta?.content ?? ""
              if (text) controller.enqueue(encoder.encode(text))
            }
          } finally {
            controller.close()
          }
        },
      })
      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
        },
      })
    }

    const content = await chat(provider, messages, system)
    return NextResponse.json({ content })
  } catch (err) {
    console.error("[chat]", err)
    return NextResponse.json({ error: "AI 응답에 실패했습니다." }, { status: 500 })
  }
}
