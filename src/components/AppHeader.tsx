"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { HeaderActions } from "./HeaderActions"

interface AppHeaderProps {
  /** 오른쪽 끝 레이블 (예: "Beta", "PDF 업로드") */
  label?: string
  /** 레이블 대신 오른쪽에 들어갈 커스텀 버튼들 (edit 페이지용) */
  rightActions?: ReactNode
  /** 가운데 슬롯 (edit 페이지 파일명 등) */
  center?: ReactNode
  /**
   * 랜딩 페이지에서 true — 로고를 <span>으로 렌더링하고 fade-in 애니메이션 적용.
   * false(기본) — <Link href="/">로 렌더링.
   */
  isHome?: boolean
  /**
   * <header> 에 추가할 클래스.
   * 기본값: "sticky top-0 z-50 px-4 md:px-10"
   */
  className?: string
}

export function AppHeader({
  label,
  rightActions,
  center,
  isHome = false,
  className = "sticky top-0 z-50 px-4 md:px-10",
}: AppHeaderProps) {
  return (
    <header
      className={`bg-background border-b border-foreground h-14 flex items-center justify-between gap-2 ${className}`}
    >
      {/* 로고 */}
      {isHome ? (
        <span
          className="text-sm font-bold tracking-[0.2em] uppercase shrink-0"
          style={{ animation: "fade-in 0.6s ease forwards" }}
        >
          ResumeAI
        </span>
      ) : (
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.2em] uppercase hover:opacity-60 transition-opacity shrink-0"
        >
          ResumeAI
        </Link>
      )}

      {/* 가운데 슬롯 (선택) */}
      {center && (
        <div className="flex-1 min-w-0 flex justify-center">
          {center}
        </div>
      )}

      {/* 오른쪽: HeaderActions + 레이블 or 커스텀 버튼 */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <HeaderActions />
        {label && (
          isHome ? (
            <span
              className="text-xs tracking-widest uppercase text-muted-foreground"
              style={{ animation: "fade-in 0.6s ease 0.2s both" }}
            >
              {label}
            </span>
          ) : (
            <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
              {label}
            </span>
          )
        )}
        {rightActions}
      </div>
    </header>
  )
}
