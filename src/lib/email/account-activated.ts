import { Resend } from "resend"
import { render } from "@react-email/components"
import { AccountActivatedTemplate } from "./templates/account-activated-template"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendAccountActivatedEmail(
  email: string,
  userName?: string
) {
  try {
    const html = await render(AccountActivatedTemplate({ userName }))

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "Your Account is Now Active - RC Beauty Salon",
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: "Failed to send account activated email" }
  }
}
