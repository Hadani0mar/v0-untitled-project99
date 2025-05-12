"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Upload, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  currentImageUrl?: string
  bucketName?: string
  folderPath?: string
}

export default function ImageUpload({
  onUploadComplete,
  currentImageUrl,
  bucketName = "profile-images",
  folderPath = "avatars",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const { toast } = useToast()

  // تهيئة الدلو عند تحميل المكون
  useEffect(() => {
    const initBucket = async () => {
      try {
        // محاولة إنشاء الدلو (سيتم تجاهل الخطأ إذا كان موجودًا بالفعل)
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true,
        })

        if (error && !error.message.includes("already exists")) {
          console.error(`خطأ في إنشاء الدلو ${bucketName}:`, error)
        } else {
          console.log(`تم التحقق من وجود الدلو ${bucketName}`)
        }
      } catch (error) {
        console.error(`خطأ في تهيئة الدلو ${bucketName}:`, error)
      }
    }

    initBucket()
  }, [bucketName])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطأ في التحميل",
        description: "يرجى اختيار ملف صورة صالح",
        variant: "destructive",
      })
      return
    }

    // التحقق من حجم الملف (الحد الأقصى 5 ميجابايت)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "الملف كبير جدًا",
        description: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // إنشاء معاينة محلية
      const localPreview = URL.createObjectURL(file)
      setPreviewUrl(localPreview)

      // إنشاء اسم ملف فريد
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName

      console.log(`محاولة تحميل الملف إلى ${bucketName}/${filePath}`)

      // التحميل إلى Supabase Storage
      const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) {
        console.error("خطأ في تحميل الملف:", error)
        throw error
      }

      console.log("تم تحميل الملف بنجاح:", data)

      // الحصول على عنوان URL العام
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath)

      console.log("عنوان URL العام:", publicUrlData.publicUrl)

      if (!publicUrlData.publicUrl) {
        throw new Error("فشل في الحصول على عنوان URL العام للملف المحمل")
      }

      // استدعاء الدالة المرجعية مع عنوان URL الجديد
      onUploadComplete(publicUrlData.publicUrl)

      toast({
        title: "تم التحميل بنجاح",
        description: "تم تحميل الصورة بنجاح",
      })
    } catch (error) {
      console.error("خطأ في تحميل الصورة:", error)
      toast({
        title: "فشل التحميل",
        description: "حدث خطأ أثناء تحميل الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
      // إعادة تعيين المعاينة إذا فشل التحميل
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {previewUrl && (
        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
          <Image src={previewUrl || "/placeholder.svg"} alt="صورة المستخدم" fill className="object-cover" />
        </div>
      )}

      <div className="flex justify-center">
        <Button
          variant="outline"
          className="relative overflow-hidden"
          disabled={isUploading}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              جاري التحميل...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 ml-2" />
              {previewUrl ? "تغيير الصورة" : "تحميل صورة"}
            </>
          )}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </Button>
      </div>
    </div>
  )
}
