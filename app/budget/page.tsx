"use client"

import { useState } from "react"
import { ArrowRight, Brain, Calculator, DollarSign, Edit2, Plus, Save, Sparkles, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { BudgetOverview } from "@/components/budget-overview"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data
const initialBudgetCategories = [
  { id: 1, name: "Housing", allocated: 1200, spent: 1200 },
  { id: 2, name: "Food", allocated: 500, spent: 450 },
  { id: 3, name: "Transport", allocated: 350, spent: 300 },
  { id: 4, name: "Utilities", allocated: 250, spent: 250 },
  { id: 5, name: "Entertainment", allocated: 300, spent: 200 },
  { id: 6, name: "Shopping", allocated: 200, spent: 180 },
  { id: 7, name: "Healthcare", allocated: 150, spent: 50 },
  { id: 8, name: "Other", allocated: 250, spent: 240 },
]

const incomeData = {
  salary: 3500,
  sideHustle: 400,
  investments: 100,
  other: 0,
}

export default function BudgetPage() {
  const { toast } = useToast()
  const [budgetCategories, setBudgetCategories] = useState(initialBudgetCategories)
  const [income, setIncome] = useState(incomeData)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryAmount, setNewCategoryAmount] = useState("")
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")

  const totalIncome = Object.values(income).reduce((sum, value) => sum + value, 0)
  const totalAllocated = budgetCategories.reduce((sum, category) => sum + category.allocated, 0)
  const totalSpent = budgetCategories.reduce((sum, category) => sum + category.spent, 0)
  const remaining = totalIncome - totalAllocated
  const allocationPercentage = Math.min(100, (totalAllocated / totalIncome) * 100)

  const handleIncomeChange = (key: keyof typeof incomeData, value: string) => {
    const numValue = value === "" ? 0 : Number.parseFloat(value)
    setIncome((prev) => ({ ...prev, [key]: numValue }))
  }

  const handleEditCategory = (id: number) => {
    const category = budgetCategories.find((cat) => cat.id === id)
    if (category) {
      setEditingCategory(id)
      setNewCategoryName(category.name)
      setNewCategoryAmount(category.allocated.toString())
    }
  }

  const handleSaveCategory = (id: number) => {
    setBudgetCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              name: newCategoryName,
              allocated: Number.parseFloat(newCategoryAmount) || 0,
            }
          : cat,
      ),
    )
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: number) => {
    setBudgetCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "" || !newCategoryAmount) {
      toast({
        title: "Error",
        description: "Please provide a name and amount for the new category.",
        variant: "destructive",
      })
      return
    }

    const newId = Math.max(0, ...budgetCategories.map((cat) => cat.id)) + 1
    setBudgetCategories((prev) => [
      ...prev,
      {
        id: newId,
        name: newCategoryName,
        allocated: Number.parseFloat(newCategoryAmount),
        spent: 0,
      },
    ])

    setNewCategoryName("")
    setNewCategoryAmount("")

    toast({
      title: "Category Added",
      description: `${newCategoryName} has been added to your budget.`,
    })
  }

  const generateAiBudget = async () => {
    setIsGeneratingBudget(true)

    try {
      // In a real app, we would use the AI SDK to generate a budget
      // For this demo, we'll simulate the response
      setTimeout(() => {
        const suggestion = `Based on your monthly income of $${totalIncome.toFixed(2)}, I recommend the following budget allocation:

- Housing: $${(totalIncome * 0.3).toFixed(2)} (30%)
- Food: $${(totalIncome * 0.15).toFixed(2)} (15%)
- Transportation: $${(totalIncome * 0.1).toFixed(2)} (10%)
- Utilities: $${(totalIncome * 0.08).toFixed(2)} (8%)
- Entertainment: $${(totalIncome * 0.07).toFixed(2)} (7%)
- Shopping: $${(totalIncome * 0.05).toFixed(2)} (5%)
- Healthcare: $${(totalIncome * 0.05).toFixed(2)} (5%)
- Savings: $${(totalIncome * 0.15).toFixed(2)} (15%)
- Other: $${(totalIncome * 0.05).toFixed(2)} (5%)

This follows the 50/30/20 rule with 50% for needs, 30% for wants, and 20% for savings and debt repayment. I've noticed you're currently spending more than recommended on Housing. Consider finding ways to reduce this expense to improve your financial health.`

        setAiSuggestion(suggestion)
        setIsGeneratingBudget(false)

        toast({
          title: "Budget Generated",
          description: "AI has generated a recommended budget based on your income.",
        })
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate budget recommendation. Please try again.",
        variant: "destructive",
      })
      setIsGeneratingBudget(false)
    }
  }

  const applyAiBudget = () => {
    // In a real app, we would parse the AI suggestion and apply it
    // For this demo, we'll use predefined values
    const newBudget = [
      { id: 1, name: "Housing", allocated: totalIncome * 0.3, spent: 1200 },
      { id: 2, name: "Food", allocated: totalIncome * 0.15, spent: 450 },
      { id: 3, name: "Transport", allocated: totalIncome * 0.1, spent: 300 },
      { id: 4, name: "Utilities", allocated: totalIncome * 0.08, spent: 250 },
      { id: 5, name: "Entertainment", allocated: totalIncome * 0.07, spent: 200 },
      { id: 6, name: "Shopping", allocated: totalIncome * 0.05, spent: 180 },
      { id: 7, name: "Healthcare", allocated: totalIncome * 0.05, spent: 50 },
      { id: 8, name: "Savings", allocated: totalIncome * 0.15, spent: 0 },
      { id: 9, name: "Other", allocated: totalIncome * 0.05, spent: 240 },
    ]

    setBudgetCategories(newBudget)

    toast({
      title: "Budget Applied",
      description: "The AI-recommended budget has been applied.",
    })
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <h1 className="mb-6 text-3xl font-bold">Budget Management</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
                <CardDescription>Your monthly budget allocation and spending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Income</span>
                    <span className="font-bold">${totalIncome.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Allocated</span>
                    <span className="font-bold">${totalAllocated.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Spent</span>
                    <span className="font-bold">${totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Remaining Unallocated</span>
                    <span className={`font-bold ${remaining < 0 ? "text-red-500" : "text-green-500"}`}>
                      ${remaining.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Budget Allocation</span>
                    <span className="text-sm">{allocationPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={allocationPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {remaining >= 0
                      ? `You have $${remaining.toFixed(2)} unallocated income`
                      : `You've over-allocated your budget by $${Math.abs(remaining).toFixed(2)}`}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get AI Budget Recommendation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>AI Budget Recommendation</DialogTitle>
                      <DialogDescription>
                        Our AI will analyze your income and spending patterns to suggest an optimal budget allocation.
                      </DialogDescription>
                    </DialogHeader>

                    {!aiSuggestion ? (
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                          The AI will consider your income of ${totalIncome.toFixed(2)} and current spending patterns to
                          create a personalized budget recommendation.
                        </p>

                        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                          <Brain className="h-5 w-5 text-primary" />
                          <p className="text-sm">
                            This uses financial best practices like the 50/30/20 rule and adjusts for your specific
                            situation.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-[300px] overflow-y-auto whitespace-pre-line rounded-md border p-4 text-sm">
                        {aiSuggestion}
                      </div>
                    )}

                    <DialogFooter>
                      {!aiSuggestion ? (
                        <Button onClick={generateAiBudget} disabled={isGeneratingBudget}>
                          {isGeneratingBudget ? (
                            <>Generating...</>
                          ) : (
                            <>
                              <Calculator className="mr-2 h-4 w-4" />
                              Generate Budget
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button onClick={applyAiBudget}>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Apply This Budget
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <BudgetOverview />
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <CardDescription>Manage your monthly income sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="salary"
                        type="number"
                        className="pl-8"
                        value={income.salary}
                        onChange={(e) => handleIncomeChange("salary", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sideHustle">Side Hustle</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="sideHustle"
                        type="number"
                        className="pl-8"
                        value={income.sideHustle}
                        onChange={(e) => handleIncomeChange("sideHustle", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investments">Investments</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="investments"
                        type="number"
                        className="pl-8"
                        value={income.investments}
                        onChange={(e) => handleIncomeChange("investments", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="other">Other Income</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="other"
                        type="number"
                        className="pl-8"
                        value={income.other}
                        onChange={(e) => handleIncomeChange("other", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Monthly Income</span>
                  <span className="text-xl font-bold">${totalIncome.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Manage your budget categories and allocations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {budgetCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between rounded-lg border p-3">
                    {editingCategory === category.id ? (
                      <>
                        <div className="flex flex-1 items-center gap-2">
                          <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="max-w-[200px]"
                          />
                          <div className="relative">
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={newCategoryAmount}
                              onChange={(e) => setNewCategoryAmount(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => handleSaveCategory(category.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ${category.spent.toFixed(2)} / ${category.allocated.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={(category.spent / category.allocated) * 100} className="h-2 w-[100px]" />
                          <Button size="sm" variant="ghost" onClick={() => handleEditCategory(category.id)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-sm font-medium">Add New Category</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newCategoryName">Category Name</Label>
                    <Input
                      id="newCategoryName"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Subscriptions"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newCategoryAmount">Allocated Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newCategoryAmount"
                        type="number"
                        className="pl-8"
                        value={newCategoryAmount}
                        onChange={(e) => setNewCategoryAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                <Button className="mt-4 w-full" onClick={handleAddCategory}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
