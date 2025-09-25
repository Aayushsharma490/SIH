"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  ArrowLeft,
  Bot,
  User,
  Heart,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Mic,
  MicOff,
  Brain,
  Zap,
  BookOpen,
  Users,
  Clock,
  ChevronDown,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const quickSuggestions = [
  { text: "I'm feeling anxious about my exams", category: "academic" },
  { text: "How can I manage stress better?", category: "stress" },
  { text: "I'm having trouble sleeping", category: "sleep" },
  { text: "I feel overwhelmed with coursework", category: "academic" },
  { text: "Tips for staying motivated", category: "motivation" },
  { text: "How to deal with social anxiety", category: "social" },
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Mantify, your advanced AI mental health companion. I'm here to provide personalized support, evidence-based techniques, and help you navigate your emotional wellbeing. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [conversationContext, setConversationContext] = useState({
    userMood: null as string | null,
    sessionTopics: [] as string[],
    riskLevel: "low" as "low" | "medium" | "high",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sendMessageToBackend = async (message: string) => {
    try {
      let sessionId = localStorage.getItem('mantify_sessionId')
      if (!sessionId) {
        sessionId = Date.now().toString()
        localStorage.setItem('mantify_sessionId', sessionId)
      }
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, sessionId }),
      })
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim()
    if (!content) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const data = await sendMessageToBackend(content)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        timestamp: new Date(),
      }
      
      if (data.context) {
        setConversationContext(prev => ({
          ...prev,
          ...data.context
        }))
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again. If you need immediate help, contact emergency services.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleListening = () => {
    if (!isListening) {
      // Speech recognition implementation would go here
      alert("Speech recognition would be implemented here")
    }
    setIsListening(!isListening)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Bot className="h-8 w-8 text-indigo-600 animate-pulse" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Mantify Advanced
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI Mental Health Companion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {conversationContext.userMood && (
                <Badge variant="outline" className="animate-pulse">
                  Mood: {conversationContext.userMood}
                </Badge>
              )}
              <Badge variant="secondary" className="animate-bounce">
                <Heart className="h-4 w-4 mr-1" />
                Always here for you
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          {showSidebar && (
            <div className="hidden lg:block w-1/4">
              <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Session Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Session</h4>
                    <div className="flex flex-wrap gap-1">
                      {conversationContext.sessionTopics.map((topic, index) => (
                        <Badge key={index} variant="outline">{topic}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Quick Resources</h4>
                    <div className="space-y-2">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Coping Strategies
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Crisis Resources
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className={`${showSidebar ? 'lg:w-3/4' : 'w-full'} flex flex-col`}>
            <Card className="flex-1 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardContent className="p-0 h-full flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex items-start space-x-3 ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                        <div className={`p-3 rounded-full ${message.sender === "user" ? "bg-indigo-600 text-white" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"}`}>
                          {message.sender === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                        </div>
                        <div className={`max-w-[85%] p-4 rounded-2xl ${message.sender === "user" ? "bg-indigo-600 text-white ml-auto" : "bg-white dark:bg-gray-700 shadow-md"}`}>
                          <p className="leading-relaxed">{message.content}</p>
                          <div className={`flex items-center mt-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <Clock className={`h-4 w-4 ${message.sender === "user" ? "text-indigo-200" : "text-gray-500"}`} />
                            <p className={`text-xs ml-1 ${message.sender === "user" ? "text-indigo-200" : "text-gray-500"}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start space-x-3">
                        <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {messages.length === 1 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium text-gray-600 dark:text-gray-400">Smart suggestions:</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {quickSuggestions.map((suggestion, index) => (
                        <Button key={index} variant="outline" size="sm" className="text-left justify-start h-auto p-3" onClick={() => handleSendMessage(suggestion.text)}>
                          <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
                          <div>
                            <span className="block">{suggestion.text}</span>
                            <Badge variant="outline" className="text-xs mt-1">{suggestion.category}</Badge>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Share what's on your mind..."
                        className="pr-12"
                        disabled={isLoading}
                      />
                      <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 transform -translate-y-1/2" onClick={toggleListening}>
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button onClick={() => handleSendMessage()} disabled={!inputMessage.trim() || isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}