"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Briefcase, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UserProfilePage() {
  const router = useRouter()
  const { toast } = useToast()

  // User profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    occupation: "",
    employmentType: "full-time",
    primaryIncome: "",
    incomeFrequency: "monthly",
    pocketMoney: "", // Added for unemployed users
  })

  // Show pocket money field when unemployed
  const [showPocketMoney, setShowPocketMoney] = useState(false)

  // Additional income sources
  const [additionalIncomes, setAdditionalIncomes] = useState<
    Array<{
      id: number
      source: string
      amount: string
      frequency: string
    }>
  >([])

  // New income source form
  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    frequency: "monthly",
  })

  // Taxes
  const [taxes, setTaxes] = useState<
    Array<{
      id: number
      type: string
      amount: string
      dueDate: string
      setReminder: boolean
    }>
  >([])

  // New tax form
  const [newTax, setNewTax] = useState({
    type: "",
    amount: "",
    dueDate: "",
    setReminder: true,
  })

  // Loans
  const [loans, setLoans] = useState<
    Array<{
      id: number
      type: string
      lender: string
      totalAmount: string
      monthlyPayment: string
      dueDate: string
      setReminder: boolean
    }>
  >([])

  // New loan form
  const [newLoan, setNewLoan] = useState({
    type: "",
    lender: "",
    totalAmount: "",
    monthlyPayment: "",
    dueDate: "",
    setReminder: true,
  })

  // Handle employment type change
  const handleEmploymentTypeChange = (value: string) => {
    setProfile({ ...profile, employmentType: value })
    setShowPocketMoney(value === "unemployed")
  }

  const handleAddIncome = () => {
    // Validate form
    if (!newIncome.source || !newIncome.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add new income source
    const newId = additionalIncomes.length > 0 ? Math.max(...additionalIncomes.map((i) => i.id)) + 1 : 1
    setAdditionalIncomes([
      ...additionalIncomes,
      {
        id: newId,
        ...newIncome,
      },
    ])

    // Reset form
    setNewIncome({
      source: "",
      amount: "",
      frequency: "monthly",
    })

    toast({
      title: "Income Added",
      description: "Your additional income source has been added",
    })
  }

  const handleDeleteIncome = (id: number) => {
    setAdditionalIncomes(additionalIncomes.filter((income) => income.id !== id))
  }

  const handleAddTax = () => {
    // Validate form
    if (!newTax.type || !newTax.amount || !newTax.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add new tax
    const newId = taxes.length > 0 ? Math.max(...taxes.map((t) => t.id)) + 1 : 1
    setTaxes([
      ...taxes,
      {
        id: newId,
        ...newTax,
      },
    ])

    // Reset form
    setNewTax({
      type: "",
      amount: "",
      dueDate: "",
      setReminder: true,
    })

    toast({
      title: "Tax Added",
      description: "Your tax information has been added",
    })
  }

  const handleDeleteTax = (id: number) => {
    setTaxes(taxes.filter((tax) => tax.id !== id))
  }

  const handleAddLoan = () => {
    // Validate form
    if (!newLoan.type || !newLoan.lender || !newLoan.totalAmount || !newLoan.monthlyPayment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add new loan
    const newId = loans.length > 0 ? Math.max(...loans.map((l) => l.id)) + 1 : 1
    setLoans([
      ...loans,
      {
        id: newId,
        ...newLoan,
      },
    ])

    // Reset form
    setNewLoan({
      type: "",
      lender: "",
      totalAmount: "",
      monthlyPayment: "",
      dueDate: "",
      setReminder: true,
    })

    toast({
      title: "Loan Added",
      description: "Your loan information has been added",
    })
  }

  const handleDeleteLoan = (id: number) => {
    setLoans(loans.filter((loan) => loan.id !== id))
  }

  const handleContinue = () => {
    // Validate basic profile
    if (!profile.firstName || !profile.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name",
        variant: "destructive",
      })
      return
    }

    // Validate income or pocket money based on employment status
    if (profile.employmentType === "unemployed") {
      if (!profile.pocketMoney) {
        toast({
          title: "Missing Information",
          description: "Please enter your pocket money amount",
          variant: "destructive",
        })
        return
      }
    } else if (!profile.primaryIncome) {
      toast({
        title: "Missing Information",
        description: "Please enter your primary income",
        variant: "destructive",
      })
      return
    }

    // Save profile data (in a real app, this would be stored in a database)
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...profile,
        additionalIncomes,
        taxes,
        loans,
      }),
    )

    toast({
      title: "Profile Saved",
      description: "Your profile information has been saved",
    })

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Briefcase className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Complete Your Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your financial situation to personalize your experience
          </p>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Provide your basic personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-of-birth">Date of Birth</Label>
                    <Input
                      id="date-of-birth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      placeholder="e.g., Software Engineer"
                      value={profile.occupation}
                      onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <RadioGroup
                      value={profile.employmentType}
                      onValueChange={handleEmploymentTypeChange}
                      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                    >
                      <div>
                        <RadioGroupItem value="full-time" id="full-time" className="peer sr-only" />
                        <Label
                          htmlFor="full-time"
                          className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <p className="text-sm font-medium">Full-time</p>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="part-time" id="part-time" className="peer sr-only" />
                        <Label
                          htmlFor="part-time"
                          className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <p className="text-sm font-medium">Part-time</p>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="self-employed" id="self-employed" className="peer sr-only" />
                        <Label
                          htmlFor="self-employed"
                          className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <p className="text-sm font-medium">Self-employed</p>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="unemployed" id="unemployed" className="peer sr-only" />
                        <Label
                          htmlFor="unemployed"
                          className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <p className="text-sm font-medium">Unemployed</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Pocket Money field for unemployed users */}
                  {showPocketMoney && (
                    <div className="space-y-2">
                      <Label htmlFor="pocket-money">Monthly Pocket Money</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id="pocket-money"
                          type="number"
                          placeholder="0.00"
                          className="pl-7"
                          value={profile.pocketMoney}
                          onChange={(e) => setProfile({ ...profile, pocketMoney: e.target.value })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Please enter the amount of pocket money or allowance you receive monthly
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Primary Income</CardTitle>
                <CardDescription>Information about your main source of income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="primary-income">Primary Income Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id="primary-income"
                          type="number"
                          placeholder="0.00"
                          className="pl-7"
                          value={profile.primaryIncome}
                          onChange={(e) => setProfile({ ...profile, primaryIncome: e.target.value })}
                          disabled={profile.employmentType === "unemployed"}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="income-frequency">Frequency</Label>
                      <Select
                        value={profile.incomeFrequency}
                        onValueChange={(value) => setProfile({ ...profile, incomeFrequency: value })}
                        disabled={profile.employmentType === "unemployed"}
                      >
                        <SelectTrigger id="income-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Income Sources</CardTitle>
                <CardDescription>Add any other sources of income you have</CardDescription>
              </CardHeader>
              <CardContent>
                {additionalIncomes.length === 0 ? (
                  <div className="flex h-20 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No additional income sources added</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {additionalIncomes.map((income) => (
                      <div key={income.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">{income.source}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${Number(income.amount).toLocaleString()} ({income.frequency})
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteIncome(income.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete income source</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid gap-4 rounded-lg border p-4">
                  <h3 className="text-sm font-medium">Add New Income Source</h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="income-source">Source</Label>
                      <Input
                        id="income-source"
                        placeholder="e.g., Part-time job, Investments"
                        value={newIncome.source}
                        onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="income-amount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id="income-amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-7"
                          value={newIncome.amount}
                          onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-income-frequency">Frequency</Label>
                    <Select
                      value={newIncome.frequency}
                      onValueChange={(value) => setNewIncome({ ...newIncome, frequency: value })}
                    >
                      <SelectTrigger id="new-income-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleAddIncome}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Income Source
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxes" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
                <CardDescription>Add information about taxes you need to pay</CardDescription>
              </CardHeader>
              <CardContent>
                {taxes.length === 0 ? (
                  <div className="flex h-20 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No tax information added</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {taxes.map((tax) => (
                      <div key={tax.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">{tax.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${Number(tax.amount).toLocaleString()} due on {new Date(tax.dueDate).toLocaleDateString()}
                          </p>
                          {tax.setReminder && <p className="mt-1 text-xs text-muted-foreground">Reminder set</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTax(tax.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete tax</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid gap-4 rounded-lg border p-4">
                  <h3 className="text-sm font-medium">Add New Tax</h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tax-type">Tax Type</Label>
                      <Input
                        id="tax-type"
                        placeholder="e.g., Income Tax, Property Tax"
                        value={newTax.type}
                        onChange={(e) => setNewTax({ ...newTax, type: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax-amount">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id="tax-amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-7"
                          value={newTax.amount}
                          onChange={(e) => setNewTax({ ...newTax, amount: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-due-date">Due Date</Label>
                    <Input
                      id="tax-due-date"
                      type="date"
                      value={newTax.dueDate}
                      onChange={(e) => setNewTax({ ...newTax, dueDate: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tax-reminder"
                      checked={newTax.setReminder}
                      onCheckedChange={(checked) => setNewTax({ ...newTax, setReminder: checked })}
                    />
                    <Label htmlFor="tax-reminder">Set reminder for this tax payment</Label>
                  </div>

                  <Button onClick={handleAddTax}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tax
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Loan Information</CardTitle>
                <CardDescription>Add information about your loans and debts</CardDescription>
              </CardHeader>
              <CardContent>
                {loans.length === 0 ? (
                  <div className="flex h-20 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No loan information added</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.map((loan) => (
                      <div key={loan.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">
                            {loan.type} - {loan.lender}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Total: ${Number(loan.totalAmount).toLocaleString()} | Monthly: $
                            {Number(loan.monthlyPayment).toLocaleString()}
                          </p>
                          {loan.dueDate && (
                            <p className="text-xs text-muted-foreground">
                              Due on day {loan.dueDate} of each month
                              {loan.setReminder && " (Reminder set)"}
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteLoan(loan.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete loan</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid gap-4 rounded-lg border p-4">
                  <h3 className="text-sm font-medium">Add New Loan</h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="loan-type">Loan Type</Label>
                      <Select value={newLoan.type} onValueChange={(value) => setNewLoan({ ...newLoan, type: value })}>
                        <SelectTrigger id="loan-type">
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mortgage">Mortgage</SelectItem>
                          <SelectItem value="Auto Loan">Auto Loan</SelectItem>
                          <SelectItem value="Student Loan">Student Loan</SelectItem>
                          <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loan-lender">Lender</Label>
                      <Input
                        id="loan-lender"
                        placeholder="e.g., Bank of America"
                        value={newLoan.lender}
                        onChange={(e) => setNewLoan({ ...newLoan, lender: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="loan-total">Total Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id="loan-total"
                          type="number"
                          placeholder="0.00"
                          className="pl-7"
                          value={newLoan.totalAmount}
                          onChange={(e) => setNewLoan({ ...newLoan, totalAmount: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loan-monthly">Monthly Payment</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id="loan-monthly"
                          type="number"
                          placeholder="0.00"
                          className="pl-7"
                          value={newLoan.monthlyPayment}
                          onChange={(e) => setNewLoan({ ...newLoan, monthlyPayment: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loan-due-date">Payment Due Date (day of month)</Label>
                    <Input
                      id="loan-due-date"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="e.g., 15"
                      value={newLoan.dueDate}
                      onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="loan-reminder"
                      checked={newLoan.setReminder}
                      onCheckedChange={(checked) => setNewLoan({ ...newLoan, setReminder: checked })}
                    />
                    <Label htmlFor="loan-reminder">Set reminder for this loan payment</Label>
                  </div>

                  <Button onClick={handleAddLoan}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Loan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Skip for now
          </Button>
          <Button onClick={handleContinue}>
            Continue to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
