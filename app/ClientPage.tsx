"use client"
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
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

async function getAnalyticsData(supabase: any) {
  try {
    const { data: blogStats, error: blogError } = await supabase.from("visitor_stats").select("blog_views")

    if (blogError) {
      console.warn("لم يتم العثور على إحصائيات المدونة، سيتم إنشاء بيانات افتراضية:", blogError.message)
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

export default function ClientPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [totalBlogViews, setTotalBlogViews] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب البيانات مع معالجة أفضل للأخطاء
        const [
          { data: profileData, error: profileError },
          { data: skillsData, error: skillsError },
          { data: projectsData, error: projectsError },
          { data: socialLinksData, error: socialError },
          { data: blogPostsData, error: blogError },
          { data: categoriesData, error: categoriesError },
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .limit(1), // استخدام limit(1) بدلاً من single()
          supabase.from("skills").select("*").order("category"),
          supabase.from("projects").select("*").order("created_at", { ascending: false }),
          supabase.from("social_links").select("*").order("created_at"),
          supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false }),
          supabase.from("blog_categories").select("*").order("name"),
        ])

        // تسجيل الأخطاء ولكن المتابعة بقيم افتراضية
        if (profileError) console.error("خطأ في جلب بيانات الملف الشخصي:", profileError)
        if (skillsError) console.error("خطأ في جلب المهارات:", skillsError)
        if (projectsError) console.error("خطأ في جلب المشاريع:", projectsError)
        if (socialError) console.error("خطأ في جلب روابط التواصل:", socialError)
        if (blogError) console.error("خطأ في جلب مقالات المدونة:", blogError)
        if (categoriesError) console.error("خطأ في جلب تصنيفات المدونة:", categoriesError)

        // جلب إحصائيات المدونة
        const totalBlogViews = await getAnalyticsData(supabase)

        // استخدام قيم افتراضية إذا كانت البيانات مفقودة
        const profile = (profileData && profileData.length > 0 ? (profileData[0] as Profile) : null) || {
          id: "1",
          name: "موسى عمر",
          title: "مطور واجهات أمامية",
          bio: "مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية باستخدام React وNext.js وTypeScript. أحب إنشاء تجارب مستخدم استثنائية وحلول تقنية مبتكرة.",
          avatar_url: "/placeholder.svg?height=400&width=400",
          is_available: true,
          verification_badge_style: "facebook",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const skills = (skillsData as Skill[]) || []
        const projects = (projectsData as Project[]) || []
        const socialLinks = (socialLinksData as SocialLink[]) || []

        // معالجة مقالات المدونة مع التصنيفات
        const blogPosts = (blogPostsData as BlogPost[]) || []
        const processedBlogPosts = blogPosts.map((post) => ({
          ...post,
          category: post.category_id ? categoriesData?.find((cat) => cat.id === post.category_id) : null,
        }))

        const categories = (categoriesData as BlogCategory[]) || []

        setProfile(profile)
        setSkills(skills)
        setProjects(projects)
        setSocialLinks(socialLinks)
        setBlogPosts(processedBlogPosts)
        setCategories(categories)
        setTotalBlogViews(totalBlogViews)
      } catch (error) {
        console.error("خطأ عام في الصفحة الرئيسية:", error)

        // تعيين قيم افتراضية في حالة الخطأ
        setProfile({
          id: "1",
          name: "موسى عمر",
          title: "مطور واجهات أمامية",
          bio: "مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية باستخدام React وNext.js وTypeScript. أحب إنشاء تجارب مستخدم استثنائية وحلول تقنية مبتكرة.",
          avatar_url: "/placeholder.svg?height=400&width=400",
          is_available: true,
          verification_badge_style: "facebook",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        setSkills([])
        setProjects([])
        setSocialLinks([])
        setBlogPosts([])
        setCategories([])
        setTotalBlogViews(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">جارٍ تحميل الصفحة...</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">يرجى الانتظار بينما يتم تحميل البيانات.</p>
        </div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">خطأ في تحميل الصفحة</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            نعتذر، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى لاحقاً.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      </main>
    )
  }

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
}
