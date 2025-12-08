import { Resend } from "resend"
import { render } from "@react-email/components"
import { AppointmentExpiredTemplate } from "./templates/appointment-expired-template"

const resend = new Resend(process.env.RESEND_API_KEY!)

interface SendAppointmentExpiredParams {
  email: string
  customerName: string
  serviceName: string
  staffName: string
  appointmentDate: Date
  appointmentTime: string
  depositAmount: number
}

export async function sendAppointmentExpiredEmail({
  email,
  customerName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  depositAmount,
}: SendAppointmentExpiredParams) {
  try {
    const html = await render(
      AppointmentExpiredTemplate({
        customerName,
        serviceName,
        staffName,
        appointmentDate,
        appointmentTime,
        depositAmount,
      })
    )

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `Appointment Cancelled - Payment Not Received`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: "Failed to send expired appointment email" }
  }
}
