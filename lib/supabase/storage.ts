// Function to ensure a bucket exists by calling the server API
export async function ensureBucketExists(bucketName: string): Promise<{ success: boolean; error?: any }> {
  try {
    console.log(`التحقق من وجود الدلو: ${bucketName} عبر واجهة برمجة التطبيقات`)

    // Call the server API to initialize storage first
    const response = await fetch("/api/storage/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`خطأ في تهيئة التخزين:`, data.error)
      return { success: false, error: data.error }
    }

    // Check if our bucket is in the list of available buckets
    if (data.buckets && data.buckets.includes(bucketName)) {
      console.log(`الدلو ${bucketName} موجود ومتاح.`)
      return { success: true }
    } else {
      console.error(`الدلو ${bucketName} غير موجود في القائمة المتاحة.`)

      // محاولة إنشاء الدلو مرة أخرى
      console.log(`محاولة إنشاء الدلو ${bucketName} مرة أخرى...`)

      const retryResponse = await fetch("/api/storage/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const retryData = await retryResponse.json()

      if (retryResponse.ok && retryData.buckets && retryData.buckets.includes(bucketName)) {
        console.log(`تم إنشاء الدلو ${bucketName} بنجاح في المحاولة الثانية.`)
        return { success: true }
      } else {
        return { success: false, error: `الدلو ${bucketName} غير موجود` }
      }
    }
  } catch (error) {
    console.error(`استثناء أثناء التحقق من وجود الدلو ${bucketName}:`, error)
    return { success: false, error }
  }
}
