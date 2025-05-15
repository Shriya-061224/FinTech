"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, DollarSign, TrendingDown, TrendingUp, Camera } from "lucide-react"
import Link from "next/link"
import { FinancialSummary } from "@/components/financial-summary"
import { RecentTransactions } from "@/components/recent-transactions"
import { BudgetOverview } from "@/components/budget-overview"
import { UpcomingReminders } from "@/components/upcoming-reminders"

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [financialGoals, setFinancialGoals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call to get user data
    // For this demo, we'll use localStorage
    const loadUserData = () => {
      try {
        const profileData = localStorage.getItem("userProfile")
        const goalsData = localStorage.getItem("financialGoals")

        if (profileData) {
          setUserData(JSON.parse(profileData))
        }

        if (goalsData) {
          setFinancialGoals(JSON.parse(goalsData))
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading user data:", error)
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Calculate total income
  const calculateTotalIncome = () => {
    if (!userData) return 0

    let total = Number(userData.primaryIncome) || 0

    if (userData.additionalIncomes && userData.additionalIncomes.length > 0) {
      userData.additionalIncomes.forEach((income: any) => {
        total += Number(income.amount) || 0
      })
    }

    return total
  }

  // Calculate total expenses (loans + estimated expenses)
  const calculateTotalExpenses = () => {
    if (!userData) return 0

    let total = 0

    // Add loan payments
    if (userData.loans && userData.loans.length > 0) {
      userData.loans.forEach((loan: any) => {
        total += Number(loan.monthlyPayment) || 0
      })
    }

    // Add estimated expenses (in a real app, this would be from actual transaction data)
    // For this demo, we'll estimate as 60% of income
    const estimatedExpenses = calculateTotalIncome() * 0.6

    return total + estimatedExpenses
  }

  // Calculate savings (income - expenses)
  const calculateSavings = () => {
    return calculateTotalIncome() - calculateTotalExpenses()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {isLoading ? "Loading..." : `Welcome, ${userData?.firstName || "User"}!`}
        </h1>
        <p className="text-muted-foreground">Here's an overview of your finances.</p>
      </div>

      <FinancialSummary />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${isLoading ? "0.00" : (calculateTotalIncome() - calculateTotalExpenses() + 5000).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${isLoading ? "0.00" : calculateTotalIncome().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+4.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${isLoading ? "0.00" : calculateTotalExpenses().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">-1.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${isLoading ? "0.00" : calculateSavings().toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+10.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <BudgetOverview className="col-span-4" />
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Reminders</CardTitle>
                <CardDescription>Your scheduled payments and tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingReminders />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Your monthly budget allocation</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <BudgetOverview />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Financial Goals</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialGoals.length === 0 ? (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm">You haven't set any financial goals yet.</p>
                </div>
              ) : (
                financialGoals.slice(0, 2).map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{goal.name}</div>
                      <div className="flex items-center text-green-500">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        15%
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Target: ${Number(goal.targetAmount).toLocaleString()}
                      {goal.targetDate && ` by ${new Date(goal.targetDate).toLocaleDateString()}`}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <Link href="/financial-goals">
                <Button variant="outline" className="w-full">
                  {financialGoals.length === 0 ? "Set Financial Goals" : "View All Goals"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/scan">
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="mr-2 h-4 w-4" />
                  Scan Receipt
                </Button>
              </Link>
              <Link href="/budget">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Update Budget
                </Button>
              </Link>
              <Link href="/todo">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isLoading && userData && (
                <>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      Based on your income of ${calculateTotalIncome().toFixed(2)}, you could increase your monthly
                      savings by ${(calculateTotalIncome() * 0.1).toFixed(2)} without impacting your lifestyle.
                    </p>
                  </div>
                  {userData.loans && userData.loans.length > 0 && (
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-sm">
                        You're spending {((calculateTotalExpenses() / calculateTotalIncome()) * 100).toFixed(0)}% of
                        your income on expenses. Consider reviewing your loan payments to reduce this ratio.
                      </p>
                    </div>
                  )}
                </>
              )}
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm">
                  Your utility bills are higher than seasonal averages. Check for ways to reduce energy consumption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
