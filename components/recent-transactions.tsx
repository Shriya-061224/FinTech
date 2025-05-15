"use client"

import { useState } from "react"
import { ArrowDownIcon, CarIcon, CoffeeIcon, HomeIcon, SearchIcon, ShoppingBagIcon, WifiIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const transactions = [
  {
    id: "t1",
    name: "Grocery Store",
    amount: -120.5,
    date: "2025-05-12",
    category: "Food",
    icon: ShoppingBagIcon,
    color: "bg-green-100",
  },
  {
    id: "t2",
    name: "Salary Deposit",
    amount: 3500.0,
    date: "2025-05-10",
    category: "Income",
    icon: ArrowDownIcon,
    color: "bg-blue-100",
  },
  {
    id: "t3",
    name: "Coffee Shop",
    amount: -4.5,
    date: "2025-05-09",
    category: "Food",
    icon: CoffeeIcon,
    color: "bg-amber-100",
  },
  {
    id: "t4",
    name: "Internet Bill",
    amount: -79.99,
    date: "2025-05-08",
    category: "Utilities",
    icon: WifiIcon,
    color: "bg-purple-100",
  },
  {
    id: "t5",
    name: "Rent Payment",
    amount: -1200.0,
    date: "2025-05-05",
    category: "Housing",
    icon: HomeIcon,
    color: "bg-red-100",
  },
  {
    id: "t6",
    name: "Gas Station",
    amount: -45.3,
    date: "2025-05-03",
    category: "Transportation",
    icon: CarIcon,
    color: "bg-yellow-100",
  },
]

export function RecentTransactions() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search transactions..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.color}`}>
                <transaction.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">{transaction.name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString()} · {transaction.category}
                </div>
              </div>
            </div>
            <div className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : ""}`}>
              {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline">View All Transactions</Button>
      </div>
    </div>
  )
}
