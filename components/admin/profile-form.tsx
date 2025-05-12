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
import { Save, Mail } from "lucide-react"

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
    <Card className="border-none shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 pb-8">
        <CardTitle className="text-2xl">تعديل الملف الشخصي</CardTitle>
        <CardDescription>تحديث معلوماتك الشخصية وحالة التوفر</CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="mb-8">
            <ImageUpload
              onUploadComplete={handleImageUpload}
              currentImageUrl={formData.avatar_url}
              bucketName="profile-images"
              folderPath="avatars"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base">
                الاسم
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="title" className="text-base">
                المسمى الوظيفي
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="bio" className="text-base">
              نبذة تعريفية
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={6}
              className="text-base resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-base">
              البريد الإلكتروني للتواصل
            </Label>
            <div className="flex items-center">
              <Mail className="h-5 w-5 ml-2 text-gray-500" />
              <Input
                id="email"
                value="mousa.omar.com@gmail.com"
                readOnly
                className="h-12 text-base bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <p className="text-sm text-gray-500">هذا البريد الإلكتروني سيظهر في قسم التواصل</p>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <Switch id="is_available" checked={formData.is_available} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_available" className="mr-2 text-base font-medium">
              متاح للعمل
            </Label>
            <p className="mr-auto text-sm text-gray-500">
              {formData.is_available ? "سيظهر للزوار أنك متاح للعمل" : "سيظهر للزوار أنك غير متاح للعمل حاليًا"}
            </p>
          </div>

          <Button type="submit" className="w-full h-12 text-base flex items-center gap-2" disabled={isLoading}>
            <Save className="h-5 w-5" />
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
