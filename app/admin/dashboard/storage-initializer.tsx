"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function StorageInitializer() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const initStorage = async () => {
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
      } catch (error) {
        console.error("استثناء أثناء تهيئة التخزين:", error)
        toast({
          title: "تحذير",
          description: "فشل في تهيئة التخزين. قد لا تعمل ميزة تحميل الصور.",
          variant: "destructive",
        })
      }
    }

    if (!isInitialized) {
      initStorage()
    }
  }, [isInitialized, toast])

  return null
}
