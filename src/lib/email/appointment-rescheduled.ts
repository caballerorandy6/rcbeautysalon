import { Resend } from "resend"
import { render } from "@react-email/components"
import { AppointmentRescheduledTemplate } from "./templates/appointment-rescheduled-template"

const resend = new Resend(process.env.RESEND_API_KEY!)

interface SendAppointmentRescheduledParams {
  email: string
  customerName: string
  serviceName: string
  staffName: string
  oldDate: Date
  oldTime: string
  newDate: Date
  newTime: string
  duration: number
}

export async function sendAppointmentRescheduledEmail({
  email,
  customerName,
  serviceName,
  staffName,
  oldDate,
  oldTime,
  newDate,
  newTime,
  duration,
}: SendAppointmentRescheduledParams) {
  try {
    const html = await render(
      AppointmentRescheduledTemplate({
        customerName,
        serviceName,
        staffName,
        oldDate,
        oldTime,
        newDate,
        newTime,
        duration,
      })
    )

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `Appointment Rescheduled - ${serviceName}`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: "Failed to send rescheduled email" }
  }
}
