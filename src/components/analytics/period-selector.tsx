"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PeriodType } from "@/lib/interfaces"
import { CalendarIcon } from "@/components/icons"

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

  const currentLabel = periods.find(p => p.value === value)?.label || "Last 30 days"

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-48">
        <CalendarIcon size={16} className="mr-2 text-muted-foreground" />
        <SelectValue placeholder={currentLabel} />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period) => (
          <SelectItem key={period.value} value={period.value}>
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
