"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Check, FileText, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ScanReceiptPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("camera")
  const [image, setImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResult, setScanResult] = useState<null | {
    merchant: string
    date: string
    total: string
    category: string
    items: Array<{ name: string; price: string }>
  }>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Cleanup function for camera stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      // In a real app, we would check for camera permissions
      // For this demo, we'll just use a placeholder
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
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

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
    setScanProgress(0)
  }

  const simulateScan = () => {
    setIsScanning(true)
    setScanProgress(0)

    // Simulate OCR processing with progress updates
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          // Simulate OCR result
          setScanResult({
            merchant: "Grocery Store",
            date: "2025-05-14",
            total: "120.50",
            category: "Groceries",
            items: [
              { name: "Milk", price: "4.99" },
              { name: "Bread", price: "3.49" },
              { name: "Eggs", price: "5.99" },
              { name: "Apples", price: "6.75" },
              { name: "Chicken", price: "12.99" },
              { name: "Pasta", price: "2.49" },
              { name: "Tomatoes", price: "4.29" },
              { name: "Cereal", price: "5.99" },
            ],
          })

          toast({
            title: "Receipt Scanned",
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
      description: "Receipt has been added to your transactions and categorized automatically.",
    })

    // In a real app, we would save this data to the database
    resetImage()
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <h1 className="mb-6 text-3xl font-bold">Scan Receipt</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {!image ? (
            <>
              <TabsContent value="camera" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Capture Receipt</CardTitle>
                    <CardDescription>Position the receipt in the frame and take a photo</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="relative mb-4 h-[400px] w-full max-w-[300px] overflow-hidden rounded-lg border bg-muted">
                      {/* In a real app, this would be a video stream */}
                      <div className="flex h-full w-full items-center justify-center">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <video ref={videoRef} className="hidden h-full w-full object-cover" autoPlay playsInline />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button onClick={captureImage}>
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Receipt
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="upload" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Receipt</CardTitle>
                    <CardDescription>Upload a photo or scan of your receipt</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{scanResult ? "Receipt Analysis" : "Scan Receipt"}</CardTitle>
                <CardDescription>
                  {scanResult ? "Review the extracted information from your receipt" : "Analyzing the receipt image"}
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                        {isScanning ? (
                          <div className="space-y-2">
                            <Progress value={scanProgress} className="h-2 w-full" />
                            <p className="text-center text-sm text-muted-foreground">
                              Analyzing receipt with OCR... {scanProgress}%
                            </p>
                          </div>
                        ) : (
                          <Button className="w-full" onClick={simulateScan}>
                            <FileText className="mr-2 h-4 w-4" />
                            Scan Receipt
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
                    </div>
                  )}
                </div>
              </CardContent>
              {scanResult && (
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetImage}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={saveToTransactions}>
                    <Check className="mr-2 h-4 w-4" />
                    Save to Transactions
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </Tabs>
    </div>
  )
}
