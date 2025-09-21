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
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  mood?: string
  sentiment?: "positive" | "negative" | "neutral"
  category?: string
}

const quickSuggestions = [
  { text: "I'm feeling anxious about my exams", category: "academic" },
  { text: "How can I manage stress better?", category: "stress" },
  { text: "I'm having trouble sleeping", category: "sleep" },
  { text: "I feel overwhelmed with coursework", category: "academic" },
  { text: "Tips for staying motivated", category: "motivation" },
  { text: "How to deal with social anxiety", category: "social" },
  { text: "I feel lonely and isolated", category: "social" },
  { text: "Help with time management", category: "productivity" },
]

const advancedMoodResponses = {
  anxious: {
    response:
      "I understand you're feeling anxious. Let's work through this together with some evidence-based techniques.",
    techniques: ["4-7-8 breathing", "Progressive muscle relaxation", "Grounding exercises"],
    followUp: "Would you like me to guide you through a specific anxiety management technique?",
  },
  stressed: {
    response:
      "Stress can be overwhelming, but there are effective ways to manage it. Let's identify your stress triggers.",
    techniques: ["Time blocking", "Mindfulness meditation", "Physical exercise"],
    followUp: "What's the main source of your stress right now?",
  },
  sad: {
    response: "I hear that you're going through a difficult time. Your feelings are completely valid.",
    techniques: ["Journaling", "Social connection", "Gentle movement"],
    followUp: "Have you been able to talk to anyone else about how you're feeling?",
  },
  happy: {
    response:
      "It's wonderful that you're feeling positive! Let's explore ways to maintain and build on this good mood.",
    techniques: ["Gratitude practice", "Sharing joy", "Mindful appreciation"],
    followUp: "What's contributing to your positive mood today?",
  },
  neutral: {
    response: "Thank you for sharing. I'm here to listen and provide support whenever you need it.",
    techniques: ["Mood check-ins", "Goal setting", "Self-reflection"],
    followUp: "Is there anything specific you'd like to explore or work on today?",
  },
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm Mantify, your advanced AI mental health companion. I'm here to provide personalized support, evidence-based techniques, and help you navigate your emotional wellbeing. I can analyze your mood patterns, suggest coping strategies, and connect you with resources. How are you feeling today?",
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
    supportLevel: "basic" as "basic" | "intermediate" | "advanced",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Responsive sidebar handling
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowSidebar(false)
      } else {
        setShowSidebar(true)
      }
    }

    handleResize() // Set initial state
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const generateAdvancedResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase()

    // Analyze sentiment and risk level
    const riskKeywords = ["suicide", "kill myself", "end it all", "no point", "hopeless"]
    const highRisk = riskKeywords.some((keyword) => lowerMessage.includes(keyword))

    if (highRisk) {
      setConversationContext((prev) => ({ ...prev, riskLevel: "high" }))
      return "I'm very concerned about what you're sharing. Your life has value and there are people who want to help. Please consider reaching out to a crisis helpline immediately: National Suicide Prevention Lifeline: 988. Would you like me to help you find local mental health resources?"
    }

    // Context-aware responses based on conversation history
    const academicKeywords = ["exam", "test", "study", "grade", "assignment", "homework", "professor", "class"]
    const stressKeywords = ["stress", "overwhelmed", "pressure", "deadline", "busy", "exhausted"]
    const socialKeywords = ["lonely", "friends", "social", "isolated", "relationship", "family"]
    const sleepKeywords = ["sleep", "tired", "insomnia", "rest", "bed", "wake up"]

    let category = "general"
    let mood = "neutral"

    if (academicKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      category = "academic"
      mood = "stressed"
    } else if (stressKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      category = "stress"
      mood = "stressed"
    } else if (socialKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      category = "social"
      mood = "sad"
    } else if (sleepKeywords.some((keyword) => lowerMessage.includes(keyword))) {
      category = "sleep"
      mood = "tired"
    }

    // Update conversation context
    setConversationContext((prev) => ({
      ...prev,
      userMood: mood,
      sessionTopics: [...new Set([...prev.sessionTopics, category])],
    }))

    // Generate contextual response
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
      const response = advancedMoodResponses.anxious
      return `${response.response} Here are some techniques that can help: ${response.techniques.join(", ")}. ${response.followUp}`
    }

    if (category === "academic") {
      return "Academic stress is very common among students. Let's break this down into manageable steps. First, try the Pomodoro technique: 25 minutes of focused study, then a 5-minute break. Also, remember that your worth isn't defined by your grades. What specific subject or assignment is causing you the most stress right now?"
    }

    if (category === "stress") {
      return "I can see you're dealing with significant stress. Let's work on some immediate relief techniques. Try this: Take 5 deep breaths, counting to 4 on the inhale and 6 on the exhale. This activates your parasympathetic nervous system. What are the top 3 stressors you're facing right now? We can prioritize them together."
    }

    if (category === "social") {
      return "Feeling socially disconnected is challenging, especially as a student. Social connections are crucial for mental health. Consider joining study groups, campus clubs, or online communities related to your interests. Even small interactions can help. Have you tried reaching out to classmates or exploring campus activities?"
    }

    if (category === "sleep") {
      return "Sleep is fundamental to mental health and academic performance. Here's a evidence-based sleep hygiene plan: 1) No screens 1 hour before bed, 2) Keep your room cool (65-68°F), 3) Try the 4-7-8 breathing technique, 4) Maintain consistent sleep/wake times. What time do you usually try to go to sleep, and what might be interfering with your rest?"
    }

    // Default empathetic response with personalization
    return `Thank you for sharing that with me. I can sense this is important to you. Based on our conversation, I'm here to provide personalized support. Can you tell me more about what you're experiencing? Sometimes talking through our feelings helps us understand them better. Remember, seeking help is a sign of strength, not weakness.`
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

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await generateAdvancedResponse(content)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment. If you're in crisis, please contact emergency services or a mental health professional immediately.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
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
    setIsListening(!isListening)
    // In a real implementation, you would integrate with Web Speech API here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-300">
                  <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot className="h-8 w-8 md:h-10 md:w-10 text-indigo-600 animate-pulse" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Mantify Advanced
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">AI Mental Health Companion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {conversationContext.userMood && (
                <Badge variant="outline" className="animate-pulse text-xs md:text-sm">
                  Mood: {conversationContext.userMood}
                </Badge>
              )}
              <Badge variant="secondary" className="animate-bounce text-xs md:text-sm">
                <Heart className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                Always here for you
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex gap-6 h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
          {/* Enhanced Chat History Sidebar */}
          {showSidebar && (
            <div className="hidden lg:block lg:w-1/4 xl:w-1/5 transition-all duration-300">
              <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg md:text-xl flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                    <span>Session Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm md:text-base">Current Session</h4>
                    <div className="flex flex-wrap gap-1">
                      {conversationContext.sessionTopics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs md:text-sm">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm md:text-base">Recent Conversations</h4>
                    {[
                      { title: "Exam Anxiety Support", time: "2 hours ago", mood: "anxious", icon: Zap },
                      { title: "Sleep Improvement", time: "Yesterday", mood: "tired", icon: Brain },
                      { title: "Stress Management", time: "3 days ago", mood: "stressed", icon: Heart },
                      { title: "Social Connection", time: "1 week ago", mood: "lonely", icon: Users },
                    ].map((chat, index) => {
                      const Icon = chat.icon
                      return (
                        <Card
                          key={index}
                          className="p-3 cursor-pointer hover:scale-105 transition-all duration-300 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-0"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4 md:h-5 md:w-5" />
                              <p className="font-medium text-sm md:text-base truncate">{chat.title}</p>
                            </div>
                            <p className="text-xs md:text-sm text-gray-500">{chat.time}</p>
                            <Badge variant="outline" className="text-xs md:text-sm">
                              {chat.mood}
                            </Badge>
                          </div>
                        </Card>
                      )
                    })}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm md:text-base">Quick Resources</h4>
                    <div className="space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs md:text-sm">
                        <BookOpen className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        Coping Strategies
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs md:text-sm">
                        <Heart className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        Crisis Resources
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs md:text-sm">
                        <Users className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        Support Groups
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Chat Area */}
          <div className={`${showSidebar ? 'lg:w-3/4 xl:w-4/5' : 'w-full'} flex flex-col transition-all duration-300`}>
            <Card className="flex-1 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4 md:p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 animate-fade-in ${
                          message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <div
                          className={`p-2 md:p-3 rounded-full flex-shrink-0 ${
                            message.sender === "user"
                              ? "bg-indigo-600 text-white"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <User className="h-4 w-4 md:h-5 md:w-5" />
                          ) : (
                            <Bot className="h-4 w-4 md:h-5 md:w-5" />
                          )}
                        </div>
                        <div
                          className={`max-w-[85%] p-3 md:p-4 rounded-2xl ${
                            message.sender === "user"
                              ? "bg-indigo-600 text-white ml-auto"
                              : "bg-white dark:bg-gray-700 shadow-md"
                          }`}
                        >
                          <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                          <div className={`flex items-center mt-2 ${
                            message.sender === "user" ? "justify-end" : "justify-start"
                          }`}>
                            <Clock className={`h-3 w-3 md:h-4 md:w-4 ${
                              message.sender === "user" ? "text-indigo-200" : "text-gray-500 dark:text-gray-400"
                            }`} />
                            <p
                              className={`text-xs ml-1 ${
                                message.sender === "user" ? "text-indigo-200" : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start space-x-3 animate-fade-in">
                        <div className="p-2 md:p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Bot className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-md">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Enhanced Quick Suggestions */}
                {messages.length === 1 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                      <span className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400">Smart suggestions:</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {quickSuggestions.slice(0, 6).map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-left justify-start h-auto p-3 hover:scale-105 transition-all duration-300 bg-transparent"
                          onClick={() => handleSendMessage(suggestion.text)}
                        >
                          <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2 text-indigo-500" />
                          <div className="text-left">
                            <span className="text-xs md:text-sm block">{suggestion.text}</span>
                            <Badge variant="outline" className="text-xs mt-1">
                              {suggestion.category}
                            </Badge>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Input Area */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Share what's on your mind... I'm here to help."
                        className="pr-12 transition-all duration-300 focus:scale-105 text-base md:text-lg p-4 md:p-5"
                        disabled={isLoading}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 ${
                          isListening ? "text-red-500 animate-pulse" : "text-gray-400"
                        }`}
                        onClick={toggleListening}
                      >
                        {isListening ? <MicOff className="h-4 w-4 md:h-5 md:w-5" /> : <Mic className="h-4 w-4 md:h-5 md:w-5" />}
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 p-4 md:p-5"
                    >
                      <Send className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Mantify provides evidence-based support. In crisis situations, please contact emergency services
                    (911) or the National Suicide Prevention Lifeline (988).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 h-16 w-16 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 h-12 w-12 bg-purple-200/20 dark:bg-purple-800/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 h-20 w-20 bg-blue-200/20 dark:bg-blue-800/20 rounded-full animate-float-slow"></div>
      </div>

      {/* Mobile Sidebar Toggle */}
      {!showSidebar && (
        <div className="fixed bottom-4 right-4 z-20 lg:hidden">
          <Button 
            onClick={() => setShowSidebar(true)}
            className="rounded-full h-12 w-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  )
}