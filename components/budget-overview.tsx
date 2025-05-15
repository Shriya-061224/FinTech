"use client"

import { cn } from "@/lib/utils"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

const budgetData = [
  { category: "Housing", allocated: 1200, spent: 1200, color: "#ef4444" },
  { category: "Food", allocated: 500, spent: 450, color: "#f97316" },
  { category: "Transport", allocated: 350, spent: 300, color: "#eab308" },
  { category: "Utilities", allocated: 250, spent: 250, color: "#22c55e" },
  { category: "Entertainment", allocated: 300, spent: 200, color: "#3b82f6" },
  { category: "Shopping", allocated: 200, spent: 180, color: "#a855f7" },
  { category: "Healthcare", allocated: 150, spent: 50, color: "#ec4899" },
  { category: "Other", allocated: 250, spent: 240, color: "#6b7280" },
]

const pieData = budgetData.map((item) => ({
  name: item.category,
  value: item.allocated,
  color: item.color,
}))

export function BudgetOverview({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Monthly Budget Allocation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Budget vs. Spending</h3>
        <div className="space-y-4">
          {budgetData.map((item, index) => {
            const percentage = Math.round((item.spent / item.allocated) * 100)
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.category}</span>
                  </div>
                  <div className="text-muted-foreground">
                    ${item.spent} / ${item.allocated}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={percentage}
                    className="h-2"
                    indicatorClassName={percentage >= 100 ? "bg-red-500" : ""}
                  />
                  <span className="w-10 text-xs text-muted-foreground">{percentage}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
