"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Profile, Skill, Project, SocialLink, BlogPost, BlogCategory } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut, User, Code, Briefcase, Link2, Bot, BookOpen } from "lucide-react"
import ProfileForm from "./profile-form"
import SkillsManager from "./skills-manager"
import ProjectsManager from "./projects-manager"
import SocialLinksManager from "./social-links-manager"
import AiInstructionsManager from "./ai-instructions-manager"
import BlogManager from "./blog-manager"
import { useMediaQuery } from "@/hooks/use-media-query"

interface AdminDashboardProps {
  profile: Profile
  skills: Skill[]
  projects: Project[]
  socialLinks: SocialLink[]
  blogPosts: BlogPost[]
  blogCategories: BlogCategory[]
}

export default function AdminDashboard({
  profile,
  skills,
  projects,
  socialLinks,
  blogPosts,
  blogCategories,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const { toast } = useToast()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      })

      toast({
        title: "تم تسجيل الخروج بنجاح",
      })

      router.push("/admin")
      router.refresh()
    } catch (error) {
      toast({
        title: "فشل تسجيل الخروج",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">لوحة الإدارة</h1>
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <TabsList className={`grid ${isMobile ? "grid-cols-3 gap-2 mb-4" : "grid-cols-6"} w-full`}>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">الملف الشخصي</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">المهارات</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">المشاريع</span>
              </TabsTrigger>
              {isMobile ? null : (
                <>
                  <TabsTrigger value="blog" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">المدونة</span>
                  </TabsTrigger>
                  <TabsTrigger value="social" className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    <span className="hidden sm:inline">روابط التواصل</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="hidden sm:inline">الذكاء الاصطناعي</span>
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {isMobile && (
              <TabsList className="grid grid-cols-3 gap-2 w-full">
                <TabsTrigger value="blog" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">المدونة</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  <span className="hidden sm:inline">روابط التواصل</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span className="hidden sm:inline">الذكاء الاصطناعي</span>
                </TabsTrigger>
              </TabsList>
            )}
          </div>

          <TabsContent value="profile" className="space-y-4 animate-in">
            <ProfileForm profile={profile} />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4 animate-in">
            <SkillsManager skills={skills} />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 animate-in">
            <ProjectsManager projects={projects} />
          </TabsContent>

          <TabsContent value="blog" className="space-y-4 animate-in">
            <BlogManager posts={blogPosts} categories={blogCategories} />
          </TabsContent>

          <TabsContent value="social" className="space-y-4 animate-in">
            <SocialLinksManager socialLinks={socialLinks} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 animate-in">
            <AiInstructionsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
