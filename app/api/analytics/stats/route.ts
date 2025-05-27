import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    // جلب إجمالي مشاهدات المدونة
    const { data: blogStats, error: blogError } = await supabase.from("visitor_stats").select("blog_views")

    if (blogError) {
      console.error("خطأ في جلب إحصائيات المدونة:", blogError)
    }

    const totalBlogViews = blogStats?.reduce((sum, stat) => sum + (stat.blog_views || 0), 0) || 0

    // جلب إجمالي مشاهدات الصفحات
    const { data: pageStats, error: pageError } = await supabase
      .from("visitor_stats")
      .select("page_views, unique_visitors")

    if (pageError) {
      console.error("خطأ في جلب إحصائيات الصفحات:", pageError)
    }

    const totalPageViews = pageStats?.reduce((sum, stat) => sum + (stat.page_views || 0), 0) || 0
    const totalUniqueVisitors = pageStats?.reduce((sum, stat) => sum + (stat.unique_visitors || 0), 0) || 0

    // جلب إحصائيات آخر 7 أيام
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentStats, error: recentError } = await supabase
      .from("visitor_stats")
      .select("*")
      .gte("date", sevenDaysAgo.toISOString().split("T")[0])
      .order("date", { ascending: true })

    if (recentError) {
      console.error("خطأ في جلب الإحصائيات الحديثة:", recentError)
    }

    return NextResponse.json({
      totalBlogViews,
      totalPageViews,
      totalUniqueVisitors,
      recentStats: recentStats || [],
    })
  } catch (error) {
    console.error("خطأ في جلب الإحصائيات:", error)
    return NextResponse.json({ error: "فشل في جلب الإحصائيات" }, { status: 500 })
  }
}
