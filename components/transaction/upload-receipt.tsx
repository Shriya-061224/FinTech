"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Check, FileText, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function UploadReceipt() {
  const { toast } = useToast()
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [scanResult, setScanResult] = useState<null | {
    merchant: string
    date: string
    total: string
    category: string
    items: Array<{ name: string; price: string }>
  }>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
          // Simulate OCR result - in a real app, this would come from a Python backend using Tesseract
          setScanResult({
            merchant: "Electric Company",
            date: "2025-05-10",
            total: "89.75",
            category: "Utilities",
            items: [
              { name: "Monthly Service", price: "75.00" },
              { name: "Taxes", price: "8.25" },
              { name: "Fees", price: "6.50" },
            ],
          })

          toast({
            title: "Receipt Processed",
            description: "Receipt has been successfully analyzed using Python OCR technology.",
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
      description: "Receipt has been added to your transactions and automatically categorized as a utility bill.",
    })

    // In a real app, we would save this data to the database
    resetImage()
  }

  return (
    <div className="space-y-6">
      {!image ? (
        <div
          className="flex h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-6 text-center"
          onClick={triggerFileInput}
        >
          <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className="mb-1 text-lg font-medium">Drag and drop or click to upload</h3>
          <p className="text-sm text-muted-foreground">Supports JPG, PNG and PDF files</p>
          <Input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
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
                      Processing receipt with Python OCR... {processProgress}%
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
                  <Input id="total" value={`$${scanResult.total}`} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={scanResult.category}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Groceries">Groceries</SelectItem>
                      <SelectItem value="Dining">Dining</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
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
                      <span>${item.price}</span>
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
    </div>
  )
}
