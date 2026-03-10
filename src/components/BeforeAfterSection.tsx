"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

type Part = { t: string; highlight?: boolean }

const items: { tag: string; before: string; after: Part[] }[] = [
  {
    tag: "경력 기술",
    before: "다양한 프로젝트에 참여하여 팀에 기여했습니다.",
    after: [
      { t: "6개월간 " },
      { t: "3개 팀", highlight: true },
      { t: " 협업, 배포 주기 " },
      { t: "40% 단축", highlight: true },
      { t: " — 분기 목표 조기 달성." },
    ],
  },
  {
    tag: "리더십",
    before: "팀장 역할을 맡아 프로젝트를 이끌었습니다.",
    after: [
      { t: "5인 팀", highlight: true },
      { t: " 리드, OKR 달성률 " },
      { t: "92%", highlight: true },
      { t: " 달성 및 이직률 " },
      { t: "0%", highlight: true },
      { t: " 유지." },
    ],
  },
  {
    tag: "고객 성과",
    before: "고객 문의를 처리하여 만족도를 높였습니다.",
    after: [
      { t: "월 " },
      { t: "200건", highlight: true },
      { t: " VOC 처리, CSAT " },
      { t: "3.2 → 4.7", highlight: true },
      { t: "로 " },
      { t: "47%", highlight: true },
      { t: " 개선." },
    ],
  },
]

const rowVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
}

const afterVariants = {
  hidden: { opacity: 0, x: 24 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 + 0.2 },
  }),
}

export function BeforeAfterSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="bg-foreground text-background px-6 md:px-10 py-16 md:py-24 overflow-hidden">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-background/40 mb-4">
          Before &amp; After
        </p>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[1.05] tracking-tight">
          문구 하나가<br />
          <span className="text-background/65">합격을 바꿉니다.</span>
        </h2>
      </motion.div>

      {/* Column headers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 mb-3 px-1"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-background/55">Before</span>
        <span className="text-[10px] tracking-[0.3em] uppercase text-background/70 pl-6 md:pl-10">After</span>
      </motion.div>

      {/* Rows */}
      <div className="space-y-px">
        {items.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={rowVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid grid-cols-2 border border-background/10 overflow-hidden"
          >
            {/* Before */}
            <div className="px-5 md:px-8 py-6 md:py-8 border-r border-background/10">
              <p className="text-sm md:text-base leading-relaxed text-background/58 line-through decoration-background/35 decoration-1">
                {item.before}
              </p>
            </div>

            {/* After */}
            <motion.div
              custom={i}
              variants={afterVariants}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="px-5 md:px-8 py-6 md:py-8 relative"
            >
              {/* Glow accent */}
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-background/40 to-transparent" />

              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm md:text-base leading-relaxed text-background font-medium">
                  {item.after.map((part, j) =>
                    part.highlight ? (
                      <span key={j} className="font-black text-background relative">
                        {part.t}
                      </span>
                    ) : (
                      <span key={j} className="text-background/82">{part.t}</span>
                    )
                  )}
                </p>
                <span className="shrink-0 text-[9px] tracking-[0.2em] uppercase border border-background/20 px-2 py-1 text-background/40 hidden sm:inline-block">
                  {item.tag}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 text-xs text-background/50 tracking-wide"
      >
        * AI가 수치화·임팩트 중심 표현으로 자동 변환합니다.
      </motion.p>
    </section>
  )
}
