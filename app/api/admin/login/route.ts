import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const supabase = createServerClient()

    // Fetch admin user
    const { data: adminUser, error } = await supabase.from("admin_users").select("*").eq("username", username).single()

    if (error || !adminUser) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real app, you would use proper password hashing
    // This is just for demonstration purposes
    if (adminUser.password_hash !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set a cookie to indicate the admin is authenticated
    cookies().set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
