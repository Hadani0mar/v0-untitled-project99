import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createServerClient } from "@/lib/supabase/server"
import { lastInstructionsUpdate } from "../ai/reset-cache/route"

// ذاكرة تخزين مؤقت للتعليمات
let cachedInstructions: string | null = null
let cacheTimestamp = 0

export async function POST(req: NextRequest) {
  try {
    const { messages, instructions } = await req.json()
    const supabase = createServerClient()

    // التحقق مما إذا كانت التعليمات المخزنة مؤقتًا صالحة
    const shouldRefreshCache = !cachedInstructions || cacheTimestamp < lastInstructionsUpdate

    // جلب تعليمات الذكاء الاصطناعي
    let systemPrompt =
      "أنت مساعد ذكي يدعى Mousa AI. أنت تمثل موسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية."

    // استخدام التعليمات المخصصة إذا تم توفيرها
    if (instructions) {
      systemPrompt = instructions
      cachedInstructions = instructions
      cacheTimestamp = Date.now()
    } else if (shouldRefreshCache) {
      try {
        const { data: aiData, error: aiError } = await supabase.from("ai_instructions").select("instructions").single()

        if (!aiError && aiData) {
          systemPrompt = aiData.instructions
          cachedInstructions = systemPrompt
          cacheTimestamp = Date.now()
        }
      } catch (error) {
        console.error("خطأ في جلب تعليمات الذكاء الاصطناعي:", error)
        // استخدام التعليمات المخزنة مؤقتًا إذا كانت متاحة
        if (cachedInstructions) {
          systemPrompt = cachedInstructions
        }
      }
    } else {
      // استخدام التعليمات المخزنة مؤقتًا
      systemPrompt = cachedInstructions
    }

    // تحقق من وجود مفتاح API لـ Groq
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        message:
          "هذه استجابة محاكاة لأن مفتاح API لـ Groq غير مكوّن. يرجى إضافة مفتاح API الخاص بك لاستخدام خدمة الذكاء الاصطناعي الفعلية.",
      })
    }

    // استخدام generateText من AI SDK
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("خطأ في واجهة برمجة الدردشة:", error)
    return NextResponse.json({ error: "فشل في معالجة طلبك" }, { status: 500 })
  }
}
