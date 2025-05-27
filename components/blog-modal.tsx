"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { BlogPost, BlogCategory } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Share2, Eye, Calendar, Clock, Search, Filter, Minimize2, Maximize2, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BlogModalProps {
  post?: BlogPost
  posts?: BlogPost[]
  categories?: BlogCategory[]
  children: React.ReactNode
  showAll?: boolean
}

export default function BlogModal({ post, posts = [], categories = [], children, showAll = false }: BlogModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(post || null)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDarkText, setIsDarkText] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (showAll) {
      let filtered = posts.filter((p) => p.published)

      if (selectedCategory !== "all") {
        filtered = filtered.filter((p) => p.category_id === selectedCategory)
      }

      if (searchQuery) {
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      setFilteredPosts(filtered)
    }
  }, [posts, selectedCategory, searchQuery, showAll])

  const handlePostView = async (postId: string) => {
    try {
      await fetch(`/api/blog/view/${postId}`, { method: "POST" })
    } catch (error) {
      console.error("خطأ في تسجيل المشاهدة:", error)
    }
  }

  const handleShare = (platform: string, post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.slug}`
    const text = `${post.title} - ${post.excerpt || ""}`

    let shareUrl = ""

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  const handleCopyLink = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.slug}`
    navigator.clipboard.writeText(url)
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط المقال إلى الحافظة",
    })
  }

  const openPost = (postToOpen: BlogPost) => {
    setSelectedPost(postToOpen)
    handlePostView(postToOpen.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={`max-w-6xl max-h-[90vh] p-0 overflow-hidden ${isMinimized ? "max-w-md max-h-20" : ""}`}>
        <DialogHeader className="p-4 border-b bg-white dark:bg-gray-900 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">{selectedPost ? selectedPost.title : "المدونة"}</DialogTitle>
          <div className="flex items-center gap-2">
            {selectedPost && (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsDarkText(!isDarkText)} className="h-8 w-8">
                  <Palette className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare("whatsapp", selectedPost)}>
                      <i className="bi bi-whatsapp text-green-600 ml-2"></i>
                      واتساب
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook", selectedPost)}>
                      <i className="bi bi-facebook text-blue-600 ml-2"></i>
                      فيسبوك
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("twitter", selectedPost)}>
                      <i className="bi bi-twitter text-blue-400 ml-2"></i>
                      تويتر
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyLink(selectedPost)}>
                      <i className="bi bi-link-45deg ml-2"></i>
                      نسخ الرابط
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8">
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {!isMinimized && (
          <div className="flex-1 overflow-hidden">
            {selectedPost ? (
              <div className="h-full overflow-y-auto">
                {/* محتوى المقال */}
                <div className="p-6">
                  {selectedPost.featured_image_url && (
                    <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                      <Image
                        src={selectedPost.featured_image_url || "/placeholder.svg"}
                        alt={selectedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-4">{selectedPost.title}</h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(selectedPost.created_at).toLocaleDateString("ar-SA")}</span>
                      </div>
                      {selectedPost.reading_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{selectedPost.reading_time} دقائق قراءة</span>
                        </div>
                      )}
                      {selectedPost.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{selectedPost.views} مشاهدة</span>
                        </div>
                      )}
                    </div>

                    {selectedPost.category && (
                      <Badge className="mb-4" style={{ backgroundColor: selectedPost.category.color || "#3b82f6" }}>
                        {selectedPost.category.name}
                      </Badge>
                    )}
                  </div>

                  <div
                    className={`prose prose-lg max-w-none ${isDarkText ? "text-gray-900 dark:text-gray-100" : ""}`}
                    style={{
                      filter: isDarkText ? "contrast(1.2) brightness(0.9)" : "none",
                      lineHeight: "1.8",
                    }}
                  >
                    {selectedPost.content.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* زر العودة للقائمة */}
                <div className="p-6 border-t">
                  <Button variant="outline" onClick={() => setSelectedPost(null)} className="w-full">
                    العودة إلى قائمة المقالات
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto">
                {/* قائمة المقالات مع الفلترة */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="البحث في المقالات..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-10"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                      >
                        <option value="all">جميع التصنيفات</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="cursor-pointer group bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border"
                        onClick={() => openPost(post)}
                      >
                        {post.featured_image_url && (
                          <div className="relative h-40 w-full overflow-hidden">
                            <img
                              src={post.featured_image_url || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {post.category && (
                              <div className="absolute top-2 right-2">
                                <Badge
                                  style={{ backgroundColor: post.category.color || "#3b82f6" }}
                                  className="text-white"
                                >
                                  {post.category.name}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{new Date(post.created_at).toLocaleDateString("ar-SA")}</span>
                            <div className="flex items-center gap-2">
                              {post.reading_time && <span>{post.reading_time} دقائق</span>}
                              {post.views && (
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{post.views}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        لم يتم العثور على مقالات تطابق البحث أو الفلتر المحدد
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
