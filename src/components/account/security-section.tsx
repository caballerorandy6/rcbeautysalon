"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { sendPasswordResetFromAccount } from "@/app/actions/account"
import { LockIcon } from "@/components/icons/lock-icon"
import { EnvelopeIcon } from "@/components/icons/envelope-icon"
import { SpinnerIcon } from "@/components/icons/spinner-icon"
import { SecuritySectionProps } from "@/lib/interfaces"

export function SecuritySection({ email }: SecuritySectionProps) {
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSendResetEmail() {
    setIsSending(true)
    try {
      const result = await sendPasswordResetFromAccount()

      if (result.success) {
        setEmailSent(true)
        toast.success("Password reset email sent", {
          description:
            "Check your inbox for instructions to reset your password.",
        })
      } else {
        toast.error(result.error || "Failed to send reset email")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <LockIcon size={20} className="text-primary" />
          <CardTitle className="text-lg">Security</CardTitle>
        </div>
        <CardDescription>
          Manage your password and security settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emailSent ? (
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
            <div className="flex items-center gap-2">
              <EnvelopeIcon
                size={20}
                className="text-green-600 dark:text-green-400"
              />
              <p className="font-semibold text-green-900 dark:text-green-100">
                Email Sent!
              </p>
            </div>
            <p className="mt-2 text-sm text-green-800 dark:text-green-200">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              Check your inbox and follow the instructions.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setEmailSent(false)}
            >
              Send Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-muted-foreground text-sm">
                  Secure your account with a strong password
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSendResetEmail}
                disabled={isSending}
              >
                {isSending && (
                  <SpinnerIcon size={16} className="mr-2 animate-spin" />
                )}
                Change Password
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              We&apos;ll send a secure link to your email ({email}) to reset
              your password.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
