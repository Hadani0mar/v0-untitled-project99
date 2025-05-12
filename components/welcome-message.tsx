"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, MessageCircle } from "lucide-react"

export default function WelcomeMessage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // التحقق مما إذا كان المستخدم قد رأى الرسالة من قبل
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")

    if (!hasSeenWelcome) {
      // إظهار الرسالة بعد ثانية واحدة
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    // تخزين أن المستخدم قد رأى الرسالة
    localStorage.setItem("hasSeenWelcome", "true")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 left-6 z-50 w-72 animate-in">
      <Card className="shadow-lg border-none">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg flex items-center">
              <MessageCircle className="h-5 w-5 ml-2 text-blue-500" />
              تحدث مع Mousa AI
            </h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            يمكنك التحدث معي والاستفسار عن خدماتي ومشاريعي أو أي شيء يتعلق بتطوير الويب!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
