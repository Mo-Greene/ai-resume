"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Zap, MessageSquare, FileDown, LucideIcon } from "lucide-react"

type Feature = {
  num: string
  Icon: LucideIcon
  title: string
  desc: string
  detail: string
}

const features: Feature[] = [
  {
    num: "01",
    Icon: Zap,
    title: "AI 문구 강화",
    desc: "수동태, 모호한 표현을 수치 중심 임팩트 문구로 자동 변환합니다. GPT-4o, Claude, Gemini 중 선택.",
    detail: '"참여했습니다" → "40% 개선 달성"',
  },
  {
    num: "02",
    Icon: MessageSquare,
    title: "실시간 AI 편집",
    desc: "생성된 이력서를 Markdown으로 직접 수정하거나, 사이드 채팅으로 AI에게 즉시 요청합니다.",
    detail: '"3번 항목 더 임팩트 있게"',
  },
  {
    num: "03",
    Icon: FileDown,
    title: "즉시 PDF 출력",
    desc: "별도 디자인 툴 없이 일관된 레이아웃으로 완성본을 바로 다운로드합니다.",
    detail: "Print CSS 기반 — 픽셀 퍼펙트",
  },
]

const hoverBg = { hover: { backgroundColor: "var(--color-foreground)" } }
const hoverColor = { hover: { color: "var(--color-background)" } }
const hoverDim = { hover: { color: "color-mix(in oklch, var(--color-background) 72%, transparent)" } }
const hoverNum = { hover: { color: "color-mix(in oklch, var(--color-background) 34%, transparent)" } }
const transition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] }

export function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const [feat1, feat2, feat3] = features
  const { Icon: Icon1 } = feat1
  const { Icon: Icon2 } = feat2
  const { Icon: Icon3 } = feat3

  return (
    <section ref={ref} className="px-6 md:px-10 py-16 md:py-24 border-b border-border overflow-hidden">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">핵심 기능</p>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[1.05] tracking-tight">
          더 스마트한<br />
          <span className="text-muted-foreground/75">이력서 작업.</span>
        </h2>
      </motion.div>

      {/* Bento grid */}
      <div className="grid md:grid-cols-5 gap-px bg-border">

        {/* Feature 01 — large left */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          whileHover="hover"
          className="md:col-span-3 bg-background group cursor-default"
        >
          <motion.div
            variants={hoverBg}
            transition={transition}
            className="h-full px-8 md:px-12 py-10 md:py-14 flex flex-col justify-between min-h-[320px] md:min-h-[420px]"
          >
            <div className="flex items-start justify-between">
              <motion.span
                variants={hoverNum}
                className="text-[5rem] md:text-[7rem] font-black leading-none text-muted-foreground/35 select-none tabular-nums"
              >
                {feat1.num}
              </motion.span>
              <motion.div variants={hoverColor} className="text-muted-foreground/55">
                <Icon1 size={28} strokeWidth={1.5} />
              </motion.div>
            </div>

            <div>
              {/* Before/After chip */}
              <div className="inline-flex items-center gap-3 border border-border px-4 py-2 mb-6 font-mono text-xs text-muted-foreground/90">
                <span className="line-through opacity-60">&quot;참여했습니다&quot;</span>
                <span className="text-muted-foreground/60">→</span>
                <motion.span
                  variants={hoverColor}
                  className="text-foreground font-bold"
                >
                  &quot;40% 개선 달성&quot;
                </motion.span>
              </div>

              <motion.h3
                variants={hoverColor}
                className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3"
              >
                {feat1.title}
              </motion.h3>
              <motion.p variants={hoverDim} className="text-sm text-muted-foreground/90 max-w-sm leading-relaxed">
                {feat1.desc}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Features 02 + 03 — stacked right */}
        <div className="md:col-span-2 flex flex-col gap-px">

          {/* Feature 02 */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            whileHover="hover"
            className="flex-1 bg-background group cursor-default"
          >
            <motion.div
              variants={hoverBg}
              transition={transition}
              className="h-full px-7 py-8 flex flex-col justify-between min-h-[180px]"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.span
                  variants={hoverNum}
                  className="text-4xl font-black leading-none text-muted-foreground/35 select-none tabular-nums"
                >
                  {feat2.num}
                </motion.span>
                <motion.div variants={hoverColor} className="text-muted-foreground/55">
                  <Icon2 size={22} strokeWidth={1.5} />
                </motion.div>
              </div>
              <div>
                <motion.p variants={hoverDim} className="font-mono text-[11px] text-muted-foreground/65 mb-3">
                  {feat2.detail}
                </motion.p>
                <motion.h3 variants={hoverColor} className="text-lg font-black uppercase leading-tight mb-2">
                  {feat2.title}
                </motion.h3>
                <motion.p variants={hoverDim} className="text-xs text-muted-foreground/90 leading-relaxed">
                  {feat2.desc}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature 03 */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
            whileHover="hover"
            className="flex-1 bg-background group cursor-default"
          >
            <motion.div
              variants={hoverBg}
              transition={transition}
              className="h-full px-7 py-8 flex flex-col justify-between min-h-[180px]"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.span
                  variants={hoverNum}
                  className="text-4xl font-black leading-none text-muted-foreground/35 select-none tabular-nums"
                >
                  {feat3.num}
                </motion.span>
                <motion.div variants={hoverColor} className="text-muted-foreground/55">
                  <Icon3 size={22} strokeWidth={1.5} />
                </motion.div>
              </div>
              <div>
                <motion.p variants={hoverDim} className="font-mono text-[11px] text-muted-foreground/65 mb-3">
                  {feat3.detail}
                </motion.p>
                <motion.h3 variants={hoverColor} className="text-lg font-black uppercase leading-tight mb-2">
                  {feat3.title}
                </motion.h3>
                <motion.p variants={hoverDim} className="text-xs text-muted-foreground/90 leading-relaxed">
                  {feat3.desc}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
