"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { TransactionUpload } from "@/components/transaction-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrencyFormatter } from "@/components/currency-formatter"
import { Input } from "@/components/ui/input"
import { SearchIcon, FilterIcon, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Sample transaction data
const transactions = [
  {
    id: "t1",
    merchant: "Grocery Bazaar",
    amount: 1250.75,
    date: "2025-05-12",
    category: "Groceries",
    icon: "ShoppingBag",
    color: "bg-green-100",
  },
  {
    id: "t2",
    merchant: "Salary Deposit",
    amount: 45000.0,
    date: "2025-05-10",
    category: "Income",
    icon: "ArrowDown",
    color: "bg-blue-100",
  },
  {
    id: "t3",
    merchant: "Chai Point",
    amount: 120.5,
    date: "2025-05-09",
    category: "Food & Dining",
    icon: "Coffee",
    color: "bg-amber-100",
  },
  {
    id: "t4",
    merchant: "Jio Fiber",
    amount: 999.0,
    date: "2025-05-08",
    category: "Utilities",
    icon: "Wifi",
    color: "bg-purple-100",
  },
  {
    id: "t5",
    merchant: "Rent Payment",
    amount: 18000.0,
    date: "2025-05-05",
    category: "Housing",
    icon: "Home",
    color: "bg-red-100",
  },
  {
    id: "t6",
    merchant: "Indian Oil",
    amount: 1500.3,
    date: "2025-05-03",
    category: "Transportation",
    icon: "Car",
    color: "bg-yellow-100",
  },
  {
    id: "t7",
    merchant: "Apollo Pharmacy",
    amount: 850.75,
    date: "2025-05-02",
    category: "Health & Medical",
    icon: "Activity",
    color: "bg-pink-100",
  },
  {
    id: "t8",
    merchant: "PVR Cinemas",
    amount: 500.0,
    date: "2025-05-01",
    category: "Entertainment",
    icon: "Film",
    color: "bg-indigo-100",
  },
]

export default function TransactionsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Filter transactions based on search query, category, and active tab
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by search query
    const matchesSearch =
      transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by category
    const matchesCategory = categoryFilter ? transaction.category === categoryFilter : true

    // Filter by tab
    if (activeTab === "all") {
      return matchesSearch && matchesCategory
    } else if (activeTab === "income") {
      return matchesSearch && matchesCategory && transaction.amount > 0
    } else if (activeTab === "expenses") {
      return matchesSearch && matchesCategory && transaction.amount < 0
    } else {
      // Filter by category tab
      return matchesSearch && transaction.category.toLowerCase() === activeTab.toLowerCase()
    }
  })

  // Sort transactions by date
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(transactions.map((t) => t.category)))

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <h1 className="mb-6 text-3xl font-bold">Transactions</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="groceries">Groceries</TabsTrigger>
          <TabsTrigger value="food & dining">Food</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
          <TabsTrigger value="transportation">Transport</TabsTrigger>
        </TabsList>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  Filter
                  {categoryFilter && (
                    <Badge variant="secondary" className="ml-2">
                      1
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter By Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCategoryFilter(null)}>All Categories</DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {sortOrder === "desc" ? "Newest" : "Oldest"}
            </Button>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all"
                  ? "All Transactions"
                  : activeTab === "income"
                    ? "Income"
                    : activeTab === "expenses"
                      ? "Expenses"
                      : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Transactions`}
              </CardTitle>
              <CardDescription>
                {categoryFilter ? `Filtered by ${categoryFilter}` : `Showing ${sortedTransactions.length} transactions`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sortedTransactions.length === 0 ? (
                  <div className="flex h-20 flex-col items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                ) : (
                  sortedTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.color}`}>
                          <span className="text-sm">{transaction.icon.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{transaction.merchant}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString("en-IN")} · {transaction.category}
                          </div>
                        </div>
                      </div>
                      <div className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : ""}`}>
                        <CurrencyFormatter amount={transaction.amount} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Transaction</CardTitle>
            <CardDescription>Upload a receipt or enter transaction details manually</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionUpload />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
