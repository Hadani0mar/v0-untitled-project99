import type { Profile } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Laptop, Palette } from "lucide-react"

interface AboutProps {
  profile: Profile
}

export default function About({ profile }: AboutProps) {
  const features = [
    {
      icon: <Code className="h-10 w-10 text-blue-500" />,
      title: "كود نظيف",
      description: "كتابة كود نظيف وقابل للصيانة وفعال هي أولويتي.",
    },
    {
      icon: <Palette className="h-10 w-10 text-purple-500" />,
      title: "تصميم عصري",
      description: "إنشاء واجهات مستخدم جميلة وبديهية مع الاهتمام بالتفاصيل.",
    },
    {
      icon: <Laptop className="h-10 w-10 text-indigo-500" />,
      title: "متجاوب",
      description: "بناء تطبيقات تعمل بشكل مثالي على جميع الأجهزة وأحجام الشاشات.",
    },
  ]

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">نبذة عني</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{profile.bio}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
