"use client"

import type React from "react"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type ParallaxProps = {
  children: React.ReactNode
  className?: string
  bgSrc?: string
  speed?: number // 0.0 - 0.6 recommended
  overlayClassName?: string
}

export default function ParallaxSection({
  children,
  className,
  bgSrc = "/strategy-1.jpg",
  speed = 0.25,
  overlayClassName,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const parent = el.parentElement
        if (!parent) return
        const rect = parent.getBoundingClientRect()
        const viewportH = window.innerHeight
        const centerY = rect.top + rect.height / 2
        const delta = centerY - viewportH / 2
        const translateY = Math.max(-60, Math.min(60, delta * speed))
        el.style.transform = `translate3d(0, ${translateY}px, 0)`
        raf = 0
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <section className={cn("relative isolate", className)}>
      <div ref={ref} className="pointer-events-none absolute inset-0 -z-10 will-change-transform" aria-hidden="true">
        <Image src={bgSrc || "/placeholder.svg"} alt="" fill className="object-cover" priority={false} />
        <div className={cn("absolute inset-0", overlayClassName ?? "bg-black/12")} />
      </div>
      {children}
    </section>
  )
}
