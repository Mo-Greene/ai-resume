import { AIProvider, ChatMessage } from "@/types/resume"
import { NextResponse } from "next/server"

const VALID_PROVIDERS: AIProvider[] = ["gpt", "claude", "gemini"]
const MAX_MESSAGES = 50
const MAX_MESSAGE_LENGTH = 10000
const MAX_SYSTEM_PROMPT_LENGTH = 5000

export type ValidationError = NextResponse

/**
 * provider 값이 유효한지 확인합니다.
 */
export function isValidProvider(value: unknown): value is AIProvider {
  return typeof value === "string" && (VALID_PROVIDERS as string[]).includes(value)
}

/**
 * messages 배열이 유효한지 확인합니다.
 */
export function isValidMessages(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value)) return false
  if (value.length === 0 || value.length > MAX_MESSAGES) return false
  return value.every(
    (m) =>
      typeof m === "object" &&
      m !== null &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.length <= MAX_MESSAGE_LENGTH
  )
}

/**
 * /api/chat 요청을 검증합니다.
 * 유효하지 않으면 NextResponse 에러를, 유효하면 null을 반환합니다.
 */
export function validateChatRequest(body: {
  provider?: unknown
  messages?: unknown
  systemPrompt?: unknown
}): ValidationError | null {
  if (!isValidProvider(body.provider)) {
    return NextResponse.json(
      { error: `provider는 ${VALID_PROVIDERS.join(", ")} 중 하나여야 합니다.` },
      { status: 400 }
    )
  }

  if (!isValidMessages(body.messages)) {
    return NextResponse.json(
      { error: "messages가 유효하지 않습니다. 1~50개의 메시지 배열이어야 합니다." },
      { status: 400 }
    )
  }

  if (
    body.systemPrompt !== undefined &&
    (typeof body.systemPrompt !== "string" || body.systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH)
  ) {
    return NextResponse.json(
      { error: "systemPrompt가 너무 깁니다." },
      { status: 400 }
    )
  }

  return null
}
