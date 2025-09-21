"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Heart, Users, Shield, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (formData: FormData, userType: "student" | "admin") => {
    setIsLoading(true)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Admin login check
    if (userType === "admin" && email === "admin2025@gmail.com" && password === "admin@2025") {
      window.location.href = "/admin"
      return
    }

    if (userType === "student" && email === "user@gmail.com" && password === "pass123") {
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
      return
    }

    // Student login simulation for any other credentials
    if (userType === "student") {
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
      return
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-indigo-600 animate-pulse" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MindCare
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hover:bg-white/50 transition-all duration-300">
              About
            </Button>
            <Button variant="ghost" className="hover:bg-white/50 transition-all duration-300">
              Contact
            </Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium animate-bounce">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Mental Health Support
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Your Mental Health{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Companion
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Comprehensive digital support system designed specifically for higher education students. Track your
                mood, chat with AI, maintain a digital diary, and connect with your community.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Heart className="h-6 w-6 text-red-500" />
                <span className="font-medium">Mood Tracking</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Brain className="h-6 w-6 text-indigo-500" />
                <span className="font-medium">AI Chatbot</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Users className="h-6 w-6 text-green-500" />
                <span className="font-medium">Community</span>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Shield className="h-6 w-6 text-blue-500" />
                <span className="font-medium">Privacy First</span>
              </div>
            </div>

            {/* <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Demo Credentials:</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>User:</strong> user@gmail.com / pass123
                <br />
                <strong>Admin:</strong> admin2025@gmail.com / admin@2025
              </p>
            </div> */}
          </div>

          {/* Login Section */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg animate-fade-in-right">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>Sign in to access your mental health dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="student" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student" className="transition-all duration-300">
                      Student
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="transition-all duration-300">
                      Admin
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="student">
                    <form action={(formData) => handleLogin(formData, "student")} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-email">Email</Label>
                        <Input
                          id="student-email"
                          name="email"
                          type="email"
                          placeholder="enter your email..."
                          // placeholder="user@gmail.com"user@gmail.com
                          required
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student-password">Password</Label>
                        <Input
                          id="student-password"
                          name="password"
                          type="password"
                          placeholder="enter your password...."
                          //pass =123
                          required
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Sign In</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="admin">
                    <form action={(formData) => handleLogin(formData, "admin")} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input
                          id="admin-email"
                          name="email"
                          type="email"
                          placeholder="enter your email....."
                          //admin2025@gmail.com
                          required
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Admin Password</Label>
                        <Input
                          id="admin-password"
                          name="password"
                          type="password"
                          placeholder="enter your password"
                          //admin@2025
                          required
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Admin Access</span>
                            <Shield className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-300"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 h-20 w-20 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 h-16 w-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 h-24 w-24 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-float-slow"></div>
      </div>
    </div>
  )
}
