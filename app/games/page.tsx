"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Gamepad2,
  Trophy,
  Star,
  Play,
  Pause,
  RotateCcw,
  Target,
  Brain,
  Heart,
  Zap,
  Timer,
  Award,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"

interface Game {
  id: string
  title: string
  description: string
  mood: string[]
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  icon: React.ComponentType<any>
  color: string
  estimatedTime: string
  benefits: string[]
  popularity: number
}

const games: Game[] = [
  {
    id: "breathing",
    title: "Breathing Bubbles",
    description: "Follow the expanding bubble to practice deep breathing with 4-7-8 technique",
    mood: ["anxious", "stressed"],
    difficulty: "Easy",
    category: "Relaxation",
    icon: Heart,
    color: "from-blue-400 to-cyan-500",
    estimatedTime: "5 min",
    benefits: ["Reduces anxiety", "Lowers heart rate", "Improves focus"],
    popularity: 95,
  },
  {
    id: "memory",
    title: "Memory Palace",
    description: "Improve focus and memory with progressive card matching challenges",
    mood: ["neutral", "calm"],
    difficulty: "Medium",
    category: "Cognitive",
    icon: Brain,
    color: "from-purple-400 to-indigo-500",
    estimatedTime: "10 min",
    benefits: ["Enhances memory", "Improves concentration", "Boosts confidence"],
    popularity: 87,
  },
  {
    id: "gratitude",
    title: "Gratitude Garden",
    description: "Plant flowers by listing things you're grateful for and watch your garden grow",
    mood: ["sad", "neutral"],
    difficulty: "Easy",
    category: "Mindfulness",
    icon: Heart,
    color: "from-green-400 to-emerald-500",
    estimatedTime: "8 min",
    benefits: ["Increases positivity", "Reduces depression", "Builds resilience"],
    popularity: 92,
  },
  {
    id: "focus",
    title: "Focus Flow",
    description: "Guide the ball through obstacles with concentration and mindful attention",
    mood: ["anxious", "stressed"],
    difficulty: "Hard",
    category: "Concentration",
    icon: Target,
    color: "from-orange-400 to-red-500",
    estimatedTime: "15 min",
    benefits: ["Improves attention", "Reduces mind wandering", "Builds patience"],
    popularity: 78,
  },
  {
    id: "energy",
    title: "Energy Boost",
    description: "Quick reaction game to increase alertness and combat fatigue",
    mood: ["sad", "neutral"],
    difficulty: "Medium",
    category: "Activation",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    estimatedTime: "7 min",
    benefits: ["Increases energy", "Improves mood", "Enhances alertness"],
    popularity: 83,
  },
  {
    id: "mindful-maze",
    title: "Mindful Maze",
    description: "Navigate through a calming maze while practicing mindfulness meditation",
    mood: ["anxious", "stressed", "neutral"],
    difficulty: "Medium",
    category: "Mindfulness",
    icon: Brain,
    color: "from-teal-400 to-blue-500",
    estimatedTime: "12 min",
    benefits: ["Reduces stress", "Improves mindfulness", "Enhances problem-solving"],
    popularity: 89,
  },
  {
    id: "emotion-wheel",
    title: "Emotion Wheel",
    description: "Spin the wheel and explore different emotions through interactive exercises",
    mood: ["sad", "neutral", "happy"],
    difficulty: "Easy",
    category: "Emotional Intelligence",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    estimatedTime: "6 min",
    benefits: ["Emotional awareness", "Self-understanding", "Mood regulation"],
    popularity: 91,
  },
  {
    id: "stress-buster",
    title: "Stress Buster",
    description: "Pop stress bubbles with positive affirmations and calming visuals",
    mood: ["stressed", "anxious"],
    difficulty: "Easy",
    category: "Stress Relief",
    icon: Zap,
    color: "from-violet-400 to-purple-500",
    estimatedTime: "5 min",
    benefits: ["Immediate stress relief", "Positive thinking", "Quick mood boost"],
    popularity: 94,
  },
]

const BreathingGame = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [count, setCount] = useState(4)
  const [cycle, setCycle] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [heartRate, setHeartRate] = useState(72)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    let timeInterval: NodeJS.Timeout | null = null

    if (isActive) {
      timeInterval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
        // Simulate heart rate reduction during breathing exercise
        setHeartRate((prev) => Math.max(60, prev - 0.1))
      }, 1000)
    }

    if (isActive && count > 0) {
      interval = setInterval(() => {
        setCount(count - 1)
      }, 1000)
    } else if (isActive && count === 0) {
      if (phase === "inhale") {
        setPhase("hold")
        setCount(7)
      } else if (phase === "hold") {
        setPhase("exhale")
        setCount(8)
      } else {
        setPhase("inhale")
        setCount(4)
        setCycle(cycle + 1)
        if (cycle >= 4) {
          setIsActive(false)
          onComplete()
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval)
      if (timeInterval) clearInterval(timeInterval)
    }
  }, [isActive, count, phase, cycle, onComplete])

  const bubbleSize = phase === "inhale" ? "scale-150" : phase === "hold" ? "scale-150" : "scale-75"

  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-8">
      <div className="flex space-x-8 mb-4">
        <div className="text-center">
          <div className="flex items-center space-x-2">
            <Timer className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Session Time</span>
          </div>
          <p className="text-lg font-bold">
            {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, "0")}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-sm text-gray-600">Heart Rate</span>
          </div>
          <p className="text-lg font-bold">{Math.round(heartRate)} BPM</p>
        </div>
      </div>

      <div className="relative">
        <div
          className={`w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full transition-transform duration-1000 ${bubbleSize} opacity-80`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xl">{count}</span>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold capitalize">{phase}</h3>
        <p className="text-gray-600">Cycle {cycle + 1} of 5</p>
        <Progress value={(cycle / 5) * 100} className="w-64" />
      </div>

      <div className="flex space-x-4">
        <Button onClick={() => setIsActive(!isActive)} className="bg-blue-600 hover:bg-blue-700">
          {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button
          onClick={() => {
            setIsActive(false)
            setPhase("inhale")
            setCount(4)
            setCycle(0)
            setSessionTime(0)
            setHeartRate(72)
          }}
          variant="outline"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  )
}

const MemoryGame = ({ onComplete }: { onComplete: () => void }) => {
  const [cards, setCards] = useState<number[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [gameTime, setGameTime] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  useEffect(() => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8]
    const shuffled = [...numbers, ...numbers].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setStartTime(new Date())
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (startTime && matched.length < cards.length) {
      interval = setInterval(() => {
        setGameTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [startTime, matched.length, cards.length])

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second])
        setFlipped([])
        setStreak(streak + 1)
        setBestStreak(Math.max(bestStreak, streak + 1))
        if (matched.length + 2 === cards.length) {
          setTimeout(onComplete, 500)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
        setStreak(0)
      }
      setMoves(moves + 1)
    }
  }, [flipped, cards, matched, moves, streak, bestStreak, onComplete])

  const handleCardClick = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      setFlipped([...flipped, index])
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="grid grid-cols-4 gap-8 text-center">
        <div>
          <p className="text-2xl font-bold">{moves}</p>
          <p className="text-sm text-gray-600">Moves</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{matched.length / 2}/8</p>
          <p className="text-sm text-gray-600">Pairs</p>
        </div>
        <div>
          <p className="text-2xl font-bold">
            {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, "0")}
          </p>
          <p className="text-sm text-gray-600">Time</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">{bestStreak}</p>
          <p className="text-sm text-gray-600">Best Streak</p>
        </div>
      </div>

      {streak > 0 && (
        <Badge variant="secondary" className="animate-pulse">
          <TrendingUp className="h-3 w-3 mr-1" />
          Streak: {streak}
        </Badge>
      )}

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center text-white font-bold text-xl ${
              flipped.includes(index) || matched.includes(index)
                ? "bg-gradient-to-br from-purple-500 to-indigo-600 transform scale-105"
                : "bg-gradient-to-br from-gray-400 to-gray-600 hover:scale-105"
            }`}
          >
            {(flipped.includes(index) || matched.includes(index)) && card}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GamesPage() {
  const [selectedMood, setSelectedMood] = useState<string>("all")
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [completedGames, setCompletedGames] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [sessionStats, setSessionStats] = useState({
    gamesPlayed: 0,
    totalTime: 0,
    averageScore: 0,
    streak: 0,
  })
  const [leaderboard] = useState([
    { name: "Alex M.", score: 1250, games: 45 },
    { name: "Sarah K.", score: 1180, games: 38 },
    { name: "Mike R.", score: 1050, games: 42 },
    { name: "You", score: score, games: completedGames.length },
  ])

  const moods = [
    { id: "all", label: "All Games" },
    { id: "happy", label: "Happy" },
    { id: "calm", label: "Calm" },
    { id: "neutral", label: "Neutral" },
    { id: "anxious", label: "Anxious" },
    { id: "sad", label: "Sad" },
    { id: "stressed", label: "Stressed" },
  ]

  const filteredGames = selectedMood === "all" ? games : games.filter((game) => game.mood.includes(selectedMood))

  const handleGameComplete = (gameId: string) => {
    if (!completedGames.includes(gameId)) {
      setCompletedGames([...completedGames, gameId])
      const gamePoints =
        games.find((g) => g.id === gameId)?.difficulty === "Hard"
          ? 20
          : games.find((g) => g.id === gameId)?.difficulty === "Medium"
            ? 15
            : 10
      setScore(score + gamePoints)
      setSessionStats((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        streak: prev.streak + 1,
      }))
    }
    setActiveGame(null)
  }

  const renderGame = () => {
    switch (activeGame) {
      case "breathing":
        return <BreathingGame onComplete={() => handleGameComplete("breathing")} />
      case "memory":
        return <MemoryGame onComplete={() => handleGameComplete("memory")} />
      default:
        return (
          <div className="text-center py-12">
            <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Game Coming Soon!</h3>
            <p className="text-gray-500">This game is under development. Try our other wellness activities!</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900">
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
                <Gamepad2 className="h-8 w-8 text-green-600 animate-pulse" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    Wellness Games
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Interactive mood-boosting activities</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="animate-bounce">
                <Trophy className="h-3 w-3 mr-1" />
                Score: {score}
              </Badge>
              <Badge variant="outline">
                <Star className="h-3 w-3 mr-1" />
                {completedGames.length} completed
              </Badge>
              {sessionStats.streak > 0 && (
                <Badge variant="default" className="bg-green-600">
                  <Award className="h-3 w-3 mr-1" />
                  Streak: {sessionStats.streak}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {activeGame ? (
          <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{games.find((g) => g.id === activeGame)?.title}</CardTitle>
                <Button onClick={() => setActiveGame(null)} variant="outline">
                  Back to Games
                </Button>
              </div>
            </CardHeader>
            <CardContent>{renderGame()}</CardContent>
          </Card>
        ) : (
          <>
            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-3">
                {/* Mood Filter */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Filter by Mood</h2>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <Button
                        key={mood.id}
                        variant={selectedMood === mood.id ? "default" : "outline"}
                        onClick={() => setSelectedMood(mood.id)}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        {mood.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time Leaderboard */}
              <div className="lg:col-span-1">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Leaderboard</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {leaderboard
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded ${
                            player.name === "You" ? "bg-green-100 dark:bg-green-900/20" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm">#{index + 1}</span>
                            <span className="text-sm">{player.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{player.score}</p>
                            <p className="text-xs text-gray-500">{player.games} games</p>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => {
                const Icon = game.icon
                const isCompleted = completedGames.includes(game.id)

                return (
                  <Card
                    key={game.id}
                    className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg"
                    onClick={() => setActiveGame(game.id)}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-full h-32 bg-gradient-to-br ${game.color} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}
                      >
                        <Icon className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-300" />
                        {isCompleted && (
                          <div className="absolute top-2 right-2">
                            <Trophy className="h-6 w-6 text-yellow-300" />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {game.popularity}% ❤️
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold">{game.title}</h3>
                          <div className="flex items-center space-x-1">
                            <Timer className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{game.estimatedTime}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{game.description}</p>

                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {game.benefits.slice(0, 2).map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {game.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {game.difficulty}
                          </Badge>
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveGame(game.id)
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isCompleted ? "Play Again" : "Start Game"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No games found</h3>
                <p className="text-gray-500">Try selecting a different mood filter</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 h-16 w-16 bg-green-200/20 dark:bg-green-800/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 h-12 w-12 bg-teal-200/20 dark:bg-teal-800/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 h-20 w-20 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full animate-float-slow"></div>
      </div>
    </div>
  )
}
