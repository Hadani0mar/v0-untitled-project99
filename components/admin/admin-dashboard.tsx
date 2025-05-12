"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Profile, Skill, Project, SocialLink } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"
import ProfileForm from "./profile-form"
import SkillsManager from "./skills-manager"
import ProjectsManager from "./projects-manager"
import SocialLinksManager from "./social-links-manager"
import AiInstructionsManager from "./ai-instructions-manager"

interface AdminDashboardProps {
  profile: Profile
  skills: Skill[]
  projects: Project[]
  socialLinks: SocialLink[]
}

export default function AdminDashboard({ profile, skills, projects, socialLinks }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const { toast } = useToast()
  const router = useRouter()

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
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">لوحة الإدارة</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
            <TabsTrigger value="skills">المهارات</TabsTrigger>
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
            <TabsTrigger value="social">روابط التواصل</TabsTrigger>
            <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileForm profile={profile} />
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SkillsManager skills={skills} />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsManager projects={projects} />
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <SocialLinksManager socialLinks={socialLinks} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <AiInstructionsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
