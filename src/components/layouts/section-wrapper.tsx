"use client"

import { useEffect, useRef, ReactNode } from "react"
import { useNavigationStore } from "@/store/navigation-store"

interface SectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const { setActiveSection } = useNavigationStore()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [id, setActiveSection])

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  )
}
