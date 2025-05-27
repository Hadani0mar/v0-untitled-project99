"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Eye, Users, BookOpen, Calendar, BarChart3 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface AnalyticsData {
  totalBlogViews: number
  totalPageViews: number
  totalUniqueVisitors: number
  recentStats: Array<{
    date: string
    page_views: number
    unique_visitors: number
    blog_views: number
  }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBlogViews: 0,
    totalPageViews: 0,
    totalUniqueVisitors: 0,
    recentStats: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // جلب الإحصائيات مباشرة من Supabase
        const { data: statsData, error } = await supabase
          .from("visitor_stats")
          .select("*")
          .order("date", { ascending: false })
          .limit(30)

        if (error) {
          console.error("خطأ في جلب الإحصائيات:", error)
          // إنشاء بيانات افتراضية
          const today = new Date().toISOString().split("T")[0]
          await supabase.from("visitor_stats").upsert({
            date: today,
            page_views: 0,
            unique_visitors: 0,
            blog_views: 0,
          })
          setAnalytics({
            totalBlogViews: 0,
            totalPageViews: 0,
            totalUniqueVisitors: 0,
            recentStats: [],
          })
        } else {
          const totalBlogViews = statsData?.reduce((sum, stat) => sum + (stat.blog_views || 0), 0) || 0
          const totalPageViews = statsData?.reduce((sum, stat) => sum + (stat.page_views || 0), 0) || 0
          const totalUniqueVisitors = statsData?.reduce((sum, stat) => sum + (stat.unique_visitors || 0), 0) || 0

          setAnalytics({
            totalBlogViews,
            totalPageViews,
            totalUniqueVisitors,
            recentStats: statsData?.slice(0, 7) || [],
          })
        }
      } catch (error) {
        console.error("خطأ في جلب الإحصائيات:", error)
        setAnalytics({
          totalBlogViews: 0,
          totalPageViews: 0,
          totalUniqueVisitors: 0,
          recentStats: [],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const statsCards = [
    {
      title: "إجمالي مشاهدات الصفحات",
      value: analytics.totalPageViews.toLocaleString(),
      icon: <Eye className="h-6 w-6 text-blue-500" />,
      description: "العدد الإجمالي لمشاهدات جميع الصفحات",
    },
    {
      title: "الزوار الفريدون",
      value: analytics.totalUniqueVisitors.toLocaleString(),
      icon: <Users className="h-6 w-6 text-green-500" />,
      description: "عدد الزوار الفريدين للموقع",
    },
    {
      title: "مشاهدات المدونة",
      value: analytics.totalBlogViews.toLocaleString(),
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      description: "إجمالي مشاهدات مقالات المدونة",
    },
    {
      title: "آخر 7 أيام",
      value: analytics.recentStats.length.toString(),
      icon: <Calendar className="h-6 w-6 text-orange-500" />,
      description: "عدد الأيام التي تم تسجيل بيانات فيها",
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">إحصائيات الموقع</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold">إحصائيات الموقع</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-in"
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <CardDescription className="text-xs">{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {analytics.recentStats.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>الإحصائيات الأخيرة (آخر 7 أيام)</CardTitle>
            <CardDescription>تفاصيل المشاهدات والزوار في الأيام الأخيرة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{new Date(stat.date).toLocaleDateString("ar-SA")}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-blue-500" />
                      <span>{stat.page_views} مشاهدة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-green-500" />
                      <span>{stat.unique_visitors} زائر</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-purple-500" />
                      <span>{stat.blog_views} مدونة</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analytics.recentStats.length === 0 && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد إحصائيات بعد</h3>
            <p className="text-gray-600 dark:text-gray-400">ستظهر الإحصائيات هنا عندما يبدأ الزوار في تصفح موقعك</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
