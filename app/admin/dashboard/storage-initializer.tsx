"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function StorageInitializer() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // تحديث دالة initStorage لتحسين التعامل مع الأخطاء
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

        // التحقق من وجود جميع الدلائل المطلوبة
        const requiredBuckets = ["profile-images", "project-images", "blog-images"]
        const missingBuckets = requiredBuckets.filter((bucket) => !data.buckets.includes(bucket))

        if (missingBuckets.length > 0) {
          console.warn("الدلائل المفقودة:", missingBuckets)
          toast({
            title: "تحذير",
            description: `بعض دلائل التخزين مفقودة: ${missingBuckets.join(", ")}`,
            variant: "default",
          })
        } else {
          setIsInitialized(true)
          toast({
            title: "تم تهيئة التخزين",
            description: "تم تهيئة جميع دلائل التخزين بنجاح",
          })
        }
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
