"use client"

import { useState, useRef, useEffect } from "react"
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
  Loader2
} from "lucide-react"
import Link from "next/link"

interface DiaryEntry {
  id: string
  title: string
  content: string
  mood: string
  date: string
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

export default function DiaryPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState("")
  const [currentTitle, setCurrentTitle] = useState("")
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Fetch entries
  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/entries`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
        if (data.length > 0 && !selectedEntry) {
          setSelectedEntry(data[0])
        }
      }
    } catch (error) {
      console.error("Failed to fetch entries:", error)
    } finally {
      setIsLoading(false)
    }
  }
  const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/diary`;

  const fetchLastEntry = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/entries`);
      if (response.ok) {
        const data = await response.json()
        setSelectedEntry(data)
      }
    } catch (error) {
      console.error("Failed to fetch last entry:", error)
    }
  }

  useEffect(() => {
    fetchEntries()
    fetchLastEntry()
  }, [])

  const saveEntryToBackend = async (entryData: { title: string; content: string; mood: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryData),
      })
      if (response.ok) {
        return await response.json()
      }
      throw new Error("Failed to save entry")
    } catch (error) {
      console.error("Error saving entry:", error)
      throw error
    }
  }

  const handleSaveEntry = async () => {
    if (!currentEntry.trim() || !selectedMood) return
    setIsSaving(true)
    try {
      const newEntry = await saveEntryToBackend({
        title: currentTitle || `Entry ${new Date().toLocaleDateString()}`,
        content: currentEntry,
        mood: selectedMood,
      })
      setEntries(prev => [newEntry, ...prev])
      setSelectedEntry(newEntry)
      setAiSuggestion(newEntry.aiSuggestion || "")
      setCurrentEntry("")
      setCurrentTitle("")
      setSelectedMood("")
      setCurrentPage(1)
    } catch {
      const suggestion = await generateAISuggestion(currentEntry, selectedMood)
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        title: currentTitle || `Entry ${new Date().toLocaleDateString()}`,
        content: currentEntry,
        mood: selectedMood,
        date: new Date().toISOString(),
        aiSuggestion: suggestion,
      }
      setEntries(prev => [newEntry, ...prev])
      setSelectedEntry(newEntry)
      setAiSuggestion(suggestion)
      setCurrentPage(1)
    } finally {
      setIsSaving(false)
    }
  }

  const generateAISuggestion = async (content: string, mood: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const suggestions: Record<string, string> = {
      happy: "It's wonderful to see you happy! Reflect on what made you feel this way.",
      sad: "It's okay to feel sad. Writing about your feelings can help lighten the load.",
      anxious: "Breathe deeply. Write about what's worrying you to release the pressure.",
      stressed: "Stress is tough. Try breaking down the source into smaller steps.",
      neutral: "Even neutral days matter. What small good thing happened today?",
      calm: "Being calm is valuable. Capture the peace in your words.",
    }
    return suggestions[mood] || "Thank you for sharing your thoughts."
  }

  const openDiary = () => {
    setIsOpen(true)
    setTimeout(() => textareaRef.current?.focus(), 300)
  }
  const closeDiary = () => {
    setIsOpen(false)
    setCurrentPage(0)
  }

  const nextPage = () => setCurrentPage(1)
  const prevPage = () => setCurrentPage(0)

  const getMoodIcon = (moodId: string) => {
    const mood = moods.find(m => m.id === moodId)
    if (!mood) return null
    const Icon = mood.icon
    return <Icon className="h-4 w-4" />
  }

  const getMoodColor = (moodId: string) => moods.find(m => m.id === moodId)?.color || "bg-gray-500"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-orange-900 dark:to-red-900 p-4">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/20 rounded-lg mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 p-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 animate-pulse" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Digital Diary
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Your personal reflection space</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="animate-bounce">
            <Heart className="h-3 w-3 mr-1" />
            {entries.length} entries
          </Badge>
        </div>
      </header>

      {/* Layout */}
      <div className="grid lg:grid-cols-3 gap-6 max-w-[1600px] mx-auto">
        {/* History */}
        <div className={`lg:col-span-1 ${isOpen ? "hidden lg:block" : "block"}`}>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                <span>Recent Entries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[70vh]">
                <div className="space-y-3">
                  {entries.map(entry => (
                    <Card
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className={`p-4 cursor-pointer hover:scale-105 transition-all border-0 ${
                        selectedEntry?.id === entry.id
                          ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900"
                          : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">{entry.title}</h3>
                          <div className={`p-1 rounded-full ${getMoodColor(entry.mood)}`}>
                            <div className="text-white">{getMoodIcon(entry.mood)}</div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{entry.content}</p>
                        <p className="text-gray-500 text-xs">{new Date(entry.date).toLocaleDateString()}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Diary */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="relative w-full max-w-4xl">
            {!isOpen ? (
              <Card className="p-8 text-center shadow-xl">
                <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-amber-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-800">My Diary</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">Click to open and start writing</p>
                <Button onClick={openDiary} className="bg-amber-600 hover:bg-amber-700 text-white">
                  Open Diary
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-100 dark:to-gray-200 rounded-lg shadow-xl p-6 h-[70vh] overflow-hidden">
                {/* Left Page */}
                <div className="flex flex-col">
                  {currentPage === 0 ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">New Entry</h3>
                        <Button onClick={closeDiary} variant="ghost" size="sm">
                          Close
                        </Button>
                      </div>
                      <input
                        type="text"
                        placeholder="Entry title..."
                        value={currentTitle}
                        onChange={e => setCurrentTitle(e.target.value)}
                        className="w-full p-2 mb-3 bg-transparent border-b border-orange-300 focus:border-orange-500 outline-none"
                      />
                      <Textarea
                        ref={textareaRef}
                        value={currentEntry}
                        onChange={e => setCurrentEntry(e.target.value)}
                        placeholder="Dear diary, today I feel..."
                        className="flex-1 resize-none bg-transparent border-none focus:ring-0 text-sm"
                        style={{ fontFamily: "cursive" }}
                      />
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">How are you feeling?</p>
                        <div className="flex flex-wrap gap-2">
                          {moods.map(mood => {
                            const Icon = mood.icon
                            return (
                              <Button
                                key={mood.id}
                                variant={selectedMood === mood.id ? "default" : "outline"}
                                size="sm"
                                className={selectedMood === mood.id ? `${mood.color} text-white` : ""}
                                onClick={() => setSelectedMood(mood.id)}
                              >
                                <Icon className="h-4 w-4 mr-1" />
                                {mood.label}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button onClick={nextPage} variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4 mr-1" />
                          Next
                        </Button>
                        <Button
                          onClick={handleSaveEntry}
                          disabled={!currentEntry.trim() || !selectedMood || isSaving}
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                          {isSaving ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">AI Suggestions</h3>
                        <Button onClick={prevPage} variant="ghost" size="sm">
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back
                        </Button>
                      </div>
                      {aiSuggestion && (
                        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-4">
                          <div className="flex gap-2">
                            <Lightbulb className="h-5 w-5 text-blue-600" />
                            <p className="text-blue-700 text-sm">{aiSuggestion}</p>
                          </div>
                        </Card>
                      )}
                      <h4 className="font-medium text-gray-800 mb-2">Reflection Prompts</h4>
                      <div className="space-y-2 overflow-y-auto">
                        {[
                          "What am I grateful for today?",
                          "What challenged me and how did I handle it?",
                          "What would I like to improve tomorrow?",
                          "Who or what made me smile today?",
                        ].map((prompt, idx) => (
                          <Card
                            key={idx}
                            className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 cursor-pointer hover:scale-105 transition-all"
                          >
                            <div className="flex gap-2 items-center">
                              <Sparkles className="h-4 w-4 text-yellow-600" />
                              <p className="text-sm">{prompt}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Right Page */}
                <div className="flex flex-col overflow-hidden">
                  {selectedEntry ? (
                    <>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-800 truncate">{selectedEntry.title}</h3>
                        <div className={`p-2 rounded-full ${getMoodColor(selectedEntry.mood)}`}>
                          <div className="text-white">{getMoodIcon(selectedEntry.mood)}</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{new Date(selectedEntry.date).toLocaleDateString()}</p>
                      <div className="text-sm text-gray-800 leading-relaxed overflow-y-auto flex-1 mb-4" style={{ fontFamily: "cursive" }}>
                        {selectedEntry.content}
                      </div>
                      {selectedEntry.aiSuggestion && (
                        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                          <div className="flex gap-2">
                            <Lightbulb className="h-5 w-5 text-green-600" />
                            <p className="text-green-700 text-sm">{selectedEntry.aiSuggestion}</p>
                          </div>
                        </Card>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center text-gray-500">
                      <BookOpen className="h-12 w-12 text-gray-400 mb-2" />
                      <p>Select an entry to view it here</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}