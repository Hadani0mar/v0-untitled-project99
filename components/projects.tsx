import type { Project } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectsProps {
  projects: Project[]
}

export default function Projects({ projects }: ProjectsProps) {
  if (projects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">مشاريعي</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              لم يتم إضافة أي مشاريع بعد. قم بإضافة مشاريعك من لوحة الإدارة.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">مشاريعي</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">تفقد بعض أعمالي الحديثة.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={project.image_url || "/placeholder.svg?height=300&width=500"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0 flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 ml-2" />
                    عرض المشروع
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 ml-2" />
                    الكود
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
