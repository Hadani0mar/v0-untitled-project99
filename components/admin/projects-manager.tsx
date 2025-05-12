"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Project } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash } from "lucide-react"
import Image from "next/image"
import ImageUpload from "@/components/image-upload"
import { ensureBucketExists } from "@/lib/supabase/storage"
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

interface ProjectsManagerProps {
  projects: Project[]
}

export default function ProjectsManager({ projects }: ProjectsManagerProps) {
  const [newProject, setNewProject] = useState<Omit<Project, "id" | "created_at" | "updated_at">>({
    title: "",
    description: "",
    image_url: "",
    project_url: "",
    github_url: "",
  })

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isBucketReady, setBucketReady] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  // التحقق من وجود دلو صور المشاريع عند تحميل المكون
  useEffect(() => {
    const checkBucket = async () => {
      try {
        const result = await ensureBucketExists("project-images")
        setBucketReady(result.success)
      } catch (error) {
        console.error("خطأ أثناء التحقق من دلو صور المشاريع:", error)
        setBucketReady(false)
      }
    }

    checkBucket()
  }, [])

  const handleNewProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingProject) return
    const { name, value } = e.target
    setEditingProject((prev) => ({ ...prev!, [name]: value }))
  }

  const handleNewProjectImageUpload = (url: string) => {
    setNewProject((prev) => ({ ...prev, image_url: url }))
  }

  const handleEditProjectImageUpload = (url: string) => {
    if (!editingProject) return
    setEditingProject((prev) => ({ ...prev!, image_url: url }))
  }

  const handleAddProject = async () => {
    setIsLoading(true)

    try {
      // التأكد من وجود دلو صور المشاريع قبل الإضافة
      if (!isBucketReady) {
        const result = await ensureBucketExists("project-images")
        if (!result.success) {
          throw new Error("فشل في التحقق من وجود دلو صور المشاريع")
        }
        setBucketReady(true)
      }

      const { data, error } = await supabase
        .from("projects")
        .insert({
          title: newProject.title,
          description: newProject.description,
          image_url: newProject.image_url,
          project_url: newProject.project_url,
          github_url: newProject.github_url,
        })
        .select()

      if (error) throw error

      toast({
        title: "تمت إضافة المشروع",
        description: `تمت إضافة ${newProject.title} بنجاح`,
      })

      // إعادة تعيين النموذج
      setNewProject({
        title: "",
        description: "",
        image_url: "",
        project_url: "",
        github_url: "",
      })

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("خطأ في إضافة المشروع:", error)
      toast({
        title: "فشل إضافة المشروع",
        description: "حدث خطأ أثناء إضافة المشروع",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProject = async () => {
    if (!editingProject) return
    setIsLoading(true)

    try {
      // التأكد من وجود دلو صور المشاريع قبل التحديث
      if (!isBucketReady) {
        const result = await ensureBucketExists("project-images")
        if (!result.success) {
          throw new Error("فشل في التحقق من وجود دلو صور المشاريع")
        }
        setBucketReady(true)
      }

      const { error } = await supabase
        .from("projects")
        .update({
          title: editingProject.title,
          description: editingProject.description,
          image_url: editingProject.image_url,
          project_url: editingProject.project_url,
          github_url: editingProject.github_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingProject.id)

      if (error) throw error

      toast({
        title: "تم تحديث المشروع",
        description: `تم تحديث ${editingProject.title} بنجاح`,
      })

      setEditingProject(null)
      router.refresh()
    } catch (error) {
      console.error("خطأ في تحديث المشروع:", error)
      toast({
        title: "فشل التحديث",
        description: "فشل تحديث المشروع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("projects").delete().eq("id", projectId)

      if (error) throw error

      toast({
        title: "تم حذف المشروع",
        description: "تم حذف المشروع بنجاح",
      })

      router.refresh()
    } catch (error) {
      console.error("خطأ في حذف المشروع:", error)
      toast({
        title: "فشل الحذف",
        description: "فشل حذف المشروع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المشاريع</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مشروع
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة مشروع جديد</DialogTitle>
              <DialogDescription>أضف مشروعًا جديدًا لعرضه في ملفك الشخصي</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان المشروع</Label>
                <Input
                  id="title"
                  name="title"
                  value={newProject.title}
                  onChange={handleNewProjectChange}
                  placeholder="مثال: موقع تجارة إلكترونية"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newProject.description}
                  onChange={handleNewProjectChange}
                  placeholder="وصف موجز للمشروع"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>صورة المشروع</Label>
                <ImageUpload
                  onUploadComplete={handleNewProjectImageUpload}
                  currentImageUrl={newProject.image_url}
                  bucketName="project-images"
                  folderPath="projects"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_url">رابط المشروع</Label>
                <Input
                  id="project_url"
                  name="project_url"
                  value={newProject.project_url}
                  onChange={handleNewProjectChange}
                  placeholder="رابط المشروع المباشر"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">رابط GitHub</Label>
                <Input
                  id="github_url"
                  name="github_url"
                  value={newProject.github_url}
                  onChange={handleNewProjectChange}
                  placeholder="رابط مستودع GitHub"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddProject} disabled={isLoading}>
                {isLoading ? "جاري الإضافة..." : "إضافة المشروع"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="border-none shadow-lg overflow-hidden">
            <div className="relative h-40 w-full">
              <Image
                src={project.image_url || "/placeholder.svg?height=300&width=500"}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white dark:bg-gray-800"
                      onClick={() => setEditingProject(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>تعديل المشروع</DialogTitle>
                      <DialogDescription>تحديث تفاصيل هذا المشروع</DialogDescription>
                    </DialogHeader>
                    {editingProject && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">عنوان المشروع</Label>
                          <Input
                            id="edit-title"
                            name="title"
                            value={editingProject.title}
                            onChange={handleEditProjectChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">الوصف</Label>
                          <Textarea
                            id="edit-description"
                            name="description"
                            value={editingProject.description}
                            onChange={handleEditProjectChange}
                            rows={3}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>صورة المشروع</Label>
                          <ImageUpload
                            onUploadComplete={handleEditProjectImageUpload}
                            currentImageUrl={editingProject.image_url}
                            bucketName="project-images"
                            folderPath="projects"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-project_url">رابط المشروع</Label>
                          <Input
                            id="edit-project_url"
                            name="project_url"
                            value={editingProject.project_url}
                            onChange={handleEditProjectChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-github_url">رابط GitHub</Label>
                          <Input
                            id="edit-github_url"
                            name="github_url"
                            value={editingProject.github_url}
                            onChange={handleEditProjectChange}
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button onClick={handleUpdateProject} disabled={isLoading}>
                        {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800 text-red-500">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف المشروع</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من رغبتك في حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteProject(project.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
