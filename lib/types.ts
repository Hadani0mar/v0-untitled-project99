export interface BlogCategory {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image_url?: string
  published: boolean
  category_id?: string
  views?: number
  reading_time?: number
  created_at: string
  updated_at: string
  category?: BlogCategory
  categories?: BlogCategory[]
}
