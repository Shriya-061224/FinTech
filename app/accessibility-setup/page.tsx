"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Accessibility, Brain, Eye, Ear, VolumeX, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

export default function AccessibilitySetupPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Accessibility settings state
  const [accessibilityType, setAccessibilityType] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    voiceCommands: false,
    screenReader: false,
    vibrationFeedback: false,
    simplifiedUI: false,
    textToSpeech: false,
    fontType: "default",
    fontSize: 100, // percentage
  })

  const handleContinue = () => {
    // Save accessibility settings (in a real app, this would be stored in a database or local storage)
    localStorage.setItem(
      "accessibilitySettings",
      JSON.stringify({
        type: accessibilityType,
        ...settings,
      }),
    )

    toast({
      title: "Settings Saved",
      description: "Your accessibility preferences have been saved",
    })

    // Redirect to financial goals page
    router.push("/financial-goals")
  }

  const handleSkip = () => {
    // Set default settings
    localStorage.setItem(
      "accessibilitySettings",
      JSON.stringify({
        type: null,
        highContrast: false,
        largeText: false,
        voiceCommands: false,
        screenReader: false,
        vibrationFeedback: false,
        simplifiedUI: false,
        textToSpeech: false,
        fontType: "default",
        fontSize: 100,
      }),
    )

    // Redirect to financial goals page
    router.push("/financial-goals")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Accessibility className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Accessibility Settings</h1>
          <p className="mt-2 text-muted-foreground">Customize your experience based on your accessibility needs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Do you have any specific accessibility needs?</CardTitle>
            <CardDescription>
              Select the option that best describes your needs. We'll optimize the app accordingly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={accessibilityType || ""}
              onValueChange={setAccessibilityType}
              className="grid gap-4 md:grid-cols-2"
            >
              <div>
                <RadioGroupItem value="visual" id="visual" className="peer sr-only" />
                <Label
                  htmlFor="visual"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Eye className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Visual Impairment</p>
                    <p className="text-sm text-muted-foreground">Screen readers, high contrast, larger text</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="hearing" id="hearing" className="peer sr-only" />
                <Label
                  htmlFor="hearing"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Ear className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Hearing Impairment</p>
                    <p className="text-sm text-muted-foreground">Visual cues, vibration feedback, captions</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="motor" id="motor" className="peer sr-only" />
                <Label
                  htmlFor="motor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <VolumeX className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Motor Impairment</p>
                    <p className="text-sm text-muted-foreground">Voice commands, simplified navigation</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="cognitive" id="cognitive" className="peer sr-only" />
                <Label
                  htmlFor="cognitive"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Brain className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Cognitive Needs</p>
                    <p className="text-sm text-muted-foreground">Simplified UI, clear information, dyslexia-friendly</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {accessibilityType && (
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Experience</CardTitle>
              <CardDescription>Fine-tune your accessibility settings based on your specific needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(accessibilityType === "visual" || accessibilityType === "cognitive") && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="large-text">Larger Text</Label>
                      <p className="text-sm text-muted-foreground">Increase text size throughout the app</p>
                    </div>
                    <Switch
                      id="large-text"
                      checked={settings.largeText}
                      onCheckedChange={(checked) => setSettings({ ...settings, largeText: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">A</span>
                      <Slider
                        value={[settings.fontSize]}
                        min={80}
                        max={150}
                        step={10}
                        onValueChange={(value) => setSettings({ ...settings, fontSize: value[0] })}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold">A</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{settings.fontSize}%</p>
                  </div>
                </>
              )}

              {accessibilityType === "visual" && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="screen-reader">Screen Reader Compatible</Label>
                    <p className="text-sm text-muted-foreground">Optimize for screen readers</p>
                  </div>
                  <Switch
                    id="screen-reader"
                    checked={settings.screenReader}
                    onCheckedChange={(checked) => setSettings({ ...settings, screenReader: checked })}
                  />
                </div>
              )}

              {accessibilityType === "hearing" && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="vibration">Vibration Feedback</Label>
                      <p className="text-sm text-muted-foreground">Use vibration for notifications and feedback</p>
                    </div>
                    <Switch
                      id="vibration"
                      checked={settings.vibrationFeedback}
                      onCheckedChange={(checked) => setSettings({ ...settings, vibrationFeedback: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="text-to-speech">Text to Speech</Label>
                      <p className="text-sm text-muted-foreground">Read important information aloud</p>
                    </div>
                    <Switch
                      id="text-to-speech"
                      checked={settings.textToSpeech}
                      onCheckedChange={(checked) => setSettings({ ...settings, textToSpeech: checked })}
                    />
                  </div>
                </>
              )}

              {accessibilityType === "motor" && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-commands">Voice Commands</Label>
                    <p className="text-sm text-muted-foreground">Control the app using voice commands</p>
                  </div>
                  <Switch
                    id="voice-commands"
                    checked={settings.voiceCommands}
                    onCheckedChange={(checked) => setSettings({ ...settings, voiceCommands: checked })}
                  />
                </div>
              )}

              {accessibilityType === "cognitive" && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="simplified-ui">Simplified Interface</Label>
                    <p className="text-sm text-muted-foreground">Reduce visual complexity and distractions</p>
                  </div>
                  <Switch
                    id="simplified-ui"
                    checked={settings.simplifiedUI}
                    onCheckedChange={(checked) => setSettings({ ...settings, simplifiedUI: checked })}
                  />
                </div>
              )}

              {(accessibilityType === "cognitive" || accessibilityType === "visual") && (
                <div className="space-y-2">
                  <Label htmlFor="font-type">Font Type</Label>
                  <RadioGroup
                    id="font-type"
                    value={settings.fontType}
                    onValueChange={(value) => setSettings({ ...settings, fontType: value })}
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
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button onClick={handleContinue}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
