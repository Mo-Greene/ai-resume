"use client"

import { Github } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <a
        href="https://github.com/Mo-Greene/ai-resume"
        target="_blank"
        rel="noopener noreferrer"
        className="w-7 h-7 flex items-center justify-center border border-foreground/30 rounded-full hover:bg-muted transition-colors"
        aria-label="GitHub"
      >
        <Github size={13} />
      </a>
      <ThemeToggle />
    </div>
  )
}
