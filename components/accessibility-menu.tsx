"use client"

import { useState } from "react"
import { Accessibility, Eye, Brain, VolumeX, Vibrate } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export function AccessibilityMenu() {
  const { toast } = useToast()
  const [voiceCommands, setVoiceCommands] = useState(false)
  const [vibrationFeedback, setVibrationFeedback] = useState(false)
  const [dyslexiaMode, setDyslexiaMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  const toggleVoiceCommands = () => {
    const newState = !voiceCommands
    setVoiceCommands(newState)

    if (newState) {
      toast({
        title: "Voice Commands Enabled",
        description: "You can now use voice commands to navigate the app.",
      })
      // In a real app, we would initialize the speech recognition API here
    } else {
      toast({
        title: "Voice Commands Disabled",
        description: "Voice command navigation has been turned off.",
      })
    }
  }

  const toggleVibrationFeedback = () => {
    const newState = !vibrationFeedback
    setVibrationFeedback(newState)

    if (newState) {
      toast({
        title: "Vibration Feedback Enabled",
        description: "You will now receive vibration feedback for notifications.",
      })
      // In a real app, we would test the vibration API here
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(200)
      }
    } else {
      toast({
        title: "Vibration Feedback Disabled",
        description: "Vibration feedback has been turned off.",
      })
    }
  }

  const toggleDyslexiaMode = () => {
    const newState = !dyslexiaMode
    setDyslexiaMode(newState)

    if (newState) {
      document.documentElement.classList.add("dyslexia-mode")
      toast({
        title: "Dyslexia-Friendly Mode Enabled",
        description: "Text has been adjusted for easier reading.",
      })
    } else {
      document.documentElement.classList.remove("dyslexia-mode")
      toast({
        title: "Dyslexia-Friendly Mode Disabled",
        description: "Text display has been returned to default.",
      })
    }
  }

  const toggleHighContrast = () => {
    const newState = !highContrast
    setHighContrast(newState)

    if (newState) {
      document.documentElement.classList.add("high-contrast")
      toast({
        title: "High Contrast Mode Enabled",
        description: "Display has been adjusted for higher contrast.",
      })
    } else {
      document.documentElement.classList.remove("high-contrast")
      toast({
        title: "High Contrast Mode Disabled",
        description: "Display has been returned to default contrast.",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Accessibility className="h-5 w-5" />
          <span className="sr-only">Accessibility options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Accessibility Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>High Contrast</span>
          </div>
          <Switch checked={highContrast} onCheckedChange={toggleHighContrast} />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2">
            <VolumeX className="h-4 w-4" />
            <span>Voice Commands</span>
          </div>
          <Switch checked={voiceCommands} onCheckedChange={toggleVoiceCommands} />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2">
            <Vibrate className="h-4 w-4" />
            <span>Vibration Feedback</span>
          </div>
          <Switch checked={vibrationFeedback} onCheckedChange={toggleVibrationFeedback} />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>Dyslexia-Friendly</span>
          </div>
          <Switch checked={dyslexiaMode} onCheckedChange={toggleDyslexiaMode} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
