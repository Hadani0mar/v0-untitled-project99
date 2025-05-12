import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("ai_instructions").select("instructions").single()

    if (error) {
      console.error("خطأ في جلب تعليمات الذكاء الاصطناعي:", error)
      return NextResponse.json(
        {
          instructions:
            "أنا موسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية. كيف يمكنني مساعدتك اليوم؟",
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ instructions: data.instructions }, { status: 200 })
  } catch (error) {
    console.error("استثناء أثناء جلب تعليمات الذكاء الاصطناعي:", error)
    return NextResponse.json(
      {
        instructions:
          "أنا موسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية. كيف يمكنني مساعدتك اليوم؟",
      },
      { status: 200 },
    )
  }
}
