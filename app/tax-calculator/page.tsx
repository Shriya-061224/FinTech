"use client"

import { useState } from "react"
import { Calculator, DollarSign, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TaxCalculatorPage() {
  const { toast } = useToast()
  const [isCalculating, setIsCalculating] = useState(false)
  const [activeTab, setActiveTab] = useState("income")

  // Income tax calculation
  const [incomeData, setIncomeData] = useState({
    annualIncome: "",
    filingStatus: "single",
    state: "CA",
    deductions: "standard",
    customDeduction: "",
  })

  // Sales tax calculation
  const [salesData, setSalesData] = useState({
    purchaseAmount: "",
    state: "CA",
    isEssential: false,
  })

  // Property tax calculation
  const [propertyData, setPropertyData] = useState({
    propertyValue: "",
    state: "CA",
    county: "",
  })

  // Tax results
  const [taxResults, setTaxResults] = useState<{
    federalTax: number
    stateTax: number
    totalTax: number
    effectiveRate: number
    breakdown: Array<{ name: string; amount: number; rate: number }>
  } | null>(null)

  const handleCalculateIncomeTax = () => {
    // Validate form
    if (!incomeData.annualIncome) {
      toast({
        title: "Missing Information",
        description: "Please enter your annual income",
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)

    // Simulate API call to Python backend for tax calculation
    setTimeout(() => {
      const income = Number.parseFloat(incomeData.annualIncome)

      // This is a simplified tax calculation for demonstration
      // In a real app, this would be calculated by a Python backend
      let federalTax = 0
      if (income <= 10000) {
        federalTax = income * 0.1
      } else if (income <= 40000) {
        federalTax = 1000 + (income - 10000) * 0.12
      } else if (income <= 85000) {
        federalTax = 4600 + (income - 40000) * 0.22
      } else if (income <= 165000) {
        federalTax = 14500 + (income - 85000) * 0.24
      } else if (income <= 210000) {
        federalTax = 33600 + (income - 165000) * 0.32
      } else if (income <= 520000) {
        federalTax = 47800 + (income - 210000) * 0.35
      } else {
        federalTax = 157000 + (income - 520000) * 0.37
      }

      // State tax calculation (simplified)
      const stateTaxRates: { [key: string]: number } = {
        CA: 0.093,
        NY: 0.085,
        TX: 0,
        FL: 0,
        IL: 0.0495,
      }

      const stateTax = income * stateTaxRates[incomeData.state]
      const totalTax = federalTax + stateTax
      const effectiveRate = (totalTax / income) * 100

      // Tax breakdown
      const breakdown = [
        { name: "Federal Income Tax", amount: federalTax, rate: (federalTax / income) * 100 },
        { name: "State Income Tax", amount: stateTax, rate: (stateTax / income) * 100 },
        { name: "Social Security", amount: income * 0.062, rate: 6.2 },
        { name: "Medicare", amount: income * 0.0145, rate: 1.45 },
      ]

      setTaxResults({
        federalTax,
        stateTax,
        totalTax,
        effectiveRate,
        breakdown,
      })

      setIsCalculating(false)

      toast({
        title: "Tax Calculation Complete",
        description: "Your estimated tax information has been calculated.",
      })
    }, 1500)
  }

  const handleCalculateSalesTax = () => {
    // Validate form
    if (!salesData.purchaseAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter the purchase amount",
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)

    // Simulate API call to Python backend for sales tax calculation
    setTimeout(() => {
      const amount = Number.parseFloat(salesData.purchaseAmount)

      // Sales tax rates by state (simplified)
      const salesTaxRates: { [key: string]: number } = {
        CA: 0.0725,
        NY: 0.045,
        TX: 0.0625,
        FL: 0.06,
        IL: 0.0625,
      }

      // Adjust for essential items (simplified)
      const adjustedRate = salesData.isEssential ? salesTaxRates[salesData.state] * 0.5 : salesTaxRates[salesData.state]

      const stateTax = amount * adjustedRate
      const totalTax = stateTax

      // Tax breakdown
      const breakdown = [{ name: "State Sales Tax", amount: stateTax, rate: adjustedRate * 100 }]

      setTaxResults({
        federalTax: 0,
        stateTax,
        totalTax,
        effectiveRate: (totalTax / amount) * 100,
        breakdown,
      })

      setIsCalculating(false)

      toast({
        title: "Sales Tax Calculation Complete",
        description: "Your estimated sales tax has been calculated.",
      })
    }, 1000)
  }

  const handleCalculatePropertyTax = () => {
    // Validate form
    if (!propertyData.propertyValue) {
      toast({
        title: "Missing Information",
        description: "Please enter the property value",
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)

    // Simulate API call to Python backend for property tax calculation
    setTimeout(() => {
      const value = Number.parseFloat(propertyData.propertyValue)

      // Property tax rates by state (simplified)
      const propertyTaxRates: { [key: string]: number } = {
        CA: 0.0077,
        NY: 0.0172,
        TX: 0.0181,
        FL: 0.0098,
        IL: 0.0227,
      }

      const stateTax = value * propertyTaxRates[propertyData.state]
      const totalTax = stateTax

      // Tax breakdown
      const breakdown = [{ name: "Property Tax", amount: stateTax, rate: propertyTaxRates[propertyData.state] * 100 }]

      setTaxResults({
        federalTax: 0,
        stateTax,
        totalTax,
        effectiveRate: (totalTax / value) * 100,
        breakdown,
      })

      setIsCalculating(false)

      toast({
        title: "Property Tax Calculation Complete",
        description: "Your estimated property tax has been calculated.",
      })
    }, 1000)
  }

  const handleCalculate = () => {
    if (activeTab === "income") {
      handleCalculateIncomeTax()
    } else if (activeTab === "sales") {
      handleCalculateSalesTax()
    } else if (activeTab === "property") {
      handleCalculatePropertyTax()
    }
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto max-w-4xl py-6">
        <h1 className="mb-6 text-3xl font-bold">Tax Calculator</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="income">Income Tax</TabsTrigger>
                <TabsTrigger value="sales">Sales Tax</TabsTrigger>
                <TabsTrigger value="property">Property Tax</TabsTrigger>
              </TabsList>

              <TabsContent value="income" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Income Tax Calculator</CardTitle>
                    <CardDescription>Calculate your estimated income tax</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="annual-income">Annual Income</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="annual-income"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          value={incomeData.annualIncome}
                          onChange={(e) => setIncomeData({ ...incomeData, annualIncome: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="filing-status">Filing Status</Label>
                        <Select
                          value={incomeData.filingStatus}
                          onValueChange={(value) => setIncomeData({ ...incomeData, filingStatus: value })}
                        >
                          <SelectTrigger id="filing-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                            <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                            <SelectItem value="head">Head of Household</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select
                          value={incomeData.state}
                          onValueChange={(value) => setIncomeData({ ...incomeData, state: value })}
                        >
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deductions">Deductions</Label>
                      <Select
                        value={incomeData.deductions}
                        onValueChange={(value) => setIncomeData({ ...incomeData, deductions: value })}
                      >
                        <SelectTrigger id="deductions">
                          <SelectValue placeholder="Select deduction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Deduction</SelectItem>
                          <SelectItem value="itemized">Itemized Deductions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {incomeData.deductions === "itemized" && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-deduction">Itemized Deduction Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="custom-deduction"
                            type="number"
                            placeholder="0.00"
                            className="pl-8"
                            value={incomeData.customDeduction}
                            onChange={(e) => setIncomeData({ ...incomeData, customDeduction: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sales" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Tax Calculator</CardTitle>
                    <CardDescription>Calculate sales tax for your purchases</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchase-amount">Purchase Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="purchase-amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          value={salesData.purchaseAmount}
                          onChange={(e) => setSalesData({ ...salesData, purchaseAmount: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sales-state">State</Label>
                      <Select
                        value={salesData.state}
                        onValueChange={(value) => setSalesData({ ...salesData, state: value })}
                      >
                        <SelectTrigger id="sales-state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="essential-items"
                        checked={salesData.isEssential}
                        onChange={(e) => setSalesData({ ...salesData, isEssential: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex items-center">
                        <Label htmlFor="essential-items">Essential Items</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[200px] text-xs">
                              Essential items like groceries, medicine, and certain necessities may have reduced tax
                              rates in some states.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="property" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Tax Calculator</CardTitle>
                    <CardDescription>Calculate estimated property taxes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="property-value">Property Value</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="property-value"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          value={propertyData.propertyValue}
                          onChange={(e) => setPropertyData({ ...propertyData, propertyValue: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="property-state">State</Label>
                        <Select
                          value={propertyData.state}
                          onValueChange={(value) => setPropertyData({ ...propertyData, state: value })}
                        >
                          <SelectTrigger id="property-state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="county">County (Optional)</Label>
                        <Input
                          id="county"
                          placeholder="e.g., Los Angeles"
                          value={propertyData.county}
                          onChange={(e) => setPropertyData({ ...propertyData, county: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Button onClick={handleCalculate} className="mt-4 w-full" disabled={isCalculating}>
              {isCalculating ? (
                <>Calculating...</>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Tax
                </>
              )}
            </Button>

            {isCalculating && <Progress value={50} className="mt-2" />}
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Tax Results</CardTitle>
                <CardDescription>Your estimated tax breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {taxResults ? (
                  <div className="space-y-6">
                    <div className="rounded-lg bg-muted p-4">
                      <div className="mb-2 text-lg font-bold">Total Tax: ${taxResults.totalTax.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        Effective Tax Rate: {taxResults.effectiveRate.toFixed(2)}%
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Tax Breakdown</h3>
                      {taxResults.breakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{
                                backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"][
                                  index % 6
                                ],
                              }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <div className="text-right">
                            <div>${item.amount.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">{item.rate.toFixed(2)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 text-sm font-medium">AI Tax Insights</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your{" "}
                        {activeTab === "income" ? "income" : activeTab === "sales" ? "purchase" : "property"} details,
                        our AI analysis suggests that you're paying a{" "}
                        {taxResults.effectiveRate > 25
                          ? "higher"
                          : taxResults.effectiveRate > 15
                            ? "moderate"
                            : "lower"}{" "}
                        tax rate compared to the national average.
                        {activeTab === "income" &&
                          taxResults.effectiveRate > 20 &&
                          " Consider maximizing retirement contributions to reduce your taxable income."}
                        {activeTab === "property" &&
                          " Property tax rates vary significantly by location. The national average is approximately 1.07%."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <Calculator className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No Tax Data Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Fill out the form and click "Calculate Tax" to see your tax breakdown
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
