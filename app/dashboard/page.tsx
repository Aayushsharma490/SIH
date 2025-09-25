"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import dynamic from 'next/dynamic';
import Link from "next/link"
import { motion } from "framer-motion";


const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
 
});

// Icons
import {
  Brain,
  Heart,
  MessageCircle,
  BookOpen,
  Gamepad2,
  Users,
  Settings,
  Sun,
  CloudRain,
  Zap,
  Smile,
  Meh,
  Frown,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react"

const moods = [
  { id: "happy", label: "Happy", icon: Smile, color: "bg-[#F7C1D0]", gradient: "from-[#F7C1D0] to-[#F7C1D0]" },
  { id: "calm", label: "Calm", icon: Sun, color: "bg-[#F4F8D3]", gradient: "from-[#F4F8D3] to-[#F4F8D3]" },
  { id: "neutral", label: "Neutral", icon: Meh, color: "bg-[#A6F1E0]", gradient: "from-[#A6F1E0] to-[#A6F1E0]" },
  { id: "anxious", label: "Anxious", icon: Zap, color: "bg-[#73C7C7]", gradient: "from-[#73C7C7] to-[#73C7C7]" },
  { id: "sad", label: "Sad", icon: Frown, color: "bg-[#A77C68]", gradient: "from-[#C5A599] to-[#A77C68]" },
  { id: "stressed", label: "Stressed", icon: CloudRain, color: "bg-[#C5A599]", gradient: "from-[#A77C68] to-[#C5A599]" },
]

// Memoized MoodButton component to prevent unnecessary re-renders
const MoodButton = ({ mood, isSelected, onSelect }: { 
  mood: typeof moods[0]; 
  isSelected: boolean; 
  onSelect: (id: string) => void 
}) => {
  const Icon = mood.icon;
  
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={`h-24 flex-col space-y-2 transition-all duration-300 transform hover:scale-110 ${isSelected ? `bg-gradient-to-br ${mood.gradient} text-white shadow-lg` : "hover:shadow-md"
        }`}
      onClick={() => onSelect(mood.id)}
    >
      <Icon className={`h-8 w-8 ${isSelected ? "animate-bounce" : ""}`} />
      <span className="text-sm font-medium">{mood.label}</span>
    </Button>
  );
};

// Stats card component to reduce repetition
const StatsCard = ({ title, value, subtitle, icon: Icon, color }: { 
  title: string; 
  value: string | number; 
  subtitle: string; 
  icon: React.ElementType;
  color: string;
}) => (
  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-lg">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <p className="text-xs mt-1">{subtitle}</p>
    </CardContent>
  </Card>
);

// Quick access card component
const QuickAccessCard = ({ 
  href, 
  title, 
  description, 
  icon: Icon, 
  gradient 
}: { 
  href?: string;
  title: string; 
  description: string; 
  icon: React.ElementType;
  gradient: string;
}) => {
  const content = (
    <Card className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${gradient} text-white border-0 h-full`}>
      <CardContent className="p-6 h-full flex flex-col justify-center">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-lg group-hover:animate-pulse">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
            <p className="text-opacity-80 text-base md:text-lg">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [userName] = useState("User")
  const [stats, setStats] = useState({
    dailyCheckIns: 3,
    weeklyGoal: 7,
    streakDays: 12,
    totalSessions: 45,
    moodTrend: "improving",
    lastActivity: "2 hours ago",
  })

  // Memoize stats to prevent unnecessary re-renders
  const memoizedStats = useMemo(() => stats, [
    stats.dailyCheckIns, 
    stats.weeklyGoal, 
    stats.streakDays, 
    stats.totalSessions, 
    stats.moodTrend, 
    stats.lastActivity
  ]);

  // Memoize the mood selection handler
  const handleMoodSelect = useCallback((moodId: string) => {
    setSelectedMood(moodId)
    setStats(prev => ({
      ...prev,
      dailyCheckIns: Math.min(prev.dailyCheckIns + 1, 7),
      streakDays: prev.streakDays + (Math.random() > 0.5 ? 1 : 0),
    }))
  }, []);

  // Memoize the selected mood data
  const selectedMoodData = useMemo(() => 
    moods.find((mood) => mood.id === selectedMood), 
    [selectedMood]
  );

  // Background style with memoization
  const backgroundStyle = useMemo(() => 
    selectedMoodData 
      ? `bg-gradient-to-br ${selectedMoodData.gradient} opacity-90` 
      : "bg-gradient-to-br from-[#F7C1D0] via-[#F4F8D3] to-[#A6F1E0] dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900",
    [selectedMoodData]
  );

  // Update stats less frequently
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        dailyCheckIns: Math.min(prev.dailyCheckIns + (Math.random() > 0.8 ? 1 : 0), 7),
        totalSessions: prev.totalSessions + (Math.random() > 0.9 ? 1 : 0),
        lastActivity: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }))
    }, 60000) // Reduced to every 60 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`min-h-screen transition-all duration-1000 ${backgroundStyle}`}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-indigo-600 animate-pulse" />
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  MindCare
                </span>
              </div>
              <Badge variant="secondary" className="animate-bounce ">
                Welcome back, {userName}!
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                <span>Last active: {memoizedStats.lastActivity}</span>
              </div>
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-300">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily Check-ins</p>
                  <p className="text-2xl font-bold">
                    {memoizedStats.dailyCheckIns}/{memoizedStats.weeklyGoal}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <Progress value={(memoizedStats.dailyCheckIns / memoizedStats.weeklyGoal) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Streak Days</p>
                  <p className="text-2xl font-bold">{memoizedStats.streakDays}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-green-600 mt-1">Keep it up! 🔥</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                  <p className="text-2xl font-bold">{memoizedStats.totalSessions}</p>
                </div>
                <Brain className="h-8 w-8 text-indigo-500" />
              </div>
              <p className="text-xs text-indigo-600 mt-1">Mood {memoizedStats.moodTrend}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Activity</p>
                  <p className="text-lg font-semibold">{memoizedStats.lastActivity}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-blue-600 mt-1">Stay active!</p>
            </CardContent>
          </Card>
        </div>

        {/* Hero Section with 3D Model */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12 items-center">
          {/* Left: Spline Model (Desktop Only) */}
          <div className="relative h-[700px] lg:h-[600px]  top-10 hidden lg:flex justify-center items-center animate-fade-in-left">
            <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="relative flex justify-center items-center w-full h-full"
    >
      <Spline
        scene="https://prod.spline.design/YPt6hwvbjGcoSCH2/scene.splinecode"
        style={{
          width: "110%",
          height: "110%",
        }}
        className="rounded-2xl bg-transparent transform scale-[1.15] -translate-x-[5%] transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.2] hover:-translate-y-2"
        onLoad={() => console.log("Spline loaded")}
      />
    </motion.div>
          </div>

          {/* Right: Text Section */}
          <div className="space-y-6 animate-fade-in-up text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight transition-all duration-700 ease-in-out">
              How are you feeling today?
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-700 ease-in-out">
              Your mental health journey starts with understanding your emotions. Select your current mood
              to get personalized support and resources.
            </p>

            {selectedMood && (
              <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm animate-fade-in">
                <p className="text-lg font-medium">
                  You're feeling <span className="capitalize font-bold">{selectedMood}</span> today. Let's
                  work together to support your wellbeing.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mood Selection Panel */}
        <Card className="mb-12 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Mood Check-In</CardTitle>
            <CardDescription>Select how you're feeling right now to customize your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {moods.map((mood) => (
                <MoodButton 
                  key={mood.id} 
                  mood={mood} 
                  isSelected={selectedMood === mood.id} 
                  onSelect={handleMoodSelect} 
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="flex flex-col space-y-10">
          {/* Spline Section */}
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl animate-leftRight">
            <div className="relative w-[180%] max-w-none h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 will-change-transform -ml-[40%]">
              <Spline
              //  scene="https://prod.spline.design/HZyAolBFPO872DlH/scene.splinecode"
           scene="https://prod.spline.design/HZyAolBFPO872DlH/scene.splinecode"
                className="scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 pointer-events-none"></div>
          </div>

          {/* Grid Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <QuickAccessCard
              href="/chatbot"
              title="Chat with Mentaify"
              description="AI-powered mental health support"
              icon={MessageCircle}
              gradient="from-blue-500 to-indigo-600"
            />
            
            <QuickAccessCard
              href="/diary"
              title="Digital Diary"
              description="Record your thoughts and feelings"
              icon={BookOpen}
              gradient="from-purple-500 to-pink-600"
            />
            
            <QuickAccessCard
              href="/games"
              title="Wellness Games"
              description="Interactive mood-boosting activities"
              icon={Gamepad2}
              gradient="from-green-500 to-emerald-600"
            />
            
            <QuickAccessCard
              href="/community"
              title="Community"
              description="Connect with fellow students"
              icon={Users}
              gradient="from-orange-500 to-red-600"
            />
            
            <QuickAccessCard
              title="Mood Analytics"
              href="/mood"
              description="Track your emotional patterns"
              icon={Heart}
              gradient="from-teal-500 to-cyan-600"
            />
            
            <QuickAccessCard
              title="Resources"
              href="/resources"
              description="Mental health guides & tips"
              icon={Brain}
              gradient="from-indigo-500 to-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 h-16 w-16 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 h-12 w-12 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 h-20 w-20 bg-white/10 rounded-full animate-float-slow"></div>
      </div>
    </div>
  )
}



