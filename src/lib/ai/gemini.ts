import { GoogleGenerativeAI } from "@google/generative-ai"

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "")

export async function geminiChat(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string
): Promise<string> {
  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  })

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const chat = model.startChat({ history })
  const lastMessage = messages[messages.length - 1].content
  const result = await chat.sendMessage(lastMessage)

  return result.response.text()
}
