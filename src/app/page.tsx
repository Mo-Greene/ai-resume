"use client"

import Link from "next/link"
import { useEffect } from "react"
import { AppHeader } from "@/components/AppHeader"
import { BeforeAfterSection } from "@/components/BeforeAfterSection"
import { FeaturesSection } from "@/components/FeaturesSection"

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-animate]")
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view")
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden">

      {/* ── Header (sticky) ── */}
      <AppHeader isHome label="Beta" className="sticky top-0 z-50 px-6 md:px-8" />

      {/* ── Section 1: Hero ── */}
      <section className="border-b border-foreground grid md:grid-cols-2 min-h-[calc(100vh-56px)] md:h-[calc(100vh-56px)]">

        {/* 왼쪽: 헤드라인 */}
        <div className="md:border-r border-b md:border-b-0 border-foreground px-6 md:px-10 flex flex-col justify-between py-10 md:py-12">
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8 md:mb-10"
              style={{ animation: "fade-in 0.7s ease 0.1s both" }}
            >
              AI-Powered Resume Builder
            </p>
            <h1 className="text-[clamp(2.4rem,7vw,6.5rem)] font-black leading-[1.05] tracking-tight uppercase">
              <span className="block overflow-hidden py-1">
                <span className="hero-line" style={{ animationDelay: "0.15s" }}>당신의</span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="hero-line" style={{ animationDelay: "0.35s" }}>이력서를</span>
              </span>
              <span className="block overflow-hidden py-1">
                <span className="hero-line text-muted-foreground/80" style={{ animationDelay: "0.55s" }}>다시 쓰다.</span>
              </span>
            </h1>
          </div>
          <p
            className="text-sm text-muted-foreground/90 max-w-sm leading-relaxed mt-8 md:mt-0"
            style={{ animation: "slide-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s both" }}
          >
            PDF를 업로드하거나, AI와 대화하며 처음부터 —<br />
            어떤 방식이든 임팩트 있는 이력서로 완성됩니다.
          </p>
        </div>

        {/* 오른쪽: 두 진입점 */}
        <div className="flex flex-col divide-y divide-foreground">
          {/* A: PDF 업로드 */}
          <Link
            href="/resume/upload"
            className="group flex-1 px-6 md:px-10 flex flex-col justify-between py-8 md:py-10 hover:bg-foreground hover:text-background transition-colors duration-300"
            style={{ animation: "fade-in 0.7s ease 0.5s both" }}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground group-hover:text-muted-foreground/70">
                기존 이력서가 있다면
              </span>
              <span className="text-sm font-mono text-muted-foreground/55 group-hover:text-muted-foreground/80">A</span>
            </div>
            <div className="mt-6 md:mt-0">
              <h2 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3 md:mb-4">
                PDF 업로드<br />&amp; 강화
              </h2>
              <p className="text-sm text-muted-foreground/90 group-hover:text-muted-foreground/90 leading-relaxed mb-5 md:mb-6 max-w-xs">
                AI가 기존 이력서를 분석하고 보완 질문으로 내용을 채워 더 강한 문구로 다듬어 드립니다.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase border-b border-current pb-0.5">
                PDF 올리기 <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>

          {/* B: 처음부터 작성 */}
          <Link
            href="/resume/new"
            className="group flex-1 px-6 md:px-10 flex flex-col justify-between py-8 md:py-10 hover:bg-foreground hover:text-background transition-colors duration-300"
            style={{ animation: "fade-in 0.7s ease 0.65s both" }}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground group-hover:text-muted-foreground/70">
                이력서가 없다면
              </span>
              <span className="text-sm font-mono text-muted-foreground/55 group-hover:text-muted-foreground/80">B</span>
            </div>
            <div className="mt-6 md:mt-0">
              <h2 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3 md:mb-4">
                대화형<br />AI 인터뷰
              </h2>
              <p className="text-sm text-muted-foreground/90 group-hover:text-muted-foreground/90 leading-relaxed mb-5 md:mb-6 max-w-xs">
                AI가 단계별로 질문하며 경험을 이끌어내고, 전문적인 이력서 문구로 만들어 드립니다.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase border-b border-current pb-0.5">
                대화 시작하기 <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Section 2: 타임라인 ── */}
      <section className="border-b border-border grid md:grid-cols-2">

        {/* A 타임라인 */}
        <div className="md:border-r border-border border-b md:border-b-0 px-6 md:px-10 py-10 md:py-14 flex flex-col justify-between">
          <div className="flex items-baseline gap-3 mb-8 md:mb-10" data-animate>
            <span className="text-[4rem] md:text-[5rem] font-black leading-none text-muted-foreground/35 select-none">A</span>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">기존 이력서가 있다면</p>
              <p className="text-lg md:text-xl font-black uppercase leading-tight">PDF 업로드 & 강화</p>
            </div>
          </div>

          <div className="relative flex-1">
            <div className="absolute left-[11px] top-6 bottom-6 w-px bg-border" />
            {[
              { n: "01", label: "PDF 업로드",       desc: "기존 PDF 파일을 드래그하거나 선택" },
              { n: "02", label: "AI 분석",           desc: "약점 파악 및 보완 포인트 도출" },
              { n: "03", label: "보완 질문 인터뷰",  desc: "AI가 부족한 내용을 질문으로 채움" },
              { n: "04", label: "문구 강화 & 완성",  desc: "임팩트 있는 표현으로 다듬어 PDF 출력" },
            ].map((step, i) => (
              <div
                key={i}
                data-animate
                className="relative flex gap-5 pb-8 md:pb-10 last:pb-0"
                style={{ transitionDelay: `${0.05 + i * 0.1}s` }}
              >
                <div className="relative z-10 shrink-0 w-6 h-6 rounded-full border-2 border-foreground bg-background flex items-center justify-center mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground/80">{step.n}</span>
                    <span className="text-sm font-bold">{step.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/90 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B 타임라인 */}
        <div className="px-6 md:px-10 py-10 md:py-14 flex flex-col justify-between">
          <div className="flex items-baseline gap-3 mb-8 md:mb-10" data-animate>
            <span className="text-[4rem] md:text-[5rem] font-black leading-none text-muted-foreground/35 select-none">B</span>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">이력서가 없다면</p>
              <p className="text-lg md:text-xl font-black uppercase leading-tight">대화형 AI 인터뷰</p>
            </div>
          </div>

          <div className="relative flex-1">
            <div className="absolute left-[11px] top-6 bottom-6 w-px bg-border" />
            {[
              { n: "01", label: "기본 정보 입력",      desc: "이름, 연락처, 직무 목표 설정" },
              { n: "02", label: "경력 & 프로젝트",      desc: "AI가 단계별로 경험을 끌어내는 인터뷰" },
              { n: "03", label: "AI 문구 자동 생성",    desc: "수치화·임팩트 중심 문구로 자동 변환" },
              { n: "04", label: "Markdown → PDF",       desc: "일관된 디자인으로 최종 PDF 출력" },
            ].map((step, i) => (
              <div
                key={i}
                data-animate
                className="relative flex gap-5 pb-8 md:pb-10 last:pb-0"
                style={{ transitionDelay: `${0.05 + i * 0.1}s` }}
              >
                <div className="relative z-10 shrink-0 w-6 h-6 rounded-full border-2 border-foreground bg-background flex items-center justify-center mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground/80">{step.n}</span>
                    <span className="text-sm font-bold">{step.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/90 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Before & After ── */}
      <BeforeAfterSection />

      {/* ── Section 4: Features ── */}
      <FeaturesSection />

      {/* ── Section 5: Output Pipeline ── */}
      <section className="px-6 md:px-10 py-14 md:py-20 flex flex-col items-center justify-center text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10 md:mb-12" data-animate>
          Output Pipeline
        </p>
        <div className="flex flex-wrap items-center justify-center gap-y-3 mb-8">
          {["경험 입력", "AI 분석", "인터뷰", "문구 생성", "Markdown", "PDF"].map((item, i, arr) => (
            <div
              key={i}
              className="flex items-center"
              data-animate
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <span className="border border-foreground px-4 md:px-5 py-2.5 md:py-3 text-sm font-medium tracking-wide hover:bg-foreground hover:text-background transition-colors cursor-default">
                {item}
              </span>
              {i < arr.length - 1 && (
                <span className="px-2 md:px-3 text-muted-foreground/80 text-base">→</span>
              )}
            </div>
          ))}
        </div>
        <p
          className="text-sm text-muted-foreground/90 max-w-md leading-relaxed"
          data-animate
          style={{ transitionDelay: "0.45s" }}
        >
          Markdown 파일이 중간 단계로 저장되어 언제든 재편집 가능하며,
          일관된 디자인의 PDF로 출력됩니다.
        </p>
      </section>

      {/* ── Section 4: CTA ── */}
      <section className="bg-foreground text-background px-6 md:px-10 min-h-[calc(100vh-56px)] flex flex-col items-center justify-center text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6" data-animate>
          지금 시작하세요
        </p>
        <h2
          className="text-[clamp(2rem,6vw,5.5rem)] font-black uppercase leading-tight mb-10 md:mb-12"
          data-animate
          style={{ transitionDelay: "0.1s" }}
        >
          당신의 이력서,<br />AI와 함께.
        </h2>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none"
          data-animate
          style={{ transitionDelay: "0.2s" }}
        >
          <Link
            href="/resume/upload"
            className="btn-sweep w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-background text-foreground px-8 md:px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-muted transition-colors"
          >
            PDF 업로드 <span>→</span>
          </Link>
          <Link
            href="/resume/new"
            className="btn-sweep w-full sm:w-auto inline-flex items-center justify-center gap-3 border border-background text-background px-8 md:px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-background hover:text-foreground transition-colors"
          >
            처음부터 작성 <span>→</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-foreground px-6 md:px-10 py-5 flex items-center justify-between bg-foreground text-background">
        <span className="text-xs font-bold tracking-[0.2em] uppercase">ResumeAI</span>
        <span className="text-xs text-muted-foreground/80 tracking-wide">Claude · GPT-4o · Gemini</span>
      </footer>
    </div>
  )
}
