import type { SocialLink } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Github, Linkedin, Mail, MapPin, Phone, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ContactProps {
  socialLinks: SocialLink[]
  email?: string
}

export default function Contact({ socialLinks, email = "contact@mousaomar.com" }: ContactProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      default:
        return <ExternalLink className="h-5 w-5" />
    }
  }

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">تواصل معي</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            هل لديك مشروع في ذهنك؟ دعنا نعمل معًا!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-lg animate-in hover-lift">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6">معلومات التواصل</h3>

              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Mail className="h-6 w-6 ml-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">البريد الإلكتروني</p>
                    <a href={`mailto:${email}`} className="font-medium hover:text-blue-500 transition-colors">
                      {email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Phone className="h-6 w-6 ml-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">رقم الهاتف</p>
                    <a href="tel:+1234567890" className="font-medium hover:text-blue-500 transition-colors">
                      +1 (234) 567-8901
                    </a>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <MapPin className="h-6 w-6 ml-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">الموقع</p>
                    <span className="font-medium">نيويورك، الولايات المتحدة</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-medium mb-4">تابعني</h4>
                <div className="flex items-center gap-4">
                  {socialLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-110"
                    >
                      {getSocialIcon(link.platform)}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg animate-in hover-lift" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6">أرسل لي رسالة</h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Input placeholder="الاسم" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Input type="email" placeholder="البريد الإلكتروني" className="h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Input placeholder="الموضوع" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Textarea placeholder="رسالتك" rows={5} className="resize-none" />
                </div>
                <Button type="submit" className="w-full h-12 text-base">
                  إرسال الرسالة
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
