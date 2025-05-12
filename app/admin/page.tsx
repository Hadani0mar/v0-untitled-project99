import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import AdminLogin from "@/components/admin/admin-login"

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = createServerClient()

  // Check if admin is logged in
  const adminCookie = cookieStore.get("admin_authenticated")

  if (adminCookie?.value === "true") {
    redirect("/admin/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AdminLogin />
    </div>
  )
}
