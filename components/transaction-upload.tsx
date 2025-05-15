"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Check, FileText, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CurrencyFormatter } from "@/components/currency-formatter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TransactionUpload() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("camera")
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [scanResult, setScanResult] = useState<null | {
    merchant: string
    date: string
    total: number
    category: string
    receipt_type: string
    items: Array<{ name: string; price: number }>
  }>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, we would read the file
      // For this demo, we'll use a placeholder
      setImage("/placeholder.svg?height=400&width=300")
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const startCamera = async () => {
    try {
      // In a real app, we would access the camera
      // For this demo, we'll use a placeholder
      setActiveTab("camera")
      toast({
        title: "Camera Simulation",
        description: "In a real app, this would access your camera. For this demo, we'll use a placeholder.",
      })
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please try uploading an image instead.",
        variant: "destructive",
      })
    }
  }

  const captureImage = () => {
    // In a real app, we would capture from the video stream
    // For this demo, we'll use a placeholder image
    setImage("/placeholder.svg?height=400&width=300")
  }

  const resetImage = () => {
    setImage(null)
    setScanResult(null)
    setProcessProgress(0)
  }

  const processReceipt = () => {
    setIsProcessing(true)
    setProcessProgress(0)

    // Simulate OCR processing with progress updates
    const interval = setInterval(() => {
      setProcessProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          // Simulate OCR result - in a real app, this would come from our Python backend
          setScanResult({
            merchant: "Grocery Bazaar",
            date: "2025-05-10",
            total: 1250.75,
            category: "Groceries",
            receipt_type: "Grocery",
            items: [
              { name: "Rice (5kg)", price: 350.0 },
              { name: "Toor Dal (1kg)", price: 180.5 },
              { name: "Cooking Oil (1L)", price: 220.0 },
              { name: "Milk (1L)", price: 65.0 },
              { name: "Bread", price: 45.0 },
              { name: "Vegetables", price: 250.0 },
              { name: "Spices", price: 140.25 },
            ],
          })

          toast({
            title: "Receipt Processed",
            description: "Receipt has been successfully analyzed using OCR technology.",
          })
        }
        return newProgress
      })
    }, 300)
  }

  const saveToTransactions = () => {
    if (!scanResult) return

    toast({
      title: "Receipt Saved",
      description: "Receipt has been added to your transactions and automatically categorized.",
    })

    // In a real app, we would save this data to the database
    resetImage()
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="camera" onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="manual">
            <FileText className="mr-2 h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="camera" className="mt-0">
            {!image ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-4 h-[400px] w-full max-w-[300px] overflow-hidden rounded-lg border bg-muted">
                  {/* In a real app, this would be a video stream */}
                  <div className="flex h-full w-full items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <video ref={videoRef} className="hidden h-full w-full object-cover" autoPlay playsInline />
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex w-full max-w-[300px] flex-col gap-2">
                  <Button onClick={captureImage} className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Receipt
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 h-auto max-h-[400px] w-full max-w-[300px] overflow-hidden rounded-lg border">
                    <img src={image || "/placeholder.svg"} alt="Receipt" className="h-full w-full object-contain" />
                    <Button variant="destructive" size="icon" className="absolute right-2 top-2" onClick={resetImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {!scanResult && (
                    <div className="w-full max-w-[300px]">
                      {isProcessing ? (
                        <div className="space-y-2">
                          <Progress value={processProgress} className="h-2 w-full" />
                          <p className="text-center text-sm text-muted-foreground">
                            Processing receipt with OCR... {processProgress}%
                          </p>
                        </div>
                      ) : (
                        <Button className="w-full" onClick={processReceipt}>
                          <FileText className="mr-2 h-4 w-4" />
                          Process Receipt
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {scanResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="merchant">Merchant</Label>
                        <Input id="merchant" value={scanResult.merchant} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={scanResult.date} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="total">Total Amount</Label>
                        <Input id="total" value={`₹${scanResult.total.toFixed(2)}`} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select defaultValue={scanResult.category}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Groceries">Groceries</SelectItem>
                            <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                            <SelectItem value="Transportation">Transportation</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Shopping">Shopping</SelectItem>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Health & Medical">Health & Medical</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Items</Label>
                      <div className="max-h-[200px] overflow-y-auto rounded-md border p-2">
                        {scanResult.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between border-b py-2 last:border-0">
                            <span>{item.name}</span>
                            <CurrencyFormatter amount={item.price} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Add any notes about this receipt..." />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={resetImage}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button onClick={saveToTransactions}>
                        <Check className="mr-2 h-4 w-4" />
                        Save to Transactions
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            {!image ? (
              <div
                className="flex h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-6 text-center"
                onClick={triggerFileInput}
              >
                <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-medium">Drag and drop or click to upload</h3>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG and PDF files</p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <p className="mt-4 text-xs text-muted-foreground">
                  Our Python-powered OCR will extract and categorize the receipt details automatically
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 h-auto max-h-[400px] w-full max-w-[300px] overflow-hidden rounded-lg border">
                    <img src={image || "/placeholder.svg"} alt="Receipt" className="h-full w-full object-contain" />
                    <Button variant="destructive" size="icon" className="absolute right-2 top-2" onClick={resetImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {!scanResult && (
                    <div className="w-full max-w-[300px]">
                      {isProcessing ? (
                        <div className="space-y-2">
                          <Progress value={processProgress} className="h-2 w-full" />
                          <p className="text-center text-sm text-muted-foreground">
                            Processing receipt with OCR... {processProgress}%
                          </p>
                        </div>
                      ) : (
                        <Button className="w-full" onClick={processReceipt}>
                          <FileText className="mr-2 h-4 w-4" />
                          Process Receipt
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {scanResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="merchant">Merchant</Label>
                        <Input id="merchant" value={scanResult.merchant} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={scanResult.date} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="total">Total Amount</Label>
                        <Input id="total" value={`₹${scanResult.total.toFixed(2)}`} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select defaultValue={scanResult.category}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Groceries">Groceries</SelectItem>
                            <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                            <SelectItem value="Transportation">Transportation</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Shopping">Shopping</SelectItem>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Health & Medical">Health & Medical</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Items</Label>
                      <div className="max-h-[200px] overflow-y-auto rounded-md border p-2">
                        {scanResult.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between border-b py-2 last:border-0">
                            <span>{item.name}</span>
                            <CurrencyFormatter amount={item.price} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Add any notes about this receipt..." />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={resetImage}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button onClick={saveToTransactions}>
                        <Check className="mr-2 h-4 w-4" />
                        Save to Transactions
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="mt-0">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="manual-merchant">Merchant</Label>
                  <Input id="manual-merchant" placeholder="e.g., Grocery Store, Restaurant" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-date">Date</Label>
                  <Input id="manual-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                    <Input id="manual-amount" type="number" step="0.01" placeholder="0.00" className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-category">Category</Label>
                  <Select>
                    <SelectTrigger id="manual-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Groceries">Groceries</SelectItem>
                      <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Health & Medical">Health & Medical</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-description">Description</Label>
                <Textarea id="manual-description" placeholder="Add details about this transaction..." />
              </div>

              <Button className="w-full">
                <Check className="mr-2 h-4 w-4" />
                Save Transaction
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
