"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, X } from "lucide-react"
import ChatInterface from "./chat-interface"

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 rounded-full h-14 w-14 p-0 shadow-lg"
        aria-label="فتح المحادثة"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-80 md:w-96 h-[500px] animate-in">
          <Card className="h-full flex flex-col overflow-hidden shadow-xl border-none">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
              <h3 className="font-semibold">الدردشة مع Groq AI</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ChatInterface />
          </Card>
        </div>
      )}
    </>
  )
}
