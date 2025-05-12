import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createServerClient()

    // إنشاء دلو للصور الشخصية
    try {
      const { data: profileBucket, error: profileError } = await supabase.storage.createBucket("profile-images", {
        public: true,
      })

      if (profileError && !profileError.message.includes("already exists")) {
        console.error("خطأ في إنشاء دلو الصور الشخصية:", profileError)
      }
    } catch (error) {
      console.error("استثناء عند إنشاء دلو الصور الشخصية:", error)
    }

    // إنشاء دلو لصور المشاريع
    try {
      const { data: projectBucket, error: projectError } = await supabase.storage.createBucket("project-images", {
        public: true,
      })

      if (projectError && !projectError.message.includes("already exists")) {
        console.error("خطأ في إنشاء دلو صور المشاريع:", projectError)
      }
    } catch (error) {
      console.error("استثناء عند إنشاء دلو صور المشاريع:", error)
    }

    // التحقق من قائمة الدلائل المتاحة
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      return NextResponse.json({ success: false, error: listError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      buckets: buckets.map((b) => b.name),
    })
  } catch (error) {
    console.error("خطأ في تهيئة التخزين:", error)
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء تهيئة التخزين" }, { status: 500 })
  }
}
