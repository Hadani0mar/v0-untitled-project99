"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"

interface ParallaxEffectProps {
  children: ReactNode
  speed?: number
  className?: string
}

export default function ParallaxEffect({ children, speed = 0.05, className = "" }: ParallaxEffectProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const x = (e.clientX - centerX) * speed
      const y = (e.clientY - centerY) * speed

      setPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [speed])

  return (
    <div
      ref={ref}
      className={`parallax ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  )
}
