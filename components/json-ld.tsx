import type { Profile, Skill, Project, SocialLink } from "@/lib/types"

interface JsonLdProps {
  profile: Profile
  skills: Skill[]
  projects: Project[]
  socialLinks: SocialLink[]
}

export default function JsonLd({ profile, skills, projects, socialLinks }: JsonLdProps) {
  // إنشاء كائن البيانات المنظمة للشخص
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    image: profile.avatar_url,
    url: "https://mousa.org.ly",
    sameAs: socialLinks.map((link) => link.url),
    skills: skills.map((skill) => skill.name),
  }

  // إنشاء كائنات البيانات المنظمة للمشاريع
  const projectSchemas = projects.map((project) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.image_url,
    url: project.project_url,
    author: {
      "@type": "Person",
      name: profile.name,
    },
  }))

  // إنشاء كائن البيانات المنظمة للموقع
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.name} - ${profile.title}`,
    description: profile.bio,
    url: "https://mousa.org.ly",
    author: {
      "@type": "Person",
      name: profile.name,
    },
  }

  // دمج جميع البيانات المنظمة في مصفوفة واحدة
  const schemas = [personSchema, websiteSchema, ...projectSchemas]

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
}
