"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Trash } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [aiInstructions, setAiInstructions] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // تحميل المحادثات السابقة من localStorage عند تحميل المكون
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_messages")
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages) as Message[]
        setMessages(parsedMessages)
      } catch (error) {
        console.error("خطأ في تحليل المحادثات المحفوظة:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // حفظ المحادثات في localStorage عند تحديثها
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages))
    }
  }, [messages, isInitialized])

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
          setAiInstructions(data.instructions)

          // إذا لم تكن هناك رسائل محفوظة، أضف رسالة ترحيب
          if (messages.length === 0) {
            setMessages([
              {
                role: "assistant",
                content: "مرحبًا! أنا Mousa AI. كيف يمكنني مساعدتك اليوم؟",
                timestamp: Date.now(),
              },
            ])
          }
        }
      } catch (error) {
        console.error("خطأ في جلب تعليمات الذكاء الاصطناعي:", error)
        // إذا لم تكن هناك رسائل محفوظة، أضف رسالة ترحيب
        if (messages.length === 0) {
          setMessages([
            {
              role: "assistant",
              content: "مرحبًا! أنا Mousa AI. كيف يمكنني مساعدتك اليوم؟",
              timestamp: Date.now(),
            },
          ])
        }
      }
    }

    if (isInitialized && messages.length === 0) {
      fetchAiInstructions()
    }
  }, [isInitialized, messages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input, timestamp: Date.now() }
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
          instructions: aiInstructions, // إرسال التعليمات المخصصة إلى واجهة برمجة التطبيقات
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في الحصول على استجابة")
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: Date.now() }])
    } catch (error) {
      console.error("خطأ:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذرًا، واجهت خطأ. يرجى المحاولة مرة أخرى لاحقًا.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "مرحبًا! أنا Mousa AI. كيف يمكنني مساعدتك اليوم؟",
        timestamp: Date.now(),
      },
    ])
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="text-sm text-gray-500">
          {messages.length > 1 ? `${messages.length - 1} رسائل` : "محادثة جديدة"}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>مسح المحادثة</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من رغبتك في مسح جميع الرسائل؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={clearChat} className="bg-red-500 hover:bg-red-600">
                مسح
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

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
                <div className="text-xs text-gray-400 mt-1 text-right">{formatTime(message.timestamp)}</div>
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
