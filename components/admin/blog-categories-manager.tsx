"use client"

import type React from "react"

import { useState } from "react"
import type { BlogCategory } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash, Tag } from "lucide-react"
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

interface BlogCategoriesManagerProps {
  categories: BlogCategory[]
}

const colorOptions = [
  { name: "أزرق", value: "#3b82f6" },
  { name: "أخضر", value: "#10b981" },
  { name: "أحمر", value: "#ef4444" },
  { name: "أرجواني", value: "#8b5cf6" },
  { name: "وردي", value: "#ec4899" },
  { name: "برتقالي", value: "#f97316" },
  { name: "أصفر", value: "#eab308" },
  { name: "رمادي", value: "#6b7280" },
]

export default function BlogCategoriesManager({ categories }: BlogCategoriesManagerProps) {
  const [newCategory, setNewCategory] = useState<Omit<BlogCategory, "id" | "created_at" | "updated_at">>({
    name: "",
    slug: "",
    description: "",
    color: "#3b82f6",
  })

  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "name") {
      setNewCategory((prev) => ({ ...prev, [name]: value, slug: generateSlug(value) }))
    } else {
      setNewCategory((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingCategory) return
    const { name, value } = e.target
    if (name === "name") {
      setEditingCategory((prev) => ({ ...prev!, [name]: value, slug: generateSlug(value) }))
    } else {
      setEditingCategory((prev) => ({ ...prev!, [name]: value }))
    }
  }

  const handleAddCategory = async () => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("blog_categories")
        .insert({
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description,
          color: newCategory.color,
        })
        .select()

      if (error) throw error

      toast({
        title: "تمت إضافة التصنيف",
        description: `تمت إضافة ${newCategory.name} بنجاح`,
      })

      setNewCategory({
        name: "",
        slug: "",
        description: "",
        color: "#3b82f6",
      })

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("خطأ في إضافة التصنيف:", error)
      toast({
        title: "فشل إضافة التصنيف",
        description: "حدث خطأ أثناء إضافة التصنيف",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("blog_categories")
        .update({
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description,
          color: editingCategory.color,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingCategory.id)

      if (error) throw error

      toast({
        title: "تم تحديث التصنيف",
        description: `تم تحديث ${editingCategory.name} بنجاح`,
      })

      setEditingCategory(null)
      router.refresh()
    } catch (error) {
      console.error("خطأ في تحديث التصنيف:", error)
      toast({
        title: "فشل التحديث",
        description: "فشل تحديث التصنيف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("blog_categories").delete().eq("id", categoryId)

      if (error) throw error

      toast({
        title: "تم حذف التصنيف",
        description: "تم حذف التصنيف بنجاح",
      })

      router.refresh()
    } catch (error) {
      console.error("خطأ في حذف التصنيف:", error)
      toast({
        title: "فشل الحذف",
        description: "فشل حذف التصنيف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة تصنيفات المدونة</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة تصنيف
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة تصنيف جديد</DialogTitle>
              <DialogDescription>أضف تصنيفاً جديداً لتنظيم مقالات المدونة</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم التصنيف</Label>
                <Input
                  id="name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleNewCategoryChange}
                  placeholder="مثال: تطوير الويب"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">الرابط المختصر</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={newCategory.slug}
                  onChange={handleNewCategoryChange}
                  placeholder="web-development"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleNewCategoryChange}
                  placeholder="وصف مختصر للتصنيف"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">اللون</Label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategory.color === color.value ? "border-gray-800 dark:border-white" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewCategory((prev) => ({ ...prev, color: color.value }))}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCategory} disabled={isLoading}>
                {isLoading ? "جاري الإضافة..." : "إضافة التصنيف"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color || "#3b82f6" }} />
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setEditingCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تعديل التصنيف</DialogTitle>
                        <DialogDescription>تحديث تفاصيل هذا التصنيف</DialogDescription>
                      </DialogHeader>
                      {editingCategory && (
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">اسم التصنيف</Label>
                            <Input
                              id="edit-name"
                              name="name"
                              value={editingCategory.name}
                              onChange={handleEditCategoryChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-slug">الرابط المختصر</Label>
                            <Input
                              id="edit-slug"
                              name="slug"
                              value={editingCategory.slug}
                              onChange={handleEditCategoryChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-description">الوصف</Label>
                            <Textarea
                              id="edit-description"
                              name="description"
                              value={editingCategory.description}
                              onChange={handleEditCategoryChange}
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-color">اللون</Label>
                            <div className="flex gap-2 flex-wrap">
                              {colorOptions.map((color) => (
                                <button
                                  key={color.value}
                                  type="button"
                                  className={`w-8 h-8 rounded-full border-2 ${
                                    editingCategory.color === color.value
                                      ? "border-gray-800 dark:border-white"
                                      : "border-gray-300"
                                  }`}
                                  style={{ backgroundColor: color.value }}
                                  onClick={() => setEditingCategory((prev) => ({ ...prev!, color: color.value }))}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button onClick={handleUpdateCategory} disabled={isLoading}>
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
                        <AlertDialogTitle>حذف التصنيف</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد من رغبتك في حذف هذا التصنيف؟ لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Tag className="h-3 w-3" />
                <span>تم الإنشاء في {new Date(category.created_at).toLocaleDateString("ar-SA")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
