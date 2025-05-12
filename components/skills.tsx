import type { Skill } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface SkillsProps {
  skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
  // Group skills by category
  const groupedSkills: Record<string, Skill[]> = {}

  skills.forEach((skill) => {
    if (!groupedSkills[skill.category]) {
      groupedSkills[skill.category] = []
    }
    groupedSkills[skill.category].push(skill)
  })

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
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
            <div key={category} className="animate-in" style={{ animationDelay: `${0.1 * categoryIndex}s` }}>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Badge variant="outline" className="mr-2 px-3 py-1">
                  {category}
                </Badge>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categorySkills.map((skill, skillIndex) => (
                  <div
                    key={skill.id}
                    className="glass-card p-4 rounded-lg animate-in"
                    style={{ animationDelay: `${0.1 * (categoryIndex + skillIndex + 1)}s` }}
                  >
                    <div className="text-center">
                      <h4 className="font-medium mb-2">{skill.name}</h4>
                      <div className="skill-bar">
                        <div className="skill-progress" style={{ width: `${skill.proficiency}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 inline-block">
                        {skill.proficiency}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
