import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import AdminDashboard from "@/components/admin/admin-dashboard"
import StorageInitializer from "./storage-initializer"
import type { Profile, Skill, Project, SocialLink } from "@/lib/types"

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient()

  // التحقق مما إذا كان المدير مسجل الدخول
  const adminCookie = cookieStore.get("admin_authenticated")

  if (adminCookie?.value !== "true") {
    redirect("/admin")
  }

  // جلب جميع البيانات
  const { data: profileData } = await supabase.from("profiles").select("*").single()

  const { data: skillsData } = await supabase.from("skills").select("*").order("category")

  const { data: projectsData } = await supabase.from("projects").select("*")

  const { data: socialLinksData } = await supabase.from("social_links").select("*")

  const profile = profileData as Profile
  const skills = skillsData as Skill[]
  const projects = projectsData as Project[]
  const socialLinks = socialLinksData as SocialLink[]

  return (
    <>
      <StorageInitializer />
      <AdminDashboard profile={profile} skills={skills} projects={projects} socialLinks={socialLinks} />
    </>
  )
}
