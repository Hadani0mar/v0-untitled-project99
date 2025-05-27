import type { BlogPost } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BlogProps {
  posts: BlogPost[]
}

export default function Blog({ posts }: BlogProps) {
  const publishedPosts = posts.filter((post) => post.published)

  if (publishedPosts.length === 0) {
    return (
      <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">المدونة</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              لم يتم نشر أي مقالات بعد. ترقبوا المحتوى الجديد قريباً!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">المدونة</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            مقالات تقنية ونصائح في تطوير الويب والبرمجة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPosts.slice(0, 6).map((post, index) => (
            <Card
              key={post.id}
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              {post.featured_image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.featured_image_url || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.created_at).toLocaleDateString("ar-SA")}</span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>5 دقائق قراءة</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                {post.excerpt && <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.slice(0, 2).map((category) => (
                      <Badge key={category.id} variant="secondary" className="text-xs">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/blog/${post.slug}`}>
                    <ExternalLink className="h-4 w-4 ml-2" />
                    قراءة المقال
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {publishedPosts.length > 6 && (
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/blog">عرض جميع المقالات</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
