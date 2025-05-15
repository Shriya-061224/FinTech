"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type AccessibilitySettings = {
  type: string | null
  highContrast: boolean
  largeText: boolean
  voiceCommands: boolean
  screenReader: boolean
  vibrationFeedback: boolean
  simplifiedUI: boolean
  textToSpeech: boolean
  fontType: string
  fontSize: number
}

type AccessibilityContextType = {
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
}

const defaultSettings: AccessibilitySettings = {
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
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
})

export function useAccessibility() {
  return useContext(AccessibilityContext)
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    try {
      const savedSettings = localStorage.getItem("accessibilitySettings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error("Error loading accessibility settings:", error)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    // Apply settings to document
    const html = document.documentElement

    // Apply high contrast
    if (settings.highContrast) {
      html.classList.add("high-contrast")
    } else {
      html.classList.remove("high-contrast")
    }

    // Apply large text
    if (settings.largeText) {
      html.style.fontSize = "120%"
    } else {
      html.style.fontSize = `${settings.fontSize}%`
    }

    // Apply font type
    if (settings.fontType === "dyslexic") {
      html.classList.add("dyslexia-mode")
    } else {
      html.classList.remove("dyslexia-mode")
    }

    // Apply simplified UI
    if (settings.simplifiedUI) {
      html.classList.add("simplified-ui")
    } else {
      html.classList.remove("simplified-ui")
    }

    // In a real app, we would initialize voice commands, screen reader compatibility, etc.
  }, [settings, isLoaded])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem("accessibilitySettings", JSON.stringify(updatedSettings))
  }

  return <AccessibilityContext.Provider value={{ settings, updateSettings }}>{children}</AccessibilityContext.Provider>
}
