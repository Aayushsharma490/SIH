"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Users,
  Plus,
  MessageCircle,
  Heart,
  Share,
  Search,
  Filter,
  University,
  MapPin,
  Clock,
  Shield,
} from "lucide-react"
import Link from "next/link"

interface Community {
  id: string
  name: string
  university: string
  location: string
  members: number
  description: string
  category: string
  isJoined: boolean
  lastActivity: string
}

interface Post {
  id: string
  author: string
  university: string
  content: string
  timestamp: string
  likes: number
  comments: number
  category: string
  isLiked: boolean
}

const mockCommunities: Community[] = [
  {
    id: "1",
    name: "MIT Mental Health Support",
    university: "Massachusetts Institute of Technology",
    location: "Cambridge, MA",
    members: 1247,
    description:
      "A safe space for MIT students to share experiences and support each other through academic stress and mental health challenges.",
    category: "University",
    isJoined: true,
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    name: "Stanford Wellness Circle",
    university: "Stanford University",
    location: "Stanford, CA",
    members: 892,
    description:
      "Promoting mental wellness and work-life balance among Stanford students through peer support and mindfulness practices.",
    category: "University",
    isJoined: false,
    lastActivity: "5 hours ago",
  },
  {
    id: "3",
    name: "Harvard Anxiety Support Group",
    university: "Harvard University",
    location: "Cambridge, MA",
    members: 634,
    description: "Focused support group for students dealing with anxiety, panic attacks, and stress management.",
    category: "Support Group",
    isJoined: true,
    lastActivity: "1 day ago",
  },
  {
    id: "4",
    name: "Berkeley Mindfulness Community",
    university: "UC Berkeley",
    location: "Berkeley, CA",
    members: 456,
    description: "Practicing mindfulness, meditation, and stress reduction techniques together as a community.",
    category: "Mindfulness",
    isJoined: false,
    lastActivity: "3 hours ago",
  },
]

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Sarah M.",
    university: "MIT",
    content:
      "Just wanted to share that I finally reached out to the counseling center today. It was scary but the counselor was so understanding. Remember, asking for help is a sign of strength, not weakness. 💪",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    category: "Support",
    isLiked: false,
  },
  {
    id: "2",
    author: "Alex K.",
    university: "Stanford",
    content:
      "Finals week is approaching and I'm feeling overwhelmed. Does anyone have study techniques that help with anxiety? I've been trying the Pomodoro technique but looking for more strategies.",
    timestamp: "4 hours ago",
    likes: 15,
    comments: 12,
    category: "Academic",
    isLiked: true,
  },
  {
    id: "3",
    author: "Jamie L.",
    university: "Harvard",
    content:
      "Meditation session in the library quiet room at 6 PM today. All are welcome! We'll practice some breathing exercises and mindfulness techniques. 🧘‍♀️",
    timestamp: "6 hours ago",
    likes: 31,
    comments: 5,
    category: "Event",
    isLiked: false,
  },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"communities" | "feed" | "create">("feed")
  const [communities, setCommunities] = useState(mockCommunities)
  const [posts, setPosts] = useState(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newPost, setNewPost] = useState("")
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    university: "",
    location: "",
    description: "",
    category: "",
  })

  const categories = ["all", "Support Group", "University", "Mindfulness", "Academic", "Social"]

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.university.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || community.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesCategory
  })

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(
      communities.map((community) =>
        community.id === communityId
          ? {
              ...community,
              isJoined: !community.isJoined,
              members: community.isJoined ? community.members - 1 : community.members + 1,
            }
          : community,
      ),
    )
  }

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const post: Post = {
      id: Date.now().toString(),
      author: "You",
      university: "Your University",
      content: newPost,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      category: "Support",
      isLiked: false,
    }

    setPosts([post, ...posts])
    setNewPost("")
    setActiveTab("feed")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
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
                <Users className="h-8 w-8 text-purple-600 animate-pulse" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Community
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connect with fellow students</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="animate-bounce">
              <Shield className="h-3 w-3 mr-1" />
              Safe Space
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === "feed" ? "default" : "outline"}
            onClick={() => setActiveTab("feed")}
            className="transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Community Feed
          </Button>
          <Button
            variant={activeTab === "communities" ? "default" : "outline"}
            onClick={() => setActiveTab("communities")}
            className="transition-all duration-300 hover:scale-105"
          >
            <Users className="h-4 w-4 mr-2" />
            Find Communities
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className="transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search communities or posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all duration-300 focus:scale-105"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:scale-105 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{post.author}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <University className="h-3 w-3" />
                          <span>{post.university}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{post.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikePost(post.id)}
                        className={`transition-all duration-300 hover:scale-110 ${
                          post.isLiked ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:scale-110 transition-all duration-300"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:scale-110 transition-all duration-300"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "communities" && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCommunities.map((community) => (
              <Card
                key={community.id}
                className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:scale-105 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{community.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <University className="h-4 w-4" />
                        <span>{community.university}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{community.location}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {community.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {community.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{community.members.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{community.lastActivity}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleJoinCommunity(community.id)}
                    className={`w-full transition-all duration-300 transform hover:scale-105 ${
                      community.isJoined
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    }`}
                  >
                    {community.isJoined ? "Leave Community" : "Join Community"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "create" && (
          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>Share with the Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Community Guidelines</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Be respectful and supportive of others</li>
                      <li>• No personal attacks or harassment</li>
                      <li>• Share experiences, not medical advice</li>
                      <li>• Maintain confidentiality and privacy</li>
                      <li>• Report inappropriate content</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Textarea
                placeholder="Share your thoughts, experiences, or ask for support..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-32 transition-all duration-300 focus:scale-105"
              />

              <div className="flex justify-between">
                <div className="text-sm text-gray-500">{newPost.length}/500 characters</div>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  Share Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 h-16 w-16 bg-purple-200/20 dark:bg-purple-800/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 h-12 w-12 bg-pink-200/20 dark:bg-pink-800/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 h-20 w-20 bg-rose-200/20 dark:bg-rose-800/20 rounded-full animate-float-slow"></div>
      </div>
    </div>
  )
}
