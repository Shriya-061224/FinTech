"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Car, GraduationCap, Home, Plus, Target, Trash2, Umbrella } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function FinancialGoalsPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Financial goals state
  const [goals, setGoals] = useState<
    Array<{
      id: number
      type: string
      name: string
      targetAmount: string
      targetDate: string
      description: string
      icon: string
    }>
  >([])

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    type: "",
    name: "",
    targetAmount: "",
    targetDate: "",
    description: "",
  })

  // Predefined goal types with icons
  const goalTypes = [
    { value: "home", label: "Home Purchase", icon: "Home" },
    { value: "car", label: "Vehicle", icon: "Car" },
    { value: "education", label: "Education", icon: "GraduationCap" },
    { value: "emergency", label: "Emergency Fund", icon: "Umbrella" },
    { value: "custom", label: "Custom Goal", icon: "Target" },
  ]

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5" />
      case "car":
        return <Car className="h-5 w-5" />
      case "education":
        return <GraduationCap className="h-5 w-5" />
      case "emergency":
        return <Umbrella className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const handleAddGoal = () => {
    // Validate form
    if (!newGoal.type || !newGoal.name || !newGoal.targetAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add new goal
    const newId = goals.length > 0 ? Math.max(...goals.map((g) => g.id)) + 1 : 1
    setGoals([
      ...goals,
      {
        id: newId,
        ...newGoal,
        icon: newGoal.type,
      },
    ])

    // Reset form
    setNewGoal({
      type: "",
      name: "",
      targetAmount: "",
      targetDate: "",
      description: "",
    })

    toast({
      title: "Goal Added",
      description: "Your financial goal has been added",
    })
  }

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id))

    toast({
      title: "Goal Removed",
      description: "Your financial goal has been removed",
    })
  }

  const handleContinue = () => {
    // Save goals (in a real app, this would be stored in a database)
    localStorage.setItem("financialGoals", JSON.stringify(goals))

    // Redirect to user profile page
    router.push("/user-profile")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Set Your Financial Goals</h1>
          <p className="mt-2 text-muted-foreground">
            Define what you're saving for to help us personalize your experience
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Financial Goals</CardTitle>
            <CardDescription>Add goals you want to save for, like a home, car, or emergency fund</CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">You haven't added any goals yet</p>
                <p className="text-sm text-muted-foreground">Add your first financial goal below</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-start justify-between rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {getGoalIcon(goal.icon)}
                      </div>
                      <div>
                        <h3 className="font-medium">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${Number(goal.targetAmount).toLocaleString()}
                          {goal.targetDate && ` by ${new Date(goal.targetDate).toLocaleDateString()}`}
                        </p>
                        {goal.description && <p className="mt-1 text-sm">{goal.description}</p>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete goal</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add a New Goal</CardTitle>
            <CardDescription>What are you saving for? Add details about your financial goal.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Goal Type</Label>
                <RadioGroup
                  value={newGoal.type}
                  onValueChange={(value) => setNewGoal({ ...newGoal, type: value })}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                >
                  {goalTypes.map((type) => (
                    <div key={type.value}>
                      <RadioGroupItem value={type.value} id={`goal-type-${type.value}`} className="peer sr-only" />
                      <Label
                        htmlFor={`goal-type-${type.value}`}
                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        {getGoalIcon(type.value)}
                        <p className="mt-2 text-sm font-medium">{type.label}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="goal-name">Goal Name</Label>
                  <Input
                    id="goal-name"
                    placeholder="e.g., Down payment for house"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-amount">Target Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="target-amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-date">Target Date (Optional)</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details about your goal"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddGoal} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={() => router.push("/user-profile")}>
            Skip for now
          </Button>
          <Button onClick={handleContinue}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
