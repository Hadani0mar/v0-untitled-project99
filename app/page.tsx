import { createServerClient } from "@/lib/supabase/server"
import Hero from "@/components/hero"
import About from "@/components/about"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Blog from "@/components/blog"
import Contact from "@/components/contact"
import ChatButton from "@/components/chat-button"
import ScrollToTop from "@/components/scroll-to-top"
import WelcomeMessage from "@/components/welcome-message"
import JsonLd from "@/components/json-ld"
import FixedHeader from "@/components/fixed-header"
import ColorBlobs from "@/components/color-blobs"
import type { Profile, Skill, Project, SocialLink, BlogPost } from "@/lib/types"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient()
    const { data: profileData } = await supabase.from("profiles").select("*").single()
    const profile = profileData as Profile

    if (!profile) {
      return {
        title: "موسى عمر | مطور واجهات أمامية محترف",
        description: "الملف الشخصي المهني لموسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية",
      }
    }

    return {
      title: `${profile.name} | ${profile.title}`,
      description: profile.bio,
    }
  } catch (error) {
    console.error("خطأ في جلب البيانات الوصفية:", error)
    return {
      title: "موسى عمر | مطور واجهات أمامية محترف",
      description: "الملف الشخصي المهني لموسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية",
    }
  }
}

export default async function Home() {
  try {
    const supabase = createServerClient()

    // Fetch profile data with error handling
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").single()
    if (profileError) {
      console.error("خطأ في جلب بيانات الملف الشخصي:", profileError)
    }

    // Fetch skills with error handling
    const { data: skillsData, error: skillsError } = await supabase.from("skills").select("*").order("category")
    if (skillsError) {
      console.error("خطأ في جلب المهارات:", skillsError)
    }

    // Fetch projects with error handling
    const { data: projectsData, error: projectsError } = await supabase.from("projects").select("*")
    if (projectsError) {
      console.error("خطأ في جلب المشاريع:", projectsError)
    }

    // Fetch social links with error handling
    const { data: socialLinksData, error: socialError } = await supabase.from("social_links").select("*")
    if (socialError) {
      console.error("خطأ في جلب روابط التواصل:", socialError)
    }

    // Fetch published blog posts with error handling
    const { data: blogPostsData, error: blogError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
    if (blogError) {
      console.error("خطأ في جلب مقالات المدونة:", blogError)
    }

    // Use default values if data is missing
    const profile = (profileData as Profile) || {
      id: "1",
      name: "موسى عمر",
      title: "مطور واجهات أمامية",
      bio: "مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية",
      avatar_url: "/placeholder.svg?height=400&width=400",
      is_available: true,
      verification_badge_style: "facebook",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const skills = (skillsData as Skill[]) || []
    const projects = (projectsData as Project[]) || []
    const socialLinks = (socialLinksData as SocialLink[]) || []
    const blogPosts = (blogPostsData as BlogPost[]) || []

    return (
      <>
        <JsonLd profile={profile} skills={skills} projects={projects} socialLinks={socialLinks} />
        <ColorBlobs />
        <FixedHeader profile={profile} />
        <ScrollToTop />
        <WelcomeMessage />
        <main className="min-h-screen pt-16">
          <Hero profile={profile} socialLinks={socialLinks} />
          <About profile={profile} />
          <Skills skills={skills} />
          <Projects projects={projects} />
          <Blog posts={blogPosts} />
          <Contact
            socialLinks={socialLinks}
            email="mousa.omar.com@gmail.com"
            phone="+218931303032"
            address="سبها، ليبيا"
          />
          <ChatButton />
        </main>
      </>
    )
  } catch (error) {
    console.error("خطأ عام في الصفحة الرئيسية:", error)

    // Return a basic error page or fallback
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">خطأ في تحميل الصفحة</h1>
          <p className="text-gray-600">يرجى المحاولة مرة أخرى لاحقاً</p>
        </div>
      </main>
    )
  }
}
