import { AIProvider, ChatMessage } from "@/types/resume"
import { claudeChat } from "./claude"
import { gptChat } from "./openai"
import { geminiChat } from "./gemini"

const RESUME_SYSTEM_PROMPT = `당신은 전문 이력서 작성 도우미입니다.
사용자의 경험과 정보를 바탕으로 임팩트 있는 이력서 문구를 작성해줍니다.
- 수치와 성과를 강조하세요
- 능동적인 동사로 시작하세요
- 간결하고 명확하게 작성하세요
- 한국어로 응답하세요`

export async function chat(
  provider: AIProvider,
  messages: ChatMessage[],
  systemPrompt: string = RESUME_SYSTEM_PROMPT
): Promise<string> {
  switch (provider) {
    case "claude":
      return claudeChat(messages, systemPrompt)
    case "gpt":
      return gptChat(messages, systemPrompt)
    case "gemini":
      return geminiChat(messages, systemPrompt)
  }
}
