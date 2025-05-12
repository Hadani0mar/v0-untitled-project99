import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

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
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("خطأ في واجهة برمجة الدردشة:", error)
    return NextResponse.json({ error: "فشل في معالجة طلبك" }, { status: 500 })
  }
}
