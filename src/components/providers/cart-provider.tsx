"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!isClient) {
    return null
  }

  return <>{children}</>
}
