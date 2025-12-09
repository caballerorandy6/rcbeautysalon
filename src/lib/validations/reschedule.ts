import { z } from "zod"

export const rescheduleAppointmentSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
  newDate: z.date({ error: "Please select a new date" }),
  newTime: z.string().min(1, "Please select a new time"),
})

export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>

export const notificationPreferencesSchema = z.object({
  emailReminders: z.boolean(),
  reminderTime: z.enum(["24h", "48h", "1week"]),
  promotionalEmails: z.boolean(),
  appointmentUpdates: z.boolean(),
})

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>
