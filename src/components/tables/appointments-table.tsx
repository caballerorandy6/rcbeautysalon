import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Appointment {
  id: string
  customerName: string
  service: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
}

const mockAppointments: Appointment[] = []

const statusColors = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
}

export function AppointmentsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAppointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No appointments found
              </TableCell>
            </TableRow>
          ) : (
            mockAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.customerName}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  <Badge className={statusColors[appointment.status]}>
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
