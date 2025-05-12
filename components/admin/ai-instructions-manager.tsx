"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Save, RefreshCw } from "lucide-react"

export default function AiInstructionsManager() {
  const [instructions, setInstructions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [instructionId, setInstructionId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const { data, error } = await supabase.from("ai_instructions").select("*").single()

        if (error) {
          console.error("خطأ في جلب تعليمات الذكاء الاصطناعي:", error)
          return
        }

        if (data) {
          setInstructions(data.instructions)
          setInstructionId(data.id)
        }
      } catch (error) {
        console.error("استثناء أثناء جلب تعليمات الذكاء الاصطناعي:", error)
      }
    }

    fetchInstructions()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)

    try {
      let result

      if (instructionId) {
        // تحديث التعليمات الموجودة
        result = await supabase
          .from("ai_instructions")
          .update({
            instructions,
            updated_at: new Date().toISOString(),
          })
          .eq("id", instructionId)
      } else {
        // إنشاء تعليمات جديدة
        result = await supabase
          .from("ai_instructions")
          .insert({
            instructions,
          })
          .select()

        if (result.data && result.data.length > 0) {
          setInstructionId(result.data[0].id)
        }
      }

      if (result.error) {
        throw result.error
      }

      // تطبيق التعليمات فوراً
      await applyInstructions()

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث وتطبيق تعليمات الذكاء الاصطناعي بنجاح",
      })

      router.refresh()
    } catch (error) {
      console.error("خطأ في حفظ تعليمات الذكاء الاصطناعي:", error)
      toast({
        title: "فشل الحفظ",
        description: "فشل تحديث تعليمات الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyInstructions = async () => {
    setIsApplying(true)
    try {
      // مسح ذاكرة التخزين المؤقت للتعليمات
      const response = await fetch("/api/ai/reset-cache", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("فشل في إعادة تعيين ذاكرة التخزين المؤقت للتعليمات")
      }

      // مسح المحادثات السابقة وإضافة رسالة ترحيب جديدة
      localStorage.setItem(
        "chat_messages",
        JSON.stringify([
          {
            role: "assistant",
            content: "مرحبًا! تم تحديث تعليماتي. كيف يمكنني مساعدتك اليوم؟",
            timestamp: Date.now(),
          },
        ]),
      )

      toast({
        title: "تم تطبيق التعليمات",
        description: "تم تطبيق التعليمات الجديدة على الذكاء الاصطناعي",
      })
    } catch (error) {
      console.error("خطأ في تطبيق التعليمات:", error)
      toast({
        title: "فشل تطبيق التعليمات",
        description: "فشل تطبيق التعليمات الجديدة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>تعليمات الذكاء الاصطناعي</CardTitle>
        <CardDescription>تخصيص تعليمات الذكاء الاصطناعي الخاص بك</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="أدخل تعليمات للذكاء الاصطناعي الخاص بك..."
            rows={10}
            className="resize-none"
          />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              هذه التعليمات ستوجه سلوك الذكاء الاصطناعي الخاص بك. يمكنك تخصيص كيفية تقديم نفسه وكيفية الرد على
              الاستفسارات.
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
              {isLoading ? (
                "جاري الحفظ..."
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ وتطبيق التعليمات
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={applyInstructions}
              disabled={isApplying || isLoading}
              className="flex items-center gap-2"
            >
              {isApplying ? (
                "جاري التطبيق..."
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  تطبيق فقط
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
