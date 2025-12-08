"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CreditCardIcon,
  CalendarIcon,
  ReceiptIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@/components/icons"
import { format } from "date-fns"

// Payment types
type PaymentType = "APPOINTMENT_DEPOSIT" | "PRODUCT_ORDER"
type PaymentStatus = "COMPLETED" | "PENDING" | "REFUNDED" | "FAILED"

interface Payment {
  id: string
  type: PaymentType
  amount: number
  status: PaymentStatus
  createdAt: Date
  description: string
  referenceId: string // appointmentId or orderId
}

interface PaymentHistoryProps {
  payments: Payment[]
  showAll?: boolean
}

const statusConfig: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircleIcon }> = {
  COMPLETED: { label: "Completed", variant: "default", icon: CheckCircleIcon },
  PENDING: { label: "Pending", variant: "secondary", icon: ClockIcon },
  REFUNDED: { label: "Refunded", variant: "outline", icon: ReceiptIcon },
  FAILED: { label: "Failed", variant: "destructive", icon: XCircleIcon },
}

const typeLabels: Record<PaymentType, string> = {
  APPOINTMENT_DEPOSIT: "Appointment Deposit",
  PRODUCT_ORDER: "Product Order",
}

export function PaymentHistory({ payments, showAll = false }: PaymentHistoryProps) {
  const [expanded, setExpanded] = useState(showAll)

  const displayedPayments = expanded ? payments : payments.slice(0, 5)
  const hasMore = payments.length > 5

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon size={20} className="text-primary" />
            Payment History
          </CardTitle>
          <CardDescription>View your past transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ReceiptIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold">No payments yet</h3>
            <p className="text-sm text-muted-foreground">
              Your payment history will appear here after your first transaction.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate totals
  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon size={20} className="text-primary" />
              Payment History
            </CardTitle>
            <CardDescription>View your past transactions</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payments List */}
        <div className="space-y-3">
          {displayedPayments.map((payment) => {
            const config = statusConfig[payment.status]
            const StatusIcon = config.icon

            return (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    {payment.type === "APPOINTMENT_DEPOSIT" ? (
                      <CalendarIcon size={20} className="text-primary" />
                    ) : (
                      <ReceiptIcon size={20} className="text-primary" />
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{typeLabels[payment.type]}</span>
                      <span>•</span>
                      <span>{format(new Date(payment.createdAt), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Amount */}
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                    <Badge variant={config.variant} className="text-xs">
                      <StatusIcon size={12} className="mr-1" />
                      {config.label}
                    </Badge>
                  </div>

                  {/* Link to details */}
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={
                        payment.type === "APPOINTMENT_DEPOSIT"
                          ? "/my-appointments"
                          : `/my-orders/${payment.referenceId}`
                      }
                    >
                      <ArrowRightIcon size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Show More/Less Button */}
        {hasMore && !showAll && (
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {expanded ? "Show Less" : `Show All (${payments.length})`}
            </Button>
          </div>
        )}

        {/* View Full History Link */}
        {showAll && (
          <div className="border-t pt-4">
            <p className="text-center text-sm text-muted-foreground">
              Showing all {payments.length} transactions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
