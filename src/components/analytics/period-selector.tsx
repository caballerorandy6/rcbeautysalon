"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectItem } from "@tremor/react"
import { PeriodType } from "@/lib/interfaces"

interface PeriodSelectorProps {
  value: PeriodType
}

const periods: { value: PeriodType; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
]

export function PeriodSelector({ value }: PeriodSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (newPeriod: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("period", newPeriod)
    router.push(`?${params.toString()}`)
  }

  return (
    <Select
      value={value}
      onValueChange={handleChange}
      className="w-full sm:w-44"
    >
      {periods.map((period) => (
        <SelectItem key={period.value} value={period.value}>
          {period.label}
        </SelectItem>
      ))}
    </Select>
  )
}
