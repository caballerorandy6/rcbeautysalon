import { Resend } from "resend"
import { render } from "@react-email/components"
import { AppointmentCompletedTemplate } from "./templates/appointment-completed-template"

const resend = new Resend(process.env.RESEND_API_KEY!)

interface SendAppointmentCompletedParams {
  email: string
  customerName: string
  serviceName: string
  staffName: string
  appointmentDate: Date
  appointmentTime: string
  totalPrice: number
  appointmentId: string
}

export async function sendAppointmentCompletedEmail({
  email,
  customerName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  totalPrice,
  appointmentId,
}: SendAppointmentCompletedParams) {
  try {
    const bookingRef = appointmentId.slice(-8).toUpperCase()

    const html = await render(
      AppointmentCompletedTemplate({
        customerName,
        serviceName,
        staffName,
        appointmentDate,
        appointmentTime,
        totalPrice,
        bookingRef,
      })
    )

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `Thank You for Visiting - ${serviceName}`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: "Failed to send appointment completed email" }
  }
}
