"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Info,
  PieChart,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Pie,
  Cell,
} from "@/components/ui/chart"
import { Check } from "lucide-react"

// Mock data
const stockRecommendations = [
  {
    id: 1,
    name: "Tech Growth ETF",
    ticker: "TGRO",
    price: 142.35,
    change: 2.4,
    marketCap: "Large Cap",
    risk: "Medium",
    category: "Technology",
    recommendation: "Buy",
    description:
      "A diversified ETF focusing on high-growth technology companies with strong fundamentals and innovative products.",
  },
  {
    id: 2,
    name: "Sustainable Energy Fund",
    ticker: "SENR",
    price: 78.92,
    change: 1.2,
    marketCap: "Mid Cap",
    risk: "Medium",
    category: "Energy",
    recommendation: "Buy",
    description: "Invests in companies developing renewable energy solutions and sustainable technologies.",
  },
  {
    id: 3,
    name: "Healthcare Innovation",
    ticker: "HLTH",
    price: 112.45,
    change: -0.8,
    marketCap: "Large Cap",
    risk: "Low",
    category: "Healthcare",
    recommendation: "Hold",
    description: "Focuses on companies developing breakthrough medical technologies and treatments.",
  },
  {
    id: 4,
    name: "Financial Services Select",
    ticker: "FSVS",
    price: 65.3,
    change: 0.5,
    marketCap: "Large Cap",
    risk: "Low",
    category: "Financial",
    recommendation: "Hold",
    description: "A collection of established financial institutions with stable dividend histories.",
  },
  {
    id: 5,
    name: "Emerging Markets Fund",
    ticker: "EMKT",
    price: 42.18,
    change: -1.5,
    marketCap: "Mid Cap",
    risk: "High",
    category: "International",
    recommendation: "Buy",
    description: "Provides exposure to high-growth potential markets in developing economies.",
  },
  {
    id: 6,
    name: "Dividend Aristocrats",
    ticker: "DIVD",
    price: 89.75,
    change: 0.3,
    marketCap: "Large Cap",
    risk: "Low",
    category: "Dividend",
    recommendation: "Buy",
    description:
      "Companies with a history of consistently increasing dividend payments for at least 25 consecutive years.",
  },
]

const cryptoRecommendations = [
  {
    id: 1,
    name: "Bitcoin",
    ticker: "BTC",
    price: 42568.35,
    change: 3.2,
    marketCap: "$825B",
    risk: "High",
    category: "Currency",
    recommendation: "Hold",
    description: "The original cryptocurrency and largest by market capitalization.",
  },
  {
    id: 2,
    name: "Ethereum",
    ticker: "ETH",
    price: 2345.67,
    change: 4.5,
    marketCap: "$280B",
    risk: "High",
    category: "Smart Contract Platform",
    recommendation: "Buy",
    description: "A decentralized platform that enables smart contracts and decentralized applications.",
  },
  {
    id: 3,
    name: "Solana",
    ticker: "SOL",
    price: 98.76,
    change: -2.1,
    marketCap: "$42B",
    risk: "Very High",
    category: "Smart Contract Platform",
    recommendation: "Hold",
    description: "A high-performance blockchain supporting fast, secure, and scalable decentralized apps.",
  },
  {
    id: 4,
    name: "Cardano",
    ticker: "ADA",
    price: 0.45,
    change: 1.8,
    marketCap: "$15B",
    risk: "High",
    category: "Smart Contract Platform",
    recommendation: "Buy",
    description: "A proof-of-stake blockchain platform with a research-driven approach.",
  },
]

const portfolioData = [
  { name: "Tech Growth ETF", value: 3500, allocation: 35 },
  { name: "Sustainable Energy Fund", value: 2000, allocation: 20 },
  { name: "Bitcoin", value: 1500, allocation: 15 },
  { name: "Ethereum", value: 1000, allocation: 10 },
  { name: "Healthcare Innovation", value: 1000, allocation: 10 },
  { name: "Dividend Aristocrats", value: 1000, allocation: 10 },
]

const performanceData = [
  { month: "Jan", value: 10000 },
  { month: "Feb", value: 10200 },
  { month: "Mar", value: 10150 },
  { month: "Apr", value: 10400 },
  { month: "May", value: 10600 },
  { month: "Jun", value: 10550 },
  { month: "Jul", value: 10800 },
  { month: "Aug", value: 11000 },
  { month: "Sep", value: 10900 },
  { month: "Oct", value: 11200 },
  { month: "Nov", value: 11500 },
  { month: "Dec", value: 12000 },
]

// Wrap the entire component with TooltipProvider
export default function InvestmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedStock, setExpandedStock] = useState<number | null>(null)
  const [expandedCrypto, setExpandedCrypto] = useState<number | null>(null)

  const filterStocks = (stock: (typeof stockRecommendations)[0]) => {
    const matchesSearch =
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRisk = selectedRisk ? stock.risk === selectedRisk : true
    const matchesCategory = selectedCategory ? stock.category === selectedCategory : true

    return matchesSearch && matchesRisk && matchesCategory
  }

  const filterCrypto = (crypto: (typeof cryptoRecommendations)[0]) => {
    const matchesSearch =
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRisk = selectedRisk ? crypto.risk === selectedRisk : true
    const matchesCategory = selectedCategory ? crypto.category === selectedCategory : true

    return matchesSearch && matchesRisk && matchesCategory
  }

  const filteredStocks = stockRecommendations.filter(filterStocks)
  const filteredCrypto = cryptoRecommendations.filter(filterCrypto)

  const resetFilters = () => {
    setSelectedRisk(null)
    setSelectedCategory(null)
  }

  const toggleStockExpand = (id: number) => {
    setExpandedStock(expandedStock === id ? null : id)
  }

  const toggleCryptoExpand = (id: number) => {
    setExpandedCrypto(expandedCrypto === id ? null : id)
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "Buy":
        return "bg-green-500"
      case "Hold":
        return "bg-amber-500"
      case "Sell":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto max-w-4xl py-6">
        <h1 className="mb-6 text-3xl font-bold">Investment Recommendations</h1>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Portfolio</TabsTrigger>
            <TabsTrigger value="stocks">Stocks & ETFs</TabsTrigger>
            <TabsTrigger value="crypto">Cryptocurrencies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                  <CardDescription>Current distribution of your investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                          data={portfolioData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {portfolioData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"][index % 6]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>12-month performance history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full rounded-lg bg-muted p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Return</span>
                      <div className="flex items-center text-green-500">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span className="font-bold">+20.0%</span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Holdings</CardTitle>
                <CardDescription>Your current investment assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.map((holding, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-full"
                          style={{
                            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"][
                              index % 6
                            ],
                          }}
                        />
                        <div>
                          <div className="font-medium">{holding.name}</div>
                          <div className="text-xs text-muted-foreground">{holding.allocation}% of portfolio</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${holding.value.toLocaleString()}</div>
                        <div className="flex items-center justify-end text-xs text-green-500">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          +4.2%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stocks" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stocks and ETFs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      {(selectedRisk || selectedCategory) && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                          {(selectedRisk ? 1 : 0) + (selectedCategory ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      Risk Level
                    </DropdownMenuLabel>
                    {["Low", "Medium", "High"].map((risk) => (
                      <DropdownMenuItem
                        key={risk}
                        className="flex items-center justify-between"
                        onClick={() => setSelectedRisk(selectedRisk === risk ? null : risk)}
                      >
                        {risk}
                        {selectedRisk === risk && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      Category
                    </DropdownMenuLabel>
                    {["Technology", "Energy", "Healthcare", "Financial", "International", "Dividend"].map(
                      (category) => (
                        <DropdownMenuItem
                          key={category}
                          className="flex items-center justify-between"
                          onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                        >
                          {category}
                          {selectedCategory === category && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                      ),
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="justify-center text-center font-medium" onClick={resetFilters}>
                      Reset Filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-4">
              {filteredStocks.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No stocks match your filters</p>
                  <Button variant="link" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredStocks.map((stock) => (
                  <Card key={stock.id}>
                    <CardHeader className="cursor-pointer" onClick={() => toggleStockExpand(stock.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="font-bold">{stock.name}</div>
                          <Badge variant="outline">{stock.ticker}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-bold">${stock.price.toFixed(2)}</div>
                            <div
                              className={`flex items-center text-xs ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {stock.change >= 0 ? (
                                <TrendingUp className="mr-1 h-3 w-3" />
                              ) : (
                                <TrendingDown className="mr-1 h-3 w-3" />
                              )}
                              {stock.change >= 0 ? "+" : ""}
                              {stock.change}%
                            </div>
                          </div>
                          {expandedStock === stock.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {expandedStock === stock.id && (
                      <>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Market Cap</div>
                              <div className="font-medium">{stock.marketCap}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Risk Level</div>
                              <div className="font-medium">{stock.risk}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Category</div>
                              <div className="font-medium">{stock.category}</div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <div className="text-sm font-medium">Recommendation</div>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-[200px] text-xs">
                                    Based on AI analysis of market trends, company fundamentals, and your risk profile.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${getRecommendationColor(stock.recommendation)}`} />
                              <div className="font-medium">{stock.recommendation}</div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm font-medium">Description</div>
                            <p className="text-sm text-muted-foreground">{stock.description}</p>
                          </div>

                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart
                                data={[
                                  { month: "Jan", price: stock.price * 0.9 },
                                  { month: "Feb", price: stock.price * 0.95 },
                                  { month: "Mar", price: stock.price * 0.93 },
                                  { month: "Apr", price: stock.price * 0.97 },
                                  { month: "May", price: stock.price * 1.0 },
                                  { month: "Jun", price: stock.price * 1.02 },
                                  { month: "Jul", price: stock.price * 1.01 },
                                  { month: "Aug", price: stock.price * 1.03 },
                                  { month: "Sep", price: stock.price * 1.02 },
                                  { month: "Oct", price: stock.price * 1.04 },
                                  { month: "Nov", price: stock.price * 1.03 },
                                  { month: "Dec", price: stock.price },
                                ]}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={["auto", "auto"]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                              </RechartsLineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>

                        <CardFooter>
                          <Button className="w-full">
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Add to Watchlist
                          </Button>
                        </CardFooter>
                      </>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search cryptocurrencies..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      {(selectedRisk || selectedCategory) && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                          {(selectedRisk ? 1 : 0) + (selectedCategory ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      Risk Level
                    </DropdownMenuLabel>
                    {["High", "Very High"].map((risk) => (
                      <DropdownMenuItem
                        key={risk}
                        className="flex items-center justify-between"
                        onClick={() => setSelectedRisk(selectedRisk === risk ? null : risk)}
                      >
                        {risk}
                        {selectedRisk === risk && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      Category
                    </DropdownMenuLabel>
                    {["Currency", "Smart Contract Platform"].map((category) => (
                      <DropdownMenuItem
                        key={category}
                        className="flex items-center justify-between"
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      >
                        {category}
                        {selectedCategory === category && <Check className="h-4 w-4" />}
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="justify-center text-center font-medium" onClick={resetFilters}>
                      Reset Filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-4">
              {filteredCrypto.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No cryptocurrencies match your filters</p>
                  <Button variant="link" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredCrypto.map((crypto) => (
                  <Card key={crypto.id}>
                    <CardHeader className="cursor-pointer" onClick={() => toggleCryptoExpand(crypto.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="font-bold">{crypto.name}</div>
                          <Badge variant="outline">{crypto.ticker}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-bold">${crypto.price.toFixed(2)}</div>
                            <div
                              className={`flex items-center text-xs ${crypto.change >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {crypto.change >= 0 ? (
                                <TrendingUp className="mr-1 h-3 w-3" />
                              ) : (
                                <TrendingDown className="mr-1 h-3 w-3" />
                              )}
                              {crypto.change >= 0 ? "+" : ""}
                              {crypto.change}%
                            </div>
                          </div>
                          {expandedCrypto === crypto.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {expandedCrypto === crypto.id && (
                      <>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Market Cap</div>
                              <div className="font-medium">{crypto.marketCap}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Risk Level</div>
                              <div className="font-medium">{crypto.risk}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Category</div>
                              <div className="font-medium">{crypto.category}</div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <div className="text-sm font-medium">Recommendation</div>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-[200px] text-xs">
                                    Based on AI analysis of market trends, technical indicators, and your risk profile.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${getRecommendationColor(crypto.recommendation)}`}
                              />
                              <div className="font-medium">{crypto.recommendation}</div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm font-medium">Description</div>
                            <p className="text-sm text-muted-foreground">{crypto.description}</p>
                          </div>

                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart
                                data={[
                                  { month: "Jan", price: crypto.price * 0.8 },
                                  { month: "Feb", price: crypto.price * 0.9 },
                                  { month: "Mar", price: crypto.price * 0.85 },
                                  { month: "Apr", price: crypto.price * 0.95 },
                                  { month: "May", price: crypto.price * 1.1 },
                                  { month: "Jun", price: crypto.price * 1.05 },
                                  { month: "Jul", price: crypto.price * 0.9 },
                                  { month: "Aug", price: crypto.price * 1.2 },
                                  { month: "Sep", price: crypto.price * 1.1 },
                                  { month: "Oct", price: crypto.price * 0.95 },
                                  { month: "Nov", price: crypto.price * 1.15 },
                                  { month: "Dec", price: crypto.price },
                                ]}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={["auto", "auto"]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} dot={false} />
                              </RechartsLineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>

                        <CardFooter>
                          <Button className="w-full">
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Add to Watchlist
                          </Button>
                        </CardFooter>
                      </>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
