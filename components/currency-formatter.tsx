"use client"

import { useEffect, useState } from "react"

interface CurrencyFormatterProps {
  amount: number
  currency?: string
  locale?: string
  className?: string
}

export function CurrencyFormatter({ amount, currency = "INR", locale = "en-IN", className }: CurrencyFormatterProps) {
  const [formattedAmount, setFormattedAmount] = useState("")

  useEffect(() => {
    try {
      // Format the amount according to the specified currency and locale
      const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })

      setFormattedAmount(formatter.format(amount))
    } catch (error) {
      // Fallback formatting if Intl is not supported
      let symbol = "₹"
      switch (currency) {
        case "USD":
          symbol = "$"
          break
        case "EUR":
          symbol = "€"
          break
        case "GBP":
          symbol = "£"
          break
        case "JPY":
          symbol = "¥"
          break
        default:
          symbol = "₹" // Default to INR
      }

      // Format with commas for Indian numbering system (e.g., 1,00,000)
      if (locale === "en-IN" || currency === "INR") {
        const amountStr = amount.toFixed(2)
        const parts = amountStr.split(".")
        const integerPart = parts[0]
        const decimalPart = parts[1]

        // Format with Indian numbering system (e.g., 1,23,456.78)
        let formattedInteger = ""
        for (let i = 0; i < integerPart.length; i++) {
          if (i === 0) {
            formattedInteger += integerPart[i]
          } else if ((integerPart.length - i) % 2 === 0 && i !== 0) {
            formattedInteger += "," + integerPart[i]
          } else {
            formattedInteger += integerPart[i]
          }
        }

        setFormattedAmount(`${symbol} ${formattedInteger}.${decimalPart}`)
      } else {
        // Standard formatting for other currencies
        setFormattedAmount(`${symbol} ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
      }
    }
  }, [amount, currency, locale])

  return <span className={className}>{formattedAmount}</span>
}
