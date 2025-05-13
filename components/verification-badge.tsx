import { cn } from "@/lib/utils"

interface VerificationBadgeProps {
  size?: "sm" | "md" | "lg"
  className?: string
  style?: "facebook" | "twitter"
}

export default function VerificationBadge({ size = "md", className, style = "facebook" }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  }

  if (style === "twitter") {
    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        <i className={`bi bi-patch-check-fill text-[#f59e0b] ${sizeClasses[size]} twitter-verification-badge`}></i>
      </div>
    )
  }

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <i className={`bi bi-patch-check-fill text-[#1877F2] ${sizeClasses[size]} verification-badge`}></i>
    </div>
  )
}
