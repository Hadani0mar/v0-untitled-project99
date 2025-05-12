// Function to ensure a bucket exists by calling the server API
export async function ensureBucketExists(bucketName: string): Promise<{ success: boolean; error?: any }> {
  try {
    console.log(`التحقق من وجود الدلو: ${bucketName} عبر واجهة برمجة التطبيقات`)

    // Call the server API to initialize storage
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
      return { success: false, error: `الدلو ${bucketName} غير موجود` }
    }
  } catch (error) {
    console.error(`استثناء أثناء التحقق من وجود الدلو ${bucketName}:`, error)
    return { success: false, error }
  }
}
