import { NextResponse } from "next/server"

// متغير عام لتتبع وقت آخر تحديث للتعليمات
export let lastInstructionsUpdate = Date.now()

export async function POST() {
  try {
    // تحديث وقت آخر تحديث للتعليمات
    lastInstructionsUpdate = Date.now()

    return NextResponse.json({ success: true, timestamp: lastInstructionsUpdate })
  } catch (error) {
    console.error("خطأ في إعادة تعيين ذاكرة التخزين المؤقت للتعليمات:", error)
    return NextResponse.json(
      { success: false, error: "فشل في إعادة تعيين ذاكرة التخزين المؤقت للتعليمات" },
      { status: 500 },
    )
  }
}

// دالة للحصول على آخر تحديث
export function getLastInstructionsUpdate() {
  return lastInstructionsUpdate
}
