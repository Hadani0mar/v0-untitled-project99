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
  const supabase = createServerClient()
  const { data: profileData } = await supabase.from("profiles").select("*").single()
  const profile = profileData as Profile

  return {
    title: `${profile.name} | ${profile.title}`,
    description: profile.bio,
  }
}

export default async function Home() {
  const supabase = createServerClient()

  // Fetch profile data
  const { data: profileData } = await supabase.from("profiles").select("*").single()

  // Fetch skills
  const { data: skillsData } = await supabase.from("skills").select("*").order("category")

  // Fetch projects
  const { data: projectsData } = await supabase.from("projects").select("*")

  // Fetch social links
  const { data: socialLinksData } = await supabase.from("social_links").select("*")

  // Fetch published blog posts
  const { data: blogPostsData } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  const profile = profileData as Profile
  const skills = skillsData as Skill[]
  const projects = projectsData as Project[]
  const socialLinks = socialLinksData as SocialLink[]
  const blogPosts = blogPostsData as BlogPost[]

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
}
