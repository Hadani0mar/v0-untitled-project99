import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // التحقق من أن المستخدم مسجل الدخول كمدير
    const cookieStore = cookies()
    const adminCookie = cookieStore.get("admin_authenticated")

    if (adminCookie?.value !== "true") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 })
    }

    // Create a Supabase client with the service role key to bypass RLS
    const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("بدء تهيئة التخزين من واجهة برمجة التطبيقات باستخدام مفتاح الخدمة...")

    // إنشاء دلو للصور الشخصية
    try {
      console.log("محاولة إنشاء دلو الصور الشخصية...")
      const { data: profileBucket, error: profileError } = await supabaseAdmin.storage.createBucket("profile-images", {
        public: true,
      })

      if (profileError && !profileError.message.includes("already exists")) {
        console.error("خطأ في إنشاء دلو الصور الشخصية:", profileError)
      } else {
        console.log("تم إنشاء أو التحقق من وجود دلو الصور الشخصية")
      }
    } catch (error) {
      console.error("استثناء عند إنشاء دلو الصور الشخصية:", error)
    }

    // إنشاء دلو لصور المشاريع
    try {
      console.log("محاولة إنشاء دلو صور المشاريع...")
      const { data: projectBucket, error: projectError } = await supabaseAdmin.storage.createBucket("project-images", {
        public: true,
      })

      if (projectError && !projectError.message.includes("already exists")) {
        console.error("خطأ في إنشاء دلو صور المشاريع:", projectError)
      } else {
        console.log("تم إنشاء أو التحقق من وجود دلو صور المشاريع")
      }
    } catch (error) {
      console.error("استثناء عند إنشاء دلو صور المشاريع:", error)
    }

    // التحقق من قائمة الدلائل المتاحة
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()

    if (listError) {
      console.error("خطأ في قائمة الدلائل:", listError)
      return NextResponse.json({ success: false, error: listError.message }, { status: 500 })
    }

    console.log(
      "تم تهيئة التخزين بنجاح. الدلائل المتاحة:",
      buckets.map((b) => b.name),
    )

    return NextResponse.json({
      success: true,
      buckets: buckets.map((b) => b.name),
    })
  } catch (error) {
    console.error("خطأ في تهيئة التخزين:", error)
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء تهيئة التخزين" }, { status: 500 })
  }
}
