import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function gptChat(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string
): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: 4096,
  })

  return response.choices[0].message.content ?? ""
}
