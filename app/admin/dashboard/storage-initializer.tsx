"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function StorageInitializer() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const initStorage = async () => {
      if (isLoading || isInitialized || retryCount >= 3) return

      setIsLoading(true)
      try {
        console.log("بدء تهيئة التخزين...")

        const response = await fetch("/api/storage/init", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "فشل في تهيئة التخزين")
        }

        console.log("تم تهيئة التخزين بنجاح. الدلائل المتاحة:", data.buckets)
        setIsInitialized(true)

        toast({
          title: "تم تهيئة التخزين",
          description: "تم تهيئة دلائل التخزين بنجاح",
        })
      } catch (error) {
        console.error("استثناء أثناء تهيئة التخزين:", error)

        // Increment retry count
        setRetryCount((prev) => prev + 1)

        if (retryCount < 2) {
          // Only show warning after first retry
          toast({
            title: "تحذير",
            description: "جاري محاولة تهيئة التخزين مرة أخرى...",
            variant: "default",
          })
        } else {
          toast({
            title: "تحذير",
            description: "فشل في تهيئة التخزين. قد لا تعمل ميزة تحميل الصور.",
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (!isInitialized && !isLoading) {
      initStorage()
    }
  }, [isInitialized, isLoading, retryCount, toast])

  return null
}
