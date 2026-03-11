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

[핵심 작성 원칙]
1. 수치화 우선: 모든 성과는 반드시 숫자로 표현하세요.
   - 예) "성능을 개선했다" → "API 응답 속도를 40% 단축했다"
   - 예) "매출에 기여했다" → "월 매출 1.2억 달성에 기여했다"
   - 수치가 없으면 사용자에게 구체적인 수치를 반드시 질문하세요.
2. 임팩트 중심: 담당 업무가 아닌 결과와 기여도를 중심으로 서술하세요.
   - "~을 담당했다" → "~을 통해 [결과]를 달성했다"
3. 능동적 동사: 문장은 항상 강한 능동 동사로 시작하세요.
   - 예) 주도했다, 구축했다, 개선했다, 달성했다, 최적화했다
4. 간결하고 명확하게 한국어로 응답하세요.`

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
