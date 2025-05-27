import { createServerClient } from "@/lib/supabase/server"
import Hero from "@/components/hero"
import About from "@/components/about"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import BlogSection from "@/components/blog-section"
import Contact from "@/components/contact"
import ChatButton from "@/components/chat-button"
import ScrollToTop from "@/components/scroll-to-top"
import WelcomeMessage from "@/components/welcome-message"
import JsonLd from "@/components/json-ld"
import FixedHeader from "@/components/fixed-header"
import ColorBlobs from "@/components/color-blobs"
import AnalyticsTracker from "@/components/analytics-tracker"
import type { Profile, Skill, Project, SocialLink, BlogPost, BlogCategory } from "@/lib/types"
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

async function getAnalyticsData(supabase: any) {
  try {
    // جلب إجمالي مشاهدات المدونة مباشرة من Supabase
    const { data: blogStats, error: blogError } = await supabase.from("visitor_stats").select("blog_views")

    if (blogError) {
      console.warn("لم يتم العثور على إحصائيات المدونة، سيتم إنشاء بيانات افتراضية:", blogError.message)

      // إنشاء سجل افتراضي لليوم الحالي
      const today = new Date().toISOString().split("T")[0]
      await supabase.from("visitor_stats").upsert({
        date: today,
        page_views: 0,
        unique_visitors: 0,
        blog_views: 0,
      })

      return 0
    }

    const totalBlogViews = blogStats?.reduce((sum: number, stat: any) => sum + (stat.blog_views || 0), 0) || 0
    return totalBlogViews
  } catch (error) {
    console.warn("خطأ في جلب إحصائيات المدونة، سيتم استخدام قيمة افتراضية:", error)
    return 0
  }
}

export default async function Home() {
  try {
    const supabase = createServerClient()

    // Fetch all data with error handling
    const [
      { data: profileData, error: profileError },
      { data: skillsData, error: skillsError },
      { data: projectsData, error: projectsError },
      { data: socialLinksData, error: socialError },
      { data: blogPostsData, error: blogError },
      { data: categoriesData, error: categoriesError },
    ] = await Promise.all([
      supabase.from("profiles").select("*").single(),
      supabase.from("skills").select("*").order("category"),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("social_links").select("*").order("created_at"),
      supabase
        .from("blog_posts")
        .select(`
        *,
        category:blog_categories(*)
      `)
        .eq("published", true)
        .order("created_at", { ascending: false }),
      supabase.from("blog_categories").select("*").order("name"),
    ])

    // Log errors but continue with default values
    if (profileError) console.error("خطأ في جلب بيانات الملف الشخصي:", profileError)
    if (skillsError) console.error("خطأ في جلب المهارات:", skillsError)
    if (projectsError) console.error("خطأ في جلب المشاريع:", projectsError)
    if (socialError) console.error("خطأ في جلب روابط التواصل:", socialError)
    if (blogError) console.error("خطأ في جلب مقالات المدونة:", blogError)
    if (categoriesError) console.error("خطأ في جلب تصنيفات المدونة:", categoriesError)

    // Get analytics data directly from Supabase
    const totalBlogViews = await getAnalyticsData(supabase)

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
    const categories = (categoriesData as BlogCategory[]) || []

    return (
      <>
        <JsonLd profile={profile} skills={skills} projects={projects} socialLinks={socialLinks} />
        <AnalyticsTracker />
        <ColorBlobs />
        <FixedHeader profile={profile} />
        <ScrollToTop />
        <WelcomeMessage />
        <main className="min-h-screen pt-16">
          <Hero profile={profile} socialLinks={socialLinks} />
          <About profile={profile} />
          <Skills skills={skills} />
          <Projects projects={projects} />
          <BlogSection posts={blogPosts} categories={categories} totalViews={totalBlogViews} />
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
