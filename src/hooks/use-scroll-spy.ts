"use client"

import { useEffect } from "react"

const sectionTitle: Record<string, string> = {
  home: "Beauty Salon | Home",
  services: "Beauty Salon | Services",
  shop: "Beauty Salon | Shop",
  about: "Beauty Salon | About",
  contact: "Beauty Salon | Contact",
}

export function useScrollSpy(sectionIds: string[]) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id")
            if (id) {
              // Update URL without reload
              history.replaceState(null, "", `#${id}`)

              // Dynamically change title
              const newTitle = sectionTitle[id] || "Beauty Salon"
              if (document.title !== newTitle) {
                document.title = newTitle
              }
            }
            break
          }
        }
      },
      {
        rootMargin: "-50% 0px -50% 0px", // Activate when section is centered
        threshold: 0,
      }
    )

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    elements.forEach((el) => observer.observe(el!))

    return () => observer.disconnect()
  }, [sectionIds])
}
