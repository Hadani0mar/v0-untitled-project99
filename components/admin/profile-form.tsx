"use client"

import type React from "react"

import { useState } from "react"
import type { Profile } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/image-upload"
import { ensureBucketExists } from "@/lib/supabase/storage"

interface ProfileFormProps {
  profile: Profile
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [formData, setFormData] = useState<Omit<Profile, "id" | "created_at" | "updated_at">>({
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    is_available: profile.is_available,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_available: checked }))
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar_url: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // التأكد من وجود دلو الصور الشخصية قبل الحفظ
      await ensureBucketExists("profile-images")

      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error

      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم تحديث معلومات الملف الشخصي بنجاح",
      })

      router.refresh()
    } catch (error) {
      console.error("خطأ في تحديث الملف الشخصي:", error)
      toast({
        title: "فشل التحديث",
        description: "فشل تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>تعديل الملف الشخصي</CardTitle>
        <CardDescription>تحديث معلوماتك الشخصية وحالة التوفر</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <ImageUpload
              onUploadComplete={handleImageUpload}
              currentImageUrl={formData.avatar_url}
              bucketName="profile-images"
              folderPath="avatars"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">المسمى الوظيفي</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">نبذة تعريفية</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={5} />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="is_available" checked={formData.is_available} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_available" className="mr-2">
              متاح للعمل
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
