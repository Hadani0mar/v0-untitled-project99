import { supabase } from "./client"

// إنشاء الدلائل المطلوبة في Supabase Storage
export async function createStorageBuckets() {
  try {
    console.log("بدء تهيئة دلائل التخزين...")

    // إنشاء دلو للصور الشخصية
    const { error: profileError } = await supabase.storage.createBucket("profile-images", {
      public: true,
    })

    if (profileError && !profileError.message.includes("already exists")) {
      console.error("خطأ في إنشاء دلو الصور الشخصية:", profileError)
    } else {
      console.log("تم التحقق من وجود دلو الصور الشخصية")
    }

    // إنشاء دلو لصور المشاريع
    const { error: projectError } = await supabase.storage.createBucket("project-images", {
      public: true,
    })

    if (projectError && !projectError.message.includes("already exists")) {
      console.error("خطأ في إنشاء دلو صور المشاريع:", projectError)
    } else {
      console.log("تم التحقق من وجود دلو صور المشاريع")
    }

    // التحقق من قائمة الدلائل المتاحة
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("خطأ في قائمة الدلائل:", listError)
    } else {
      console.log(
        "الدلائل المتاحة:",
        buckets.map((b) => b.name),
      )
    }

    return { success: true, buckets }
  } catch (error) {
    console.error("خطأ في إنشاء دلائل التخزين:", error)
    return { success: false, error }
  }
}

export async function ensureBucketExists(bucketName: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
    })

    if (error && !error.message.includes("already exists")) {
      console.error(`Error creating bucket ${bucketName}:`, error)
      return { success: false, error }
    } else {
      console.log(`Bucket ${bucketName} exists or was successfully created.`)
      return { success: true }
    }
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error)
    return { success: false, error }
  }
}
