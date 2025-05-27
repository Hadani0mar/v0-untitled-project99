import ClientPage from "./ClientPage"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: profileData } = await supabase.from("profiles").select("*").limit(1)
    const profile = profileData && profileData.length > 0 ? (profileData[0] as Profile) : null

    if (!profile) {
      return {
        title: "موسى عمر | مطور واجهات أمامية محترف",
        description: "الملف الشخصي المهني لموسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية",
      }
    }

    return {
      title: `${profile.name} | ${profile.title}`,
      description: profile.bio,
    }
  } catch (error) {
    console.error("خطأ في جلب البيانات الوصفية:", error)
    return {
      title: "موسى عمر | مطور واجهات أمامية محترف",
      description: "الملف الشخصي المهني لموسى عمر، مطور واجهات أمامية متخصص في بناء تطبيقات ويب حديثة وتفاعلية",
    }
  }
}

export default async function Home() {
  return <ClientPage />
}
