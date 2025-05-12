import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    // التحقق من أن المستخدم مسجل الدخول كمدير
    const cookieStore = cookies()
    const adminCookie = cookieStore.get("admin_authenticated")

    if (adminCookie?.value !== "true") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 })
    }

    // إنشاء عميل Supabase باستخدام مفتاح الخدمة لتجاوز سياسات RLS
    const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const formData = await req.formData()
    const file = formData.get("file") as File
    const bucketName = formData.get("bucketName") as string
    const folderPath = formData.get("folderPath") as string

    if (!file || !bucketName) {
      return NextResponse.json({ success: false, error: "الملف أو اسم الدلو مفقود" }, { status: 400 })
    }

    // التأكد من وجود الدلو
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName)

    if (!bucketExists) {
      // إنشاء الدلو إذا لم يكن موجودًا
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
      })

      if (createBucketError) {
        console.error("خطأ في إنشاء الدلو:", createBucketError)
        return NextResponse.json(
          { success: false, error: `فشل في إنشاء الدلو: ${createBucketError.message}` },
          { status: 500 },
        )
      }
    }

    // إنشاء اسم ملف فريد
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName

    // تحويل الملف إلى مصفوفة ثنائية
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // تحميل الملف باستخدام مفتاح الخدمة
    const { data, error } = await supabaseAdmin.storage.from(bucketName).upload(filePath, fileBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("خطأ في تحميل الملف:", error)
      return NextResponse.json({ success: false, error: `فشل في تحميل الملف: ${error.message}` }, { status: 500 })
    }

    // الحصول على عنوان URL العام
    const { data: publicUrlData } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      filePath,
      publicUrl: publicUrlData.publicUrl,
    })
  } catch (error: any) {
    console.error("استثناء أثناء تحميل الملف:", error)
    return NextResponse.json({ success: false, error: `حدث خطأ أثناء تحميل الملف: ${error.message}` }, { status: 500 })
  }
}
