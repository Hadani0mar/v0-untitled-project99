import type { Profile, SocialLink } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Facebook, Github, Linkedin, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface HeroProps {
  profile: Profile
  socialLinks: SocialLink[]
}

export default function Hero({ profile, socialLinks }: HeroProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      default:
        return <ExternalLink className="h-5 w-5" />
    }
  }

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" aria-labelledby="hero-heading">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-bl from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 z-0"></div>

      {/* أشكال زخرفية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 space-y-8 animate-in">
            <div className="space-y-4">
              <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold gradient-text leading-tight">
                {profile.name}
              </h1>
              <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300">{profile.title}</h2>
              {profile.is_available ? (
                <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 text-sm">متاح للعمل</Badge>
              ) : (
                <Badge variant="outline" className="px-4 py-1 text-sm">
                  غير متاح حاليًا
                </Badge>
              )}
            </div>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <a href="#contact">تواصل معي</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full text-base px-8 py-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <a href="#projects">عرض المشاريع</a>
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`زيارة ${link.platform}`}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-110"
                >
                  {getSocialIcon(link.platform)}
                </Link>
              ))}
            </div>
          </div>

          <div
            className="w-full md:w-1/2 flex justify-center md:justify-end animate-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden gradient-border shadow-2xl">
              <Image
                src={profile.avatar_url || "/placeholder.svg?height=384&width=384"}
                alt={profile.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 288px, 384px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
