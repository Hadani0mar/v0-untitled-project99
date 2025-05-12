import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Mousa Omar",
  description: "Admin dashboard for Mousa Omar portfolio",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-100 dark:bg-gray-900">{children}</div>
}
