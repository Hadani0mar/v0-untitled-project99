"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { BlogPost, BlogCategory } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import ImageUpload from "@/components/image-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BlogManagerProps {
  posts: BlogPost[]
  categories: BlogCategory[]
}

export default function BlogManager({ posts, categories }: BlogManagerProps) {
  const [newPost, setNewPost] = useState<Omit<BlogPost, "id" | "created_at" | "updated_at">>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    published: false,
  })

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isBucketReady, setBucketReady] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  // التحقق من وجود دلو صور المدونة عند تحميل المكون
  useEffect(() => {
    const checkBucket = async () => {
      try {
        // محاولة تهيئة التخزين أولاً
        const initResponse = await fetch("/api/storage/init", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (initResponse.ok) {
          const initData = await initResponse.json()
          console.log("تم تهيئة التخزين بنجاح:", initData.buckets)

          // التحقق من وجود دلو صور المدونة
          if (initData.buckets && initData.buckets.includes("blog-images")) {
            setBucketReady(true)
          } else {
            console.warn("دلو صور المدونة غير موجود في القائمة")
            setBucketReady(false)
          }
        } else {
          console.error("فشل في تهيئة التخزين")
          setBucketReady(false)
        }
      } catch (error) {
        console.error("خطأ أثناء التحقق من دلو صور المدونة:", error)
        setBucketReady(false)
      }
    }

    checkBucket()
  }, [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }

  const handleNewPostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "title") {
      setNewPost((prev) => ({ ...prev, [name]: value, slug: generateSlug(value) }))
    } else {
      setNewPost((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleEditPostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingPost) return
    const { name, value } = e.target
    if (name === "title") {
      setEditingPost((prev) => ({ ...prev!, [name]: value, slug: generateSlug(value) }))
    } else {
      setEditingPost((prev) => ({ ...prev!, [name]: value }))
    }
  }

  const handleNewPostImageUpload = (url: string) => {
    setNewPost((prev) => ({ ...prev, featured_image_url: url }))
  }

  const handleEditPostImageUpload = (url: string) => {
    if (!editingPost) return
    setEditingPost((prev) => ({ ...prev!, featured_image_url: url }))
  }

  const handleAddPost = async () => {
    setIsLoading(true)

    try {
      // التأكد من وجود دلو صور المدونة قبل الإضافة
      if (!isBucketReady) {
        // محاولة تهيئة التخزين مرة أخرى
        const initResponse = await fetch("/api/storage/init", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (initResponse.ok) {
          const initData = await initResponse.json()
          if (initData.buckets && initData.buckets.includes("blog-images")) {
            setBucketReady(true)
          } else {
            throw new Error("فشل في التحقق من وجود دلو صور المدونة")
          }
        } else {
          throw new Error("فشل في تهيئة التخزين")
        }
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: newPost.title,
          slug: newPost.slug,
          content: newPost.content,
          excerpt: newPost.excerpt,
          featured_image_url: newPost.featured_image_url,
          published: newPost.published,
        })
        .select()

      if (error) throw error

      toast({
        title: "تمت إضافة المقال",
        description: `تمت إضافة ${newPost.title} بنجاح`,
      })

      // إعادة تعيين النموذج
      setNewPost({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featured_image_url: "",
        published: false,
      })

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("خطأ في إضافة المقال:", error)
      toast({
        title: "فشل إضافة المقال",
        description: "حدث خطأ أثناء إضافة المقال",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePost = async () => {
    if (!editingPost) return
    setIsLoading(true)

    try {
      // التأكد من وجود دلو صور المدونة قبل التحديث
      if (!isBucketReady) {
        // محاولة تهيئة التخزين مرة أخرى
        const initResponse = await fetch("/api/storage/init", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (initResponse.ok) {
          const initData = await initResponse.json()
          if (initData.buckets && initData.buckets.includes("blog-images")) {
            setBucketReady(true)
          } else {
            throw new Error("فشل في التحقق من وجود دلو صور المدونة")
          }
        } else {
          throw new Error("فشل في تهيئة التخزين")
        }
      }

      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: editingPost.title,
          slug: editingPost.slug,
          content: editingPost.content,
          excerpt: editingPost.excerpt,
          featured_image_url: editingPost.featured_image_url,
          published: editingPost.published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingPost.id)

      if (error) throw error

      toast({
        title: "تم تحديث المقال",
        description: `تم تحديث ${editingPost.title} بنجاح`,
      })

      setEditingPost(null)
      router.refresh()
    } catch (error) {
      console.error("خطأ في تحديث المقال:", error)
      toast({
        title: "فشل التحديث",
        description: "فشل تحديث المقال. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", postId)

      if (error) throw error

      toast({
        title: "تم حذف المقال",
        description: "تم حذف المقال بنجاح",
      })

      router.refresh()
    } catch (error) {
      console.error("خطأ في حذف المقال:", error)
      toast({
        title: "فشل الحذف",
        description: "فشل حذف المقال. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePublished = async (post: BlogPost) => {
    try {
      const { error } = await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id)

      if (error) throw error

      toast({
        title: post.published ? "تم إخفاء المقال" : "تم نشر المقال",
        description: `تم ${post.published ? "إخفاء" : "نشر"} المقال بنجاح`,
      })

      router.refresh()
    } catch (error) {
      console.error("خطأ في تغيير حالة النشر:", error)
      toast({
        title: "فشل التحديث",
        description: "فشل تحديث حالة النشر",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المدونة</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مقال
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة مقال جديد</DialogTitle>
              <DialogDescription>أضف مقالاً جديداً لمدونتك</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان المقال</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newPost.title}
                    onChange={handleNewPostChange}
                    placeholder="عنوان المقال"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">الرابط المختصر</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={newPost.slug}
                    onChange={handleNewPostChange}
                    placeholder="article-slug"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">المقتطف</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={newPost.excerpt}
                  onChange={handleNewPostChange}
                  placeholder="مقتطف قصير عن المقال"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>الصورة المميزة</Label>
                <ImageUpload
                  onUploadComplete={handleNewPostImageUpload}
                  currentImageUrl={newPost.featured_image_url}
                  bucketName="blog-images"
                  folderPath="featured"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">محتوى المقال</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={newPost.content}
                  onChange={handleNewPostChange}
                  placeholder="اكتب محتوى المقال هنا... يمكنك استخدام Markdown"
                  rows={10}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={newPost.published}
                  onCheckedChange={(checked) => setNewPost((prev) => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published" className="mr-2">
                  نشر المقال
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPost} disabled={isLoading}>
                {isLoading ? "جاري الإضافة..." : "إضافة المقال"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {post.featured_image_url && (
                  <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={post.featured_image_url || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">/{post.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePublished(post)}
                        className={post.published ? "text-green-600" : "text-gray-400"}
                      >
                        {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setEditingPost(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>تعديل المقال</DialogTitle>
                            <DialogDescription>تحديث تفاصيل هذا المقال</DialogDescription>
                          </DialogHeader>
                          {editingPost && (
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-title">عنوان المقال</Label>
                                  <Input
                                    id="edit-title"
                                    name="title"
                                    value={editingPost.title}
                                    onChange={handleEditPostChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-slug">الرابط المختصر</Label>
                                  <Input
                                    id="edit-slug"
                                    name="slug"
                                    value={editingPost.slug}
                                    onChange={handleEditPostChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-excerpt">المقتطف</Label>
                                <Textarea
                                  id="edit-excerpt"
                                  name="excerpt"
                                  value={editingPost.excerpt}
                                  onChange={handleEditPostChange}
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>الصورة المميزة</Label>
                                <ImageUpload
                                  onUploadComplete={handleEditPostImageUpload}
                                  currentImageUrl={editingPost.featured_image_url}
                                  bucketName="blog-images"
                                  folderPath="featured"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-content">محتوى المقال</Label>
                                <Textarea
                                  id="edit-content"
                                  name="content"
                                  value={editingPost.content}
                                  onChange={handleEditPostChange}
                                  rows={10}
                                  required
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-published"
                                  checked={editingPost.published}
                                  onCheckedChange={(checked) =>
                                    setEditingPost((prev) => ({ ...prev!, published: checked }))
                                  }
                                />
                                <Label htmlFor="edit-published" className="mr-2">
                                  نشر المقال
                                </Label>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button onClick={handleUpdatePost} disabled={isLoading}>
                              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف المقال</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من رغبتك في حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePost(post.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {post.excerpt && <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(post.created_at).toLocaleDateString("ar-SA")}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        post.published
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {post.published ? "منشور" : "مسودة"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
