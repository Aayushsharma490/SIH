"use client"

import { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"

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



export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"communities" | "feed" | "create">("feed")
  const [communities, setCommunities] = useState<Community[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState("Support")

  const categories = [
    "all",
    "Support",
    "Academic",
    "Event",
    "Mindfulness",
    "University",
    "Social",
    "Support Group",
  ]

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("authToken")

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    }

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/community`;

const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  ...options,
  headers,
  credentials: "include",
});

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [communitiesData, postsData] = await Promise.all([
          apiFetch("/communities"),
          apiFetch("/posts"),
        ])

        setCommunities(communitiesData)
        setPosts(postsData)
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCommunities = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.university.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleJoinCommunity = async (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 }
          : c
      )
    )
    try {
      await apiFetch(`/communities/${communityId}/join`, { method: "POST" })
    } catch (err) {
      console.error("Failed to update community join status", err)
    }
  }

  const handleLikePost = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
      )
    )
    try {
      await apiFetch(`/posts/${postId}/like`, { method: "POST" })
    } catch (err) {
      console.error("Failed to update post like status", err)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return
    setIsSubmitting(true)
    try {
      const createdPost = await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify({ content: newPostContent, category: newPostCategory }),
      })
      setPosts((prev) => [createdPost, ...prev])
      setNewPostContent("")
      setNewPostCategory("Support")
      setActiveTab("feed")
    } catch (err) {
      console.error("Failed to create post", err)
      setError("Could not create the post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="ml-4 text-lg">Loading communities...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/50">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/dashboard">
            <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-300">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </a>
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-purple-600 animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Community
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect with fellow students</p>
            </div>
          </div>
          <Badge variant="secondary" className="animate-bounce">
            <Shield className="h-3 w-3 mr-1" />
            Safe Space
          </Badge>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2">
          {["feed", "communities", "create"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab as any)}
              className="transition-all duration-300 hover:scale-105 flex-shrink-0"
            >
              {tab === "feed" && <MessageCircle className="h-4 w-4 mr-2" />}
              {tab === "communities" && <Users className="h-4 w-4 mr-2" />}
              {tab === "create" && <Plus className="h-4 w-4 mr-2" />}
              {tab === "feed" ? "Feed" : tab === "communities" ? "Find Communities" : "Create Post"}
            </Button>
          ))}
        </div>

        {/* Search & Filter */}
        {(activeTab === "feed" || activeTab === "communities") && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={activeTab === "feed" ? "Search posts..." : "Search communities..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-300 focus:scale-[1.02]"
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
        )}

        {/* Active Tab Content */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:scale-[1.02] transition-all duration-300"
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
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:scale-110 transition-all duration-300">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:scale-110 transition-all duration-300">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No posts found. Why not create one?</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "communities" && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((community) => (
                <Card
                  key={community.id}
                  className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:scale-[1.02] transition-all duration-300"
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
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{community.description}</p>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{community.members.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{community.lastActivity}</span>
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
              ))
            ) : (
              <div className="text-center py-10 md:col-span-2">
                <p className="text-gray-500">No communities match your search.</p>
              </div>
            )}
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
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-32 transition-all duration-300 focus:scale-[1.02]"
                maxLength={500}
              />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.filter((c) => c !== "all").map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <Button
                  onClick={handleCreatePost}
                  disabled={isSubmitting || !newPostContent.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}