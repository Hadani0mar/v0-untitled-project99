"use client"

import { useEffect } from "react"

export default function AnalyticsTracker() {
  useEffect(() => {
    // تتبع مشاهدة الصفحة
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "page_view",
            data: {
              page: window.location.pathname,
              timestamp: new Date().toISOString(),
            },
          }),
        })
      } catch (error) {
        console.error("خطأ في تتبع مشاهدة الصفحة:", error)
      }
    }

    // تتبع الزائر الفريد (مرة واحدة فقط في الجلسة)
    const trackUniqueVisitor = async () => {
      const hasVisited = sessionStorage.getItem("visitor_tracked")
      if (!hasVisited) {
        try {
          await fetch("/api/analytics/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "unique_visitor",
              data: {
                timestamp: new Date().toISOString(),
              },
            }),
          })
          sessionStorage.setItem("visitor_tracked", "true")
        } catch (error) {
          console.error("خطأ في تتبع الزائر الفريد:", error)
        }
      }
    }

    trackPageView()
    trackUniqueVisitor()
  }, [])

  return null // هذا المكون لا يعرض أي شيء
}
