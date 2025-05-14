import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const cairo = Cairo({ subsets: ["arabic"] })

export const metadata: Metadata = {
  title: "موسى عمر | مطور واجهات أمامية محترف",
  description: "الملف الشخصي المهني لموسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية",
  keywords: [
    "مطور واجهات أمامية",
    "تطوير الويب",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "موسى عمر",
    "تصميم مواقع",
  ],
  authors: [{ name: "موسى عمر" }],
  creator: "موسى عمر",
  publisher: "موسى عمر",
  openGraph: {
    type: "website",
    locale: "ar_AR",
    url: "https://mousa.org.ly",
    title: "موسى عمر | مطور واجهات أمامية محترف",
    description: "الملف الشخصي المهني لموسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية",
    siteName: "موسى عمر",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "موسى عمر - مطور واجهات أمامية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "موسى عمر | مطور واجهات أمامية محترف",
    description: "الملف الشخصي المهني لموسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
  alternates: {
    canonical: "https://mousaomar.com",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
        {/* إضافة مكتبة Bootstrap Icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      </head>
      <body className={cairo.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
