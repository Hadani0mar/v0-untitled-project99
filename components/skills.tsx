"use client"

import { useEffect, useRef } from "react"
import type { Skill } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import ParallaxEffect from "./parallax-effect"

interface SkillsProps {
  skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
  // Group skills by category
  const groupedSkills: Record<string, Skill[]> = {}
  const sectionRef = useRef<HTMLElement>(null)

  skills.forEach((skill) => {
    if (!groupedSkills[skill.category]) {
      groupedSkills[skill.category] = []
    }
    groupedSkills[skill.category].push(skill)
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const fadeElements = document.querySelectorAll(".fade-in-section")
    fadeElements.forEach((el) => observer.observe(el))

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="py-20 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">مهاراتي</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            هذه هي التقنيات والأدوات التي أتخصص فيها.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
            <div key={category} className="fade-in-section" style={{ animationDelay: `${0.1 * categoryIndex}s` }}>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Badge variant="outline" className="mr-2 px-3 py-1">
                  {category}
                </Badge>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categorySkills.map((skill, skillIndex) => (
                  <ParallaxEffect key={skill.id} speed={0.02} className="h-full">
                    <div
                      className="glass-card p-4 rounded-lg fade-in-section card-3d h-full relative overflow-hidden"
                      style={{ animationDelay: `${0.1 * (categoryIndex + skillIndex + 1)}s` }}
                    >
                      {/* بقع الألوان الداخلية */}
                      <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-blue-300/30 dark:bg-white/10 blur-xl"></div>
                      <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-purple-300/30 dark:bg-white/10 blur-xl"></div>

                      <div className="text-center relative z-10">
                        <h4 className="font-medium mb-2">{skill.name}</h4>
                        <div className="skill-bar">
                          <div
                            className="skill-progress"
                            style={{
                              width: `0%`,
                              transition: "width 1s ease-in-out",
                              animationDelay: `${0.5 + 0.1 * skillIndex}s`,
                            }}
                            data-width={`${skill.proficiency}%`}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 inline-block">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </div>
                  </ParallaxEffect>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
