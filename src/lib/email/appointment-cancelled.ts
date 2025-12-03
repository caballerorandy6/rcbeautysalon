import { Resend } from "resend"
import { render } from "@react-email/components"
import { AppointmentCancelledTemplate } from "./templates/appointment-cancelled-template"

const resend = new Resend(process.env.RESEND_API_KEY!)

interface SendAppointmentCancelledParams {
  email: string
  customerName: string
  serviceName: string
  staffName: string
  appointmentDate: Date
  appointmentTime: string
  appointmentId: string
  cancelledByAdmin?: boolean
}

export async function sendAppointmentCancelledEmail({
  email,
  customerName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  appointmentId,
  cancelledByAdmin = true,
}: SendAppointmentCancelledParams) {
  try {
    const bookingRef = appointmentId.slice(-8).toUpperCase()

    const html = await render(
      AppointmentCancelledTemplate({
        customerName,
        serviceName,
        staffName,
        appointmentDate,
        appointmentTime,
        bookingRef,
        cancelledByAdmin,
      })
    )

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `Appointment Cancelled - ${serviceName}`,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: "Failed to send appointment cancelled email" }
  }
}
