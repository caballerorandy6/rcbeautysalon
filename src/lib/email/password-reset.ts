import { Resend } from "resend"
import { render } from "@react-email/components"
import { PasswordResetTemplate } from "./templates/password-reset-template"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  try {
    const html = await render(PasswordResetTemplate({ resetLink }))

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "Reset Your Password - RC Beauty Salon",
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: "Failed to send email" }
  }
}
