import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const postId = params.id

    // زيادة عدد المشاهدات للمقال
    const { error: postError } = await supabase
      .from("blog_posts")
      .update({
        views: supabase.raw("COALESCE(views, 0) + 1"),
      })
      .eq("id", postId)

    if (postError) {
      console.error("خطأ في تحديث مشاهدات المقال:", postError)
    }

    // تحديث إحصائيات الزوار اليومية
    const today = new Date().toISOString().split("T")[0]

    const { data: existingStats, error: fetchError } = await supabase
      .from("visitor_stats")
      .select("*")
      .eq("date", today)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("خطأ في جلب إحصائيات اليوم:", fetchError)
    }

    if (existingStats) {
      // تحديث الإحصائيات الموجودة
      const { error: updateError } = await supabase
        .from("visitor_stats")
        .update({
          blog_views: (existingStats.blog_views || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingStats.id)

      if (updateError) {
        console.error("خطأ في تحديث إحصائيات المدونة:", updateError)
      }
    } else {
      // إنشاء إحصائيات جديدة لليوم
      const { error: insertError } = await supabase.from("visitor_stats").insert({
        date: today,
        page_views: 0,
        unique_visitors: 0,
        blog_views: 1,
      })

      if (insertError) {
        console.error("خطأ في إنشاء إحصائيات جديدة:", insertError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("خطأ في تسجيل المشاهدة:", error)
    return NextResponse.json({ error: "فشل في تسجيل المشاهدة" }, { status: 500 })
  }
}
