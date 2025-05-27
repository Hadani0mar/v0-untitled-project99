import type { BlogPost, BlogCategory } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp } from "lucide-react"
import BlogModal from "./blog-modal"

interface BlogSectionProps {
  posts: BlogPost[]
  categories: BlogCategory[]
  totalViews?: number
}

export default function BlogSection({ posts, categories, totalViews = 0 }: BlogSectionProps) {
  const publishedPosts = posts.filter((post) => post.published).slice(0, 3)

  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">المدونة</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            مقالات تقنية ونصائح في تطوير الويب والبرمجة
          </p>

          {/* عداد المشاهدات */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-4 w-4" />
            <span>{totalViews.toLocaleString()} مشاهدة إجمالية</span>
          </div>
        </div>

        {publishedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {publishedPosts.map((post, index) => (
                <BlogModal key={post.id} post={post} categories={categories}>
                  <div
                    className="cursor-pointer group animate-in hover-lift"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border-none">
                      {post.featured_image_url && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={post.featured_image_url || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {post.category && (
                            <div className="absolute top-3 right-3">
                              <span
                                className="px-2 py-1 text-xs font-medium rounded-full text-white"
                                style={{ backgroundColor: post.category.color || "#3b82f6" }}
                              >
                                {post.category.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
                          <span>{new Date(post.created_at).toLocaleDateString("ar-SA")}</span>
                          {post.reading_time && (
                            <>
                              <span>•</span>
                              <span>{post.reading_time} دقائق قراءة</span>
                            </>
                          )}
                          {post.views && (
                            <>
                              <span>•</span>
                              <span>{post.views} مشاهدة</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{post.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </BlogModal>
              ))}
            </div>

            <div className="text-center">
              <BlogModal posts={posts} categories={categories} showAll>
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  تصفح جميع المقالات
                </Button>
              </BlogModal>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              لم يتم نشر أي مقالات بعد. ترقبوا المحتوى الجديد قريباً!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
