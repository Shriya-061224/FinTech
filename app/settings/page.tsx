"use client"

import { useState, useEffect } from "react"
import { Accessibility, Bell, Globe, Lock, Moon, Palette, Save, Sun, Vibrate, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    // Theme settings
    theme: "light",
    currency: "INR",

    // Privacy settings
    privacy_mode: "private",

    // Accessibility settings
    high_contrast: false,
    large_text: false,
    voice_commands: false,
    voice_explanation: false,
    vibration_feedback: false,
    simplified_ui: false,
    text_to_speech: false,
    font_type: "default",
    font_size: 100,

    // Notification settings
    email_notifications: false,
    push_notifications: true,
    sms_notifications: false,

    // Language settings
    language: "en",

    // Security settings
    two_factor_auth: false,
    biometric_login: false,

    // Display settings
    show_balance: true,
    default_view: "dashboard",
  })

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // In a real app, this would be an API call
        const savedSettings = localStorage.getItem("userSettings")
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }

    loadSettings()
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      localStorage.setItem("userSettings", JSON.stringify(settings))

      // Apply settings
      applySettings(settings)

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applySettings = (settings: any) => {
    // Apply theme
    document.documentElement.classList.toggle("dark", settings.theme === "dark")

    // Apply high contrast
    document.documentElement.classList.toggle("high-contrast", settings.high_contrast)

    // Apply font size
    document.documentElement.style.fontSize = settings.large_text ? "120%" : `${settings.font_size}%`

    // Apply font type
    document.documentElement.classList.toggle("dyslexia-mode", settings.font_type === "dyslexic")

    // Apply simplified UI
    document.documentElement.classList.toggle("simplified-ui", settings.simplified_ui)

    // In a real app, we would also apply other settings like language, currency, etc.
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="accessibility">
            <Accessibility className="mr-2 h-4 w-4" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="mr-2 h-4 w-4" />
            Privacy & Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how FinTech looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup
                  value={settings.theme}
                  onValueChange={(value) => setSettings({ ...settings, theme: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
                    <Label
                      htmlFor="theme-light"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Sun className="mb-3 h-6 w-6" />
                      <div className="text-center">
                        <p className="font-medium">Light</p>
                        <p className="text-sm text-muted-foreground">Light background with dark text</p>
                      </div>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
                    <Label
                      htmlFor="theme-dark"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Moon className="mb-3 h-6 w-6" />
                      <div className="text-center">
                        <p className="font-medium">Dark</p>
                        <p className="text-sm text-muted-foreground">Dark background with light text</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => setSettings({ ...settings, currency: value })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                    <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                    <SelectItem value="te">Telugu</SelectItem>
                    <SelectItem value="mr">Marathi</SelectItem>
                    <SelectItem value="bn">Bengali</SelectItem>
                    <SelectItem value="gu">Gujarati</SelectItem>
                    <SelectItem value="kn">Kannada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-view">Default View</Label>
                <Select
                  value={settings.default_view}
                  onValueChange={(value) => setSettings({ ...settings, default_view: value })}
                >
                  <SelectTrigger id="default-view">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="transactions">Transactions</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="investments">Investments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-balance">Show Balance</Label>
                  <p className="text-sm text-muted-foreground">Show your account balance on the dashboard</p>
                </div>
                <Switch
                  id="show-balance"
                  checked={settings.show_balance}
                  onCheckedChange={(checked) => setSettings({ ...settings, show_balance: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Make FinTech more accessible based on your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.high_contrast}
                  onCheckedChange={(checked) => setSettings({ ...settings, high_contrast: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="large-text">Larger Text</Label>
                  <p className="text-sm text-muted-foreground">Increase text size throughout the app</p>
                </div>
                <Switch
                  id="large-text"
                  checked={settings.large_text}
                  onCheckedChange={(checked) => setSettings({ ...settings, large_text: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">A</span>
                  <Slider
                    value={[settings.font_size]}
                    min={80}
                    max={150}
                    step={10}
                    onValueChange={(value) => setSettings({ ...settings, font_size: value[0] })}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold">A</span>
                </div>
                <p className="text-xs text-muted-foreground">{settings.font_size}%</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-type">Font Type</Label>
                <RadioGroup
                  value={settings.font_type}
                  onValueChange={(value) => setSettings({ ...settings, font_type: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="default" id="font-default" className="peer sr-only" />
                    <Label
                      htmlFor="font-default"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <p className="text-lg">Default</p>
                      <p className="text-sm text-muted-foreground">Standard font</p>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dyslexic" id="font-dyslexic" className="peer sr-only" />
                    <Label
                      htmlFor="font-dyslexic"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <p className="text-lg font-medium" style={{ fontFamily: "Arial, sans-serif" }}>
                        Dyslexic
                      </p>
                      <p className="text-sm text-muted-foreground">Easier to read</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="voice-commands" className="flex items-center">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Voice Commands
                  </Label>
                  <p className="text-sm text-muted-foreground">Control the app using voice commands</p>
                </div>
                <Switch
                  id="voice-commands"
                  checked={settings.voice_commands}
                  onCheckedChange={(checked) => setSettings({ ...settings, voice_commands: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="voice-explanation" className="flex items-center">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Voice Explanation
                  </Label>
                  <p className="text-sm text-muted-foreground">Read screen elements aloud (for blind users)</p>
                </div>
                <Switch
                  id="voice-explanation"
                  checked={settings.voice_explanation}
                  onCheckedChange={(checked) => setSettings({ ...settings, voice_explanation: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="vibration-feedback" className="flex items-center">
                    <Vibrate className="mr-2 h-4 w-4" />
                    Vibration Feedback
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Use vibration for notifications and feedback (for deaf users)
                  </p>
                </div>
                <Switch
                  id="vibration-feedback"
                  checked={settings.vibration_feedback}
                  onCheckedChange={(checked) => setSettings({ ...settings, vibration_feedback: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="simplified-ui">Simplified Interface</Label>
                  <p className="text-sm text-muted-foreground">Reduce visual complexity and distractions</p>
                </div>
                <Switch
                  id="simplified-ui"
                  checked={settings.simplified_ui}
                  onCheckedChange={(checked) => setSettings({ ...settings, simplified_ui: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in your browser or mobile app</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.push_notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, push_notifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, email_notifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.sms_notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, sms_notifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>Manage your privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Privacy Mode</Label>
                <RadioGroup
                  value={settings.privacy_mode}
                  onValueChange={(value) => setSettings({ ...settings, privacy_mode: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="private" id="privacy-private" className="peer sr-only" />
                    <Label
                      htmlFor="privacy-private"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Lock className="mb-3 h-6 w-6" />
                      <div className="text-center">
                        <p className="font-medium">Private</p>
                        <p className="text-sm text-muted-foreground">Only you can see your financial data</p>
                      </div>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="public" id="privacy-public" className="peer sr-only" />
                    <Label
                      htmlFor="privacy-public"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Globe className="mb-3 h-6 w-6" />
                      <div className="text-center">
                        <p className="font-medium">Public</p>
                        <p className="text-sm text-muted-foreground">Share your financial data with others</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="two-factor-auth"
                  checked={settings.two_factor_auth}
                  onCheckedChange={(checked) => setSettings({ ...settings, two_factor_auth: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="biometric-login">Biometric Login</Label>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face recognition to log in</p>
                </div>
                <Switch
                  id="biometric-login"
                  checked={settings.biometric_login}
                  onCheckedChange={(checked) => setSettings({ ...settings, biometric_login: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
