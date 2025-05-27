import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import AdminDashboard from "@/components/admin/admin-dashboard"
import StorageInitializer from "./storage-initializer"
import type { Profile, Skill, Project, SocialLink, BlogPost, BlogCategory } from "@/lib/types"

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

  const { data: blogPostsData } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: blogCategoriesData } = await supabase.from("blog_categories").select("*").order("name")

  const profile = profileData as Profile
  const skills = skillsData as Skill[]
  const projects = projectsData as Project[]
  const socialLinks = socialLinksData as SocialLink[]
  const blogPosts = blogPostsData as BlogPost[]
  const blogCategories = blogCategoriesData as BlogCategory[]

  return (
    <>
      <StorageInitializer />
      <AdminDashboard
        profile={profile}
        skills={skills}
        projects={projects}
        socialLinks={socialLinks}
        blogPosts={blogPosts}
        blogCategories={blogCategories}
      />
    </>
  )
}
