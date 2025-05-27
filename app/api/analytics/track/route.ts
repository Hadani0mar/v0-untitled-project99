import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { type, data } = await request.json()

    const today = new Date().toISOString().split("T")[0]

    // جلب أو إنشاء سجل لليوم الحالي
    const { data: existingStats, error: fetchError } = await supabase
      .from("visitor_stats")
      .select("*")
      .eq("date", today)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("خطأ في جلب إحصائيات اليوم:", fetchError)
      return NextResponse.json({ error: "فشل في جلب الإحصائيات" }, { status: 500 })
    }

    let updateData = {}

    switch (type) {
      case "page_view":
        updateData = {
          page_views: (existingStats?.page_views || 0) + 1,
        }
        break
      case "unique_visitor":
        updateData = {
          unique_visitors: (existingStats?.unique_visitors || 0) + 1,
        }
        break
      case "blog_view":
        updateData = {
          blog_views: (existingStats?.blog_views || 0) + 1,
        }
        break
      default:
        return NextResponse.json({ error: "نوع التتبع غير صحيح" }, { status: 400 })
    }

    if (existingStats) {
      // تحديث الإحصائيات الموجودة
      const { error: updateError } = await supabase
        .from("visitor_stats")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingStats.id)

      if (updateError) {
        console.error("خطأ في تحديث الإحصائيات:", updateError)
        return NextResponse.json({ error: "فشل في تحديث الإحصائيات" }, { status: 500 })
      }
    } else {
      // إنشاء إحصائيات جديدة لليوم
      const { error: insertError } = await supabase.from("visitor_stats").insert({
        date: today,
        page_views: type === "page_view" ? 1 : 0,
        unique_visitors: type === "unique_visitor" ? 1 : 0,
        blog_views: type === "blog_view" ? 1 : 0,
      })

      if (insertError) {
        console.error("خطأ في إنشاء إحصائيات جديدة:", insertError)
        return NextResponse.json({ error: "فشل في إنشاء الإحصائيات" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("خطأ في تتبع الإحصائيات:", error)
    return NextResponse.json({ error: "فشل في تتبع الإحصائيات" }, { status: 500 })
  }
}
