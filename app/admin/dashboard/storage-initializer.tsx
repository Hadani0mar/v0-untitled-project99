"use client"

import { useEffect, useState } from "react"
import { createStorageBuckets } from "@/lib/supabase/storage"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"

export default function StorageInitializer() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const initStorage = async () => {
      try {
        console.log("بدء تهيئة التخزين...")

        // محاولة إنشاء الدلائل
        await createStorageBuckets()

        // التحقق من قائمة الدلائل المتاحة
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()

        if (listError) {
          console.error("خطأ في قائمة الدلائل:", listError)
          toast({
            title: "تحذير",
            description: "فشل في التحقق من دلائل التخزين. قد لا تعمل ميزة تحميل الصور.",
            variant: "destructive",
          })
          return
        }

        console.log(
          "الدلائل المتاحة بعد التهيئة:",
          buckets.map((b) => b.name),
        )

        // التحقق من وجود الدلائل المطلوبة
        const hasProfileBucket = buckets.some((b) => b.name === "profile-images")
        const hasProjectBucket = buckets.some((b) => b.name === "project-images")

        if (!hasProfileBucket || !hasProjectBucket) {
          console.error("لم يتم العثور على جميع الدلائل المطلوبة")
          toast({
            title: "تحذير",
            description: "لم يتم العثور على جميع دلائل التخزين المطلوبة. قد لا تعمل ميزة تحميل الصور.",
            variant: "destructive",
          })
          return
        }

        setIsInitialized(true)
        console.log("تم تهيئة التخزين بنجاح")
      } catch (error) {
        console.error("استثناء أثناء تهيئة التخزين:", error)
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تهيئة التخزين.",
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
