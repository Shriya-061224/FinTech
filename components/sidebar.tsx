"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera, CreditCard, DollarSign, Home, ListTodo, Settings, TrendingUp, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAccessibility } from "./accessibility-provider"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Scan Receipts",
    href: "/scan",
    icon: Camera,
  },
  {
    title: "Budget",
    href: "/budget",
    icon: DollarSign,
  },
  {
    title: "Investments",
    href: "/investments",
    icon: TrendingUp,
  },
  {
    title: "To-Do List",
    href: "/todo",
    icon: ListTodo,
  },
  {
    title: "Tax Calculator",
    href: "/tax-calculator",
    icon: Calculator,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { settings } = useAccessibility()

  // Apply simplified UI if needed
  const items = settings.simplifiedUI
    ? sidebarItems.filter((item) => ["/dashboard", "/transactions", "/scan", "/budget", "/todo"].includes(item.href))
    : sidebarItems

  return (
    <div className={cn("flex h-full w-[240px] flex-col border-r bg-muted/40", settings.largeText && "w-[280px]")}>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                pathname === item.href && "bg-muted text-foreground",
                settings.highContrast && pathname === item.href && "bg-primary text-primary-foreground",
              )}
            >
              <item.icon className={cn("h-4 w-4", settings.largeText && "h-5 w-5")} />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
