"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  BookOpen,
  Save,
  Lightbulb,
  Calendar,
  Heart,
  Smile,
  Meh,
  Frown,
  Sun,
  CloudRain,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

interface DiaryEntry {
  id: string
  title: string
  content: string
  mood: string
  date: Date
  aiSuggestion?: string
}

const moods = [
  { id: "happy", label: "Happy", icon: Smile, color: "bg-green-500" },
  { id: "calm", label: "Calm", icon: Sun, color: "bg-blue-500" },
  { id: "neutral", label: "Neutral", icon: Meh, color: "bg-gray-500" },
  { id: "anxious", label: "Anxious", icon: Zap, color: "bg-yellow-500" },
  { id: "sad", label: "Sad", icon: Frown, color: "bg-purple-500" },
  { id: "stressed", label: "Stressed", icon: CloudRain, color: "bg-red-500" },
]

const mockEntries: DiaryEntry[] = [
  {
    id: "1",
    title: "Exam Preparation",
    content: "Today I started preparing for my finals. Feeling a bit overwhelmed but trying to stay organized.",
    mood: "anxious",
    date: new Date(2024, 11, 10),
    aiSuggestion:
      "Consider breaking your study schedule into smaller, manageable chunks. The Pomodoro technique might help!",
  },
  {
    id: "2",
    title: "Great Day with Friends",
    content: "Had an amazing time with my study group today. We helped each other understand difficult concepts.",
    mood: "happy",
    date: new Date(2024, 11, 9),
    aiSuggestion: "Social connections are wonderful for mental health! Consider scheduling regular study sessions.",
  },
  {
    id: "3",
    title: "Feeling Homesick",
    content: "Missing home today. The campus feels lonely sometimes, especially during exam season.",
    mood: "sad",
    date: new Date(2024, 11, 8),
    aiSuggestion: "Homesickness is normal. Try video calling family or finding campus activities to build connections.",
  },
]

export default function DiaryPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState("")
  const [currentTitle, setCurrentTitle] = useState("")
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [entries, setEntries] = useState<DiaryEntry[]>(mockEntries)
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const generateAISuggestion = async (content: string, mood: string) => {
    // Simulate AI suggestion generation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const suggestions = {
      happy:
        "It's wonderful to see you feeling positive! Consider writing about what specifically made you happy to remember this feeling.",
      sad: "I notice you're going through a difficult time. Remember that it's okay to feel sad, and consider reaching out to someone you trust.",
      anxious:
        "Anxiety can be overwhelming. Try some deep breathing exercises and consider breaking down what's worrying you into smaller parts.",
      stressed:
        "Stress is your body's response to challenges. Consider what specific stressors you can address and which ones you need to accept.",
      neutral:
        "Neutral days are important too. Sometimes taking time to reflect on small positive moments can be helpful.",
      calm: "It's great that you're feeling calm. This might be a good time to reflect on what helps you maintain this peaceful state.",
    }

    return (
      suggestions[mood as keyof typeof suggestions] ||
      "Thank you for sharing your thoughts. Reflecting through writing is a powerful tool for mental health."
    )
  }

  const handleSaveEntry = async () => {
    if (!currentEntry.trim() || !selectedMood) return

    const suggestion = await generateAISuggestion(currentEntry, selectedMood)
    setAiSuggestion(suggestion)

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      title: currentTitle || `Entry ${new Date().toLocaleDateString()}`,
      content: currentEntry,
      mood: selectedMood,
      date: new Date(),
      aiSuggestion: suggestion,
    }

    setEntries((prev) => [newEntry, ...prev])
    setCurrentEntry("")
    setCurrentTitle("")
    setSelectedMood("")
  }

  const openDiary = () => {
    setIsOpen(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 500)
  }

  const closeDiary = () => {
    setIsOpen(false)
    setSelectedEntry(null)
    setCurrentPage(0)
  }

  const nextPage = () => {
    setCurrentPage(1)
  }

  const prevPage = () => {
    setCurrentPage(0)
  }

  const getMoodIcon = (moodId: string) => {
    const mood = moods.find((m) => m.id === moodId)
    if (!mood) return null
    const Icon = mood.icon
    return <Icon className="h-4 w-4" />
  }

  const getMoodColor = (moodId: string) => {
    const mood = moods.find((m) => m.id === moodId)
    return mood?.color || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-orange-900 dark:to-red-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-300">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-amber-600 animate-pulse" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Digital Diary
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your personal reflection space</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="animate-bounce">
              <Heart className="h-3 w-3 mr-1" />
              {entries.length} entries
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Diary History */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Entries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <Card
                        key={entry.id}
                        className={`p-4 cursor-pointer hover:scale-105 transition-all duration-300 border-0 ${
                          selectedEntry?.id === entry.id
                            ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900"
                            : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600"
                        }`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">{entry.title}</h3>
                            <div className={`p-1 rounded-full ${getMoodColor(entry.mood)}`}>
                              <div className="text-white">{getMoodIcon(entry.mood)}</div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{entry.content}</p>
                          <p className="text-xs text-gray-500">{entry.date.toLocaleDateString()}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Interactive 3D Diary */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Diary Book Animation */}
              <div
                className={`relative mx-auto transition-all duration-1000 transform ${
                  isOpen ? "scale-110 rotate-y-12" : "scale-100"
                }`}
                style={{
                  width: "600px",
                  height: "400px",
                  perspective: "1000px",
                }}
              >
                {/* Diary Cover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-amber-800 to-orange-900 rounded-lg shadow-2xl transition-all duration-1000 transform-gpu ${
                    isOpen ? "rotate-y-180" : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-orange-800 rounded-lg p-8 flex flex-col items-center justify-center">
                    <BookOpen className="h-16 w-16 text-amber-200 mb-4 animate-pulse" />
                    <h2 className="text-3xl font-bold text-amber-100 mb-2">My Diary</h2>
                    <p className="text-amber-200 text-center mb-6">Click to open and start writing</p>
                    <Button
                      onClick={openDiary}
                      className="bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 transform hover:scale-110"
                    >
                      Open Diary
                    </Button>
                  </div>
                  {/* Diary binding */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-900 to-amber-800 rounded-l-lg"></div>
                </div>

                {/* Diary Pages */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-100 dark:to-gray-200 rounded-lg shadow-2xl transition-all duration-1000 transform-gpu ${
                    isOpen ? "" : "rotate-y-180"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {isOpen && (
                    <div className="h-full flex">
                      {/* Left Page */}
                      <div className="flex-1 p-6 border-r border-orange-200">
                        {currentPage === 0 ? (
                          <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-bold text-gray-800">New Entry</h3>
                              <Button
                                onClick={closeDiary}
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Close
                              </Button>
                            </div>

                            <input
                              type="text"
                              placeholder="Entry title..."
                              value={currentTitle}
                              onChange={(e) => setCurrentTitle(e.target.value)}
                              className="w-full p-2 mb-4 bg-transparent border-b border-orange-300 focus:border-orange-500 outline-none text-gray-800 placeholder-gray-500"
                            />

                            <Textarea
                              ref={textareaRef}
                              placeholder="Dear diary, today I feel..."
                              value={currentEntry}
                              onChange={(e) => setCurrentEntry(e.target.value)}
                              className="flex-1 resize-none bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500 leading-relaxed"
                              style={{ fontFamily: "cursive" }}
                            />

                            <div className="mt-4">
                              <p className="text-sm text-gray-600 mb-2">How are you feeling?</p>
                              <div className="flex flex-wrap gap-2">
                                {moods.map((mood) => {
                                  const Icon = mood.icon
                                  return (
                                    <Button
                                      key={mood.id}
                                      variant={selectedMood === mood.id ? "default" : "outline"}
                                      size="sm"
                                      className={`${
                                        selectedMood === mood.id ? `${mood.color} text-white` : ""
                                      } transition-all duration-300 hover:scale-110`}
                                      onClick={() => setSelectedMood(mood.id)}
                                    >
                                      <Icon className="h-3 w-3 mr-1" />
                                      {mood.label}
                                    </Button>
                                  )
                                })}
                              </div>
                            </div>

                            <div className="flex justify-between mt-4">
                              <Button
                                onClick={nextPage}
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <ChevronRight className="h-4 w-4" />
                                Next Page
                              </Button>
                              <Button
                                onClick={handleSaveEntry}
                                disabled={!currentEntry.trim() || !selectedMood}
                                className="bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 transform hover:scale-105"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save Entry
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-bold text-gray-800">AI Suggestions</h3>
                              <Button
                                onClick={prevPage}
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <ChevronLeft className="h-4 w-4" />
                                Back
                              </Button>
                            </div>

                            {aiSuggestion && (
                              <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                <div className="flex items-start space-x-3">
                                  <Lightbulb className="h-5 w-5 text-blue-600 mt-1" />
                                  <div>
                                    <h4 className="font-medium text-blue-800 mb-2">AI Insight</h4>
                                    <p className="text-blue-700 text-sm leading-relaxed">{aiSuggestion}</p>
                                  </div>
                                </div>
                              </Card>
                            )}

                            <div className="mt-6">
                              <h4 className="font-medium text-gray-800 mb-3">Reflection Prompts</h4>
                              <div className="space-y-2">
                                {[
                                  "What am I grateful for today?",
                                  "What challenged me and how did I handle it?",
                                  "What would I like to improve tomorrow?",
                                  "Who or what made me smile today?",
                                ].map((prompt, index) => (
                                  <Card
                                    key={index}
                                    className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 cursor-pointer hover:scale-105 transition-all duration-300"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <Sparkles className="h-4 w-4 text-yellow-600" />
                                      <p className="text-sm text-yellow-800">{prompt}</p>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Page - Selected Entry or Mood History */}
                      <div className="flex-1 p-6">
                        {selectedEntry ? (
                          <div className="h-full">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-bold text-gray-800">{selectedEntry.title}</h3>
                              <div className={`p-2 rounded-full ${getMoodColor(selectedEntry.mood)}`}>
                                <div className="text-white">{getMoodIcon(selectedEntry.mood)}</div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{selectedEntry.date.toLocaleDateString()}</p>
                            <div
                              className="prose prose-sm text-gray-800 leading-relaxed mb-6"
                              style={{ fontFamily: "cursive" }}
                            >
                              {selectedEntry.content}
                            </div>
                            {selectedEntry.aiSuggestion && (
                              <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                                <div className="flex items-start space-x-3">
                                  <Lightbulb className="h-5 w-5 text-green-600 mt-1" />
                                  <div>
                                    <h4 className="font-medium text-green-800 mb-2">AI Reflection</h4>
                                    <p className="text-green-700 text-sm leading-relaxed">
                                      {selectedEntry.aiSuggestion}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            )}
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center">
                            <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-medium text-gray-600 mb-2">Select an Entry</h3>
                            <p className="text-gray-500">Choose an entry from the history to read it here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 h-16 w-16 bg-amber-200/20 dark:bg-amber-800/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 h-12 w-12 bg-orange-200/20 dark:bg-orange-800/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 h-20 w-20 bg-red-200/20 dark:bg-red-800/20 rounded-full animate-float-slow"></div>
      </div>
    </div>
  )
}
