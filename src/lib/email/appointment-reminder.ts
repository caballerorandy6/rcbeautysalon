import { Resend } from "resend"
import { render } from "@react-email/components"
import { AppointmentReminderTemplate } from "./templates/appointment-reminder-template"

const resend = new Resend(process.env.RESEND_API_KEY!)

interface SendAppointmentReminderParams {
  email: string
  customerName: string
  serviceName: string
  staffName: string
  appointmentDate: Date
  appointmentTime: string
  duration: number
  reminderType: "24h" | "48h" | "1week"
}

const reminderText = {
  "24h": "tomorrow",
  "48h": "in 2 days",
  "1week": "in 1 week",
}

export async function sendAppointmentReminderEmail({
  email,
  customerName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  duration,
  reminderType,
}: SendAppointmentReminderParams) {
  try {
    const html = await render(
      AppointmentReminderTemplate({
        customerName,
        serviceName,
        staffName,
        appointmentDate,
        appointmentTime,
        duration,
        reminderType,
      })
    )

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `Reminder: Your appointment is ${reminderText[reminderType]} - ${serviceName}`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: "Failed to send reminder email" }
  }
}
