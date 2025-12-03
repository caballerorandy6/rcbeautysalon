"use client"

import { useEffect, useRef } from "react"
import { useNavigationStore } from "@/store/navigation-store"

interface UseSectionObserverProps {
  sectionId: string
  threshold?: number
}

export function useSectionObserver({
  sectionId,
  threshold = 0.4,
}: UseSectionObserverProps) {
  const ref = useRef<HTMLElement>(null)
  const { setActiveSection } = useNavigationStore()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId)
            // Update URL hash without scrolling
            history.replaceState(null, "", `/#${sectionId}`)
          }
        })
      },
      {
        threshold,
        rootMargin: "-20% 0px -20% 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [sectionId, threshold, setActiveSection])

  return ref
}
