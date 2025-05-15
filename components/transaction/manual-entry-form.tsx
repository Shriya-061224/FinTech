"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ManualEntryForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transaction, setTransaction] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
  })

  const categories = [
    "Food & Dining",
    "Groceries",
    "Transportation",
    "Utilities",
    "Housing",
    "Entertainment",
    "Shopping",
    "Personal Care",
    "Health & Medical",
    "Education",
    "Travel",
    "Gifts & Donations",
    "Bills & Payments",
    "Investments",
    "Income",
    "Other",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!transaction.title || !transaction.amount || !transaction.date || !transaction.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call to Python backend for categorization
    setTimeout(() => {
      // In a real app, this would be an API call to a Python backend
      toast({
        title: "Transaction Added",
        description: "Your transaction has been added and categorized",
      })

      // Reset form
      setTransaction({
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        description: "",
      })

      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Transaction Title</Label>
          <Input
            id="title"
            placeholder="e.g., Grocery Shopping, Rent Payment"
            value={transaction.title}
            onChange={(e) => setTransaction({ ...transaction, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-8"
              value={transaction.amount}
              onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="date"
              type="date"
              className="pl-8"
              value={transaction.date}
              onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={transaction.category}
            onValueChange={(value) => setTransaction({ ...transaction, category: value })}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Our AI will suggest a category based on the transaction details
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add any additional details about this transaction"
          value={transaction.description}
          onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding Transaction..." : "Add Transaction"}
      </Button>
    </form>
  )
}
