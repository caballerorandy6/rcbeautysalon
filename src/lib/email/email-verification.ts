import { Resend } from "resend"
import { render } from "@react-email/components"
import { VerificationEmailTemplate } from "@/lib/email/templates/verification-email-template"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  try {
    const html = await render(
      VerificationEmailTemplate({ verificationLink })
    )

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "Verify Your Email - RC Beauty Salon",
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
