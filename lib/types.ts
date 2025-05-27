export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string
  is_available: boolean
  verification_badge_style?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  image_url: string
  project_url: string
  github_url: string
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  username: string
  password_hash: string
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
  created_at: string
  updated_at: string
  categories?: BlogCategory[]
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}
