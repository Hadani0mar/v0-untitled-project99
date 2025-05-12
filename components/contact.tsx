import type { SocialLink } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Github, Linkedin, Mail, MapPin, Phone, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ContactProps {
  socialLinks: SocialLink[]
}

export default function Contact({ socialLinks }: ContactProps) {
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
          <Card className="border-none shadow-lg animate-in">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">معلومات التواصل</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 ml-3 text-blue-500" />
                  <span>contact@mousaomar.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 ml-3 text-blue-500" />
                  <span>+1 (234) 567-8901</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 ml-3 text-blue-500" />
                  <span>نيويورك، الولايات المتحدة</span>
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
                      className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      {getSocialIcon(link.platform)}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg animate-in" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">أرسل لي رسالة</h3>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input placeholder="الاسم" />
                  </div>
                  <div>
                    <Input type="email" placeholder="البريد الإلكتروني" />
                  </div>
                </div>
                <div>
                  <Input placeholder="الموضوع" />
                </div>
                <div>
                  <Textarea placeholder="رسالتك" rows={5} />
                </div>
                <Button type="submit" className="w-full">
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
