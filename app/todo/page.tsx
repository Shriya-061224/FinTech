"use client"

import { useState } from "react"
import { Filter, Plus, Trash2, Bell, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export default function TodoPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<
    Array<{
      id: number
      title: string
      dueDate: string
      amount: number | null
      category: string
      priority: string
      completed: boolean
      notes: string
      reminder: {
        enabled: boolean
        type: "notification" | "email"
        time: string
      }
    }>
  >([
    {
      id: 1,
      title: "Pay Credit Card Bill",
      dueDate: "2025-05-18",
      amount: 450.75,
      category: "Bills",
      priority: "high",
      completed: false,
      notes: "Chase Sapphire card, due on the 18th of every month",
      reminder: {
        enabled: true,
        type: "notification",
        time: "2025-05-17T09:00",
      },
    },
    {
      id: 2,
      title: "Electricity Bill",
      dueDate: "2025-05-22",
      amount: 85.3,
      category: "Bills",
      priority: "medium",
      completed: false,
      notes: "City Power & Light, account #12345",
      reminder: {
        enabled: true,
        type: "email",
        time: "2025-05-21T10:00",
      },
    },
  ])

  const [filter, setFilter] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [showCompleted, setShowCompleted] = useState(true)
  const [isAddingTask, setIsAddingTask] = useState(false)

  // New task form
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    amount: "",
    category: "",
    priority: "medium",
    notes: "",
    reminder: {
      enabled: false,
      type: "notification" as "notification" | "email",
      time: "",
    },
  })

  const categories = Array.from(new Set(tasks.map((task) => task.category)))

  const filteredTasks = tasks.filter((task) => {
    if (!showCompleted && task.completed) return false
    if (filter && task.priority !== filter) return false
    if (categoryFilter && task.category !== categoryFilter) return false
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Then sort by due date
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    return dateA - dateB
  })

  const handleToggleComplete = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
    toast({
      title: "Task Deleted",
      description: "The task has been removed from your list.",
    })
  }

  const handleAddTask = () => {
    // Validate form
    if (!newTask.title.trim() || !newTask.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1

    setTasks((prev) => [
      ...prev,
      {
        id: newId,
        title: newTask.title,
        dueDate: newTask.dueDate,
        amount: newTask.amount ? Number.parseFloat(newTask.amount) : null,
        category: newTask.category,
        priority: newTask.priority,
        completed: false,
        notes: newTask.notes,
        reminder: newTask.reminder,
      },
    ])

    // Reset form
    setNewTask({
      title: "",
      dueDate: "",
      amount: "",
      category: "",
      priority: "medium",
      notes: "",
      reminder: {
        enabled: false,
        type: "notification",
        time: "",
      },
    })

    setIsAddingTask(false)

    // Show success message
    if (newTask.reminder.enabled) {
      toast({
        title: "Task Added with Reminder",
        description: `Reminder ${newTask.reminder.type === "email" ? "email" : "notification"} has been scheduled.`,
      })
    } else {
      toast({
        title: "Task Added",
        description: "New task has been added to your list.",
      })
    }
  }

  const resetFilters = () => {
    setFilter(null)
    setCategoryFilter(null)
    setShowCompleted(true)
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>
      case "low":
        return <Badge className="bg-green-500">Low</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <h1 className="mb-6 text-3xl font-bold">To-Do List & Reminders</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {(filter || categoryFilter || !showCompleted) && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {(filter ? 1 : 0) + (categoryFilter ? 1 : 0) + (!showCompleted ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Priority</DropdownMenuLabel>
              {["high", "medium", "low"].map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  className="flex items-center justify-between"
                  onClick={() => setFilter(filter === priority ? null : priority)}
                >
                  <span className={getPriorityColor(priority)}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                  {filter === priority && <Checkbox checked />}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Category</DropdownMenuLabel>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  className="flex items-center justify-between"
                  onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
                >
                  {category}
                  {categoryFilter === category && <Checkbox checked />}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="flex items-center justify-between"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                Show Completed
                <Checkbox checked={showCompleted} />
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="justify-center text-center font-medium" onClick={resetFilters}>
                Reset Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>Create a new task or reminder for your financial to-do list.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g., Pay Rent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (if applicable)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="amount"
                        type="number"
                        className="pl-8"
                        value={newTask.amount}
                        onChange={(e) => setNewTask({ ...newTask, amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      placeholder="e.g., Bills, Taxes"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    placeholder="Add any additional notes"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reminder-toggle"
                      checked={newTask.reminder.enabled}
                      onCheckedChange={(checked) =>
                        setNewTask({
                          ...newTask,
                          reminder: {
                            ...newTask.reminder,
                            enabled: checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="reminder-toggle">Set Reminder</Label>
                  </div>

                  {newTask.reminder.enabled && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="reminder-type">Reminder Type</Label>
                        <RadioGroup
                          value={newTask.reminder.type}
                          onValueChange={(value: "notification" | "email") =>
                            setNewTask({
                              ...newTask,
                              reminder: {
                                ...newTask.reminder,
                                type: value,
                              },
                            })
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="notification" id="notification" />
                            <Label htmlFor="notification" className="flex items-center">
                              <Bell className="mr-2 h-4 w-4" />
                              Notification
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email" />
                            <Label htmlFor="email" className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              Email
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reminder-time">Reminder Time</Label>
                        <Input
                          id="reminder-time"
                          type="datetime-local"
                          value={newTask.reminder.time}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              reminder: {
                                ...newTask.reminder,
                                time: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Add Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>Manage your financial tasks and reminders</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedTasks.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No tasks found</p>
              <p className="text-sm text-muted-foreground">
                {filter || categoryFilter || !showCompleted
                  ? "Try adjusting your filters"
                  : "Add your first task using the button above"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start justify-between rounded-lg border p-4 ${
                    task.completed ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleComplete(task.id)}
                      className="mt-1"
                    />
                    <div>
                      <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {task.amount && (
                          <span className="text-xs text-muted-foreground">${task.amount.toFixed(2)}</span>
                        )}
                        {task.category && (
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                        )}
                        {getPriorityBadge(task.priority)}
                        {task.reminder.enabled && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            {task.reminder.type === "email" ? (
                              <Mail className="h-3 w-3" />
                            ) : (
                              <Bell className="h-3 w-3" />
                            )}
                            Reminder
                          </Badge>
                        )}
                      </div>
                      {task.notes && <p className="mt-1 text-sm text-muted-foreground">{task.notes}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
