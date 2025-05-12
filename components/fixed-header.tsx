"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Moon, Sun, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Profile } from "@/lib/types"
import Link from "next/link"
import VerificationBadge from "./verification-badge"

interface FixedHeaderProps {
  profile: Profile
}

export default function FixedHeader({ profile }: FixedHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md" : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg">
              <Image
                src={profile.avatar_url || "/placeholder.svg?height=40&width=40"}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <VerificationBadge size="sm" />
            </div>
          </div>
          <div className={`transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`}>
            <h2 className="font-bold text-sm md:text-base">{profile.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{profile.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="#contact">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="تواصل معي">
              <Mail className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            aria-label={theme === "dark" ? "تبديل إلى الوضع الفاتح" : "تبديل إلى الوضع المظلم"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
