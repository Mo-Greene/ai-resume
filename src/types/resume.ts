export type AIProvider = "claude" | "gpt" | "gemini"

export interface ResumeSection {
  id: string
  title: string
  content: string
}

export interface ResumeData {
  name: string
  email: string
  phone: string
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  startDate: string
  endDate: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}
