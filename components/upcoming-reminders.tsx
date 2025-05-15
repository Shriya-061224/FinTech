"use client"

import { useState } from "react"
import { CalendarIcon, CheckCircle2, CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const reminders = [
  {
    id: "r1",
    title: "Pay Credit Card Bill",
    dueDate: "2025-05-18",
    amount: 450.75,
    priority: "high",
    completed: false,
  },
  {
    id: "r2",
    title: "Electricity Bill",
    dueDate: "2025-05-22",
    amount: 85.3,
    priority: "medium",
    completed: false,
  },
  {
    id: "r3",
    title: "Car Insurance",
    dueDate: "2025-05-30",
    amount: 120.0,
    priority: "medium",
    completed: false,
  },
  {
    id: "r4",
    title: "Phone Bill",
    dueDate: "2025-06-05",
    amount: 65.99,
    priority: "low",
    completed: false,
  },
  {
    id: "r5",
    title: "Internet Bill",
    dueDate: "2025-05-10",
    amount: 79.99,
    priority: "medium",
    completed: true,
  },
]

export function UpcomingReminders() {
  const [remindersList, setRemindersList] = useState(reminders)

  const toggleComplete = (id: string) => {
    setRemindersList((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder)),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-green-500"
      default:
        return ""
    }
  }

  const sortedReminders = [...remindersList].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // Then sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  return (
    <div className="space-y-3">
      {sortedReminders.map((reminder) => (
        <div
          key={reminder.id}
          className={cn("flex items-start justify-between rounded-lg border p-3", reminder.completed && "bg-muted/50")}
        >
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full p-0"
              onClick={() => toggleComplete(reminder.id)}
            >
              {reminder.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <CircleAlert className={cn("h-5 w-5", getPriorityColor(reminder.priority))} />
              )}
              <span className="sr-only">{reminder.completed ? "Mark as incomplete" : "Mark as complete"}</span>
            </Button>
            <div>
              <div className={cn("font-medium", reminder.completed && "line-through text-muted-foreground")}>
                {reminder.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                {new Date(reminder.dueDate).toLocaleDateString()}
                <span>${reminder.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Badge
            variant={reminder.completed ? "outline" : "default"}
            className={cn(!reminder.completed && "bg-primary", reminder.completed && "text-muted-foreground")}
          >
            {reminder.completed ? "Paid" : "Due"}
          </Badge>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        Add New Reminder
      </Button>
    </div>
  )
}
