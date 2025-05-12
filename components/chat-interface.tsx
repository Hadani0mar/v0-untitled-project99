"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // جلب تعليمات الذكاء الاصطناعي عند تحميل المكون
  useEffect(() => {
    const fetchAiInstructions = async () => {
      try {
        const response = await fetch("/api/ai/instructions")
        const data = await response.json()

        if (response.ok) {
          setMessages([
            {
              role: "assistant",
              content: "مرحبًا! أنا Mousa AI. كيف يمكنني مساعدتك اليوم؟",
            },
          ])
          setIsInitialized(true)
        }
      } catch (error) {
        console.error("خطأ في جلب تعليمات الذكاء الاصطناعي:", error)
        setMessages([
          {
            role: "assistant",
            content: "مرحبًا! أنا Mousa AI. كيف يمكنني مساعدتك اليوم؟",
          },
        ])
        setIsInitialized(true)
      }
    }

    if (!isInitialized) {
      fetchAiInstructions()
    }
  }, [isInitialized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في الحصول على استجابة")
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("خطأ:", error)
      setMessages((prev) => [...prev, { role: "assistant", content: "عذرًا، واجهت خطأ. يرجى المحاولة مرة أخرى لاحقًا." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
            <div className={`flex ${message.role === "user" ? "flex-row" : "flex-row-reverse"} gap-2 max-w-[80%]`}>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>أنت</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="flex flex-row-reverse gap-2 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-4 py-2 bg-muted">
                <p className="text-sm">جاري التفكير...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك..."
            disabled={isLoading}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  )
}
