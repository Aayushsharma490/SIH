"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  RefreshCw,
  Settings,
  BarChart3,
  MessageSquare,
  BookOpen,
  Gamepad2,
  Trophy,
  Bell,
  Download,
  Upload,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Server,
  Database,
  Wifi,
  HardDrive,
} from "lucide-react"

interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  avgSessionTime: string
  serverUptime: string
  databaseHealth: "healthy" | "warning" | "critical"
  apiResponseTime: number
  errorRate: number
}

interface UserActivity {
  id: string
  username: string
  university: string
  lastActive: string
  sessionsToday: number
  moodEntries: number
  chatMessages: number
  status: "active" | "inactive" | "flagged"
}

interface ContentReport {
  id: string
  type: "post" | "message" | "diary"
  content: string
  reportedBy: string
  reason: string
  timestamp: string
  status: "pending" | "approved" | "removed"
}

const mockMetrics: SystemMetrics = {
  totalUsers: 15847,
  activeUsers: 3421,
  totalSessions: 89234,
  avgSessionTime: "24m 32s",
  serverUptime: "99.97%",
  databaseHealth: "healthy",
  apiResponseTime: 145,
  errorRate: 0.02,
}

const mockUserActivity: UserActivity[] = [
  {
    id: "1",
    username: "sarah_m",
    university: "MIT",
    lastActive: "2 minutes ago",
    sessionsToday: 3,
    moodEntries: 12,
    chatMessages: 45,
    status: "active",
  },
  {
    id: "2",
    username: "alex_k",
    university: "Stanford",
    lastActive: "15 minutes ago",
    sessionsToday: 2,
    moodEntries: 8,
    chatMessages: 23,
    status: "active",
  },
  {
    id: "3",
    username: "jamie_l",
    university: "Harvard",
    lastActive: "1 hour ago",
    sessionsToday: 1,
    moodEntries: 3,
    chatMessages: 67,
    status: "flagged",
  },
]

const mockReports: ContentReport[] = [
  {
    id: "1",
    type: "post",
    content: "This community post contains inappropriate language...",
    reportedBy: "user_123",
    reason: "Inappropriate content",
    timestamp: "2 hours ago",
    status: "pending",
  },
  {
    id: "2",
    type: "message",
    content: "Chatbot conversation flagged for review...",
    reportedBy: "user_456",
    reason: "Spam",
    timestamp: "4 hours ago",
    status: "pending",
  },
]

export default function AdminPanel() {
  const [metrics, setMetrics] = useState<SystemMetrics>(mockMetrics)
  const [userActivity, setUserActivity] = useState<UserActivity[]>(mockUserActivity)
  const [reports, setReports] = useState<ContentReport[]>(mockReports)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newUpdate, setNewUpdate] = useState({ title: "", description: "", version: "" })

  const refreshData = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update metrics with slight variations
    setMetrics({
      ...metrics,
      activeUsers: metrics.activeUsers + Math.floor(Math.random() * 100) - 50,
      apiResponseTime: metrics.apiResponseTime + Math.floor(Math.random() * 20) - 10,
    })

    setIsRefreshing(false)
  }

  const handleContentModeration = (reportId: string, action: "approve" | "remove") => {
    setReports(
      reports.map((report) =>
        report.id === reportId ? { ...report, status: action === "approve" ? "approved" : "removed" } : report,
      ),
    )
  }

  const handleUserAction = (userId: string, action: "ban" | "unban") => {
    setUserActivity(
      userActivity.map((user) =>
        user.id === userId ? { ...user, status: action === "ban" ? "inactive" : "active" } : user,
      ),
    )
  }

  const publishUpdate = () => {
    if (!newUpdate.title || !newUpdate.description || !newUpdate.version) return

    // Simulate publishing update
    alert(`Update ${newUpdate.version} published successfully!`)
    setNewUpdate({ title: "", description: "", version: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">MindCare System Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="animate-bounce">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Button
                onClick={refreshData}
                disabled={isRefreshing}
                variant="outline"
                className="hover:scale-110 transition-transform duration-300 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                      <p className="text-2xl font-bold text-green-600">{metrics.activeUsers.toLocaleString()}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Server Uptime</p>
                      <p className="text-2xl font-bold text-green-600">{metrics.serverUptime}</p>
                    </div>
                    <Server className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">API Response</p>
                      <p className="text-2xl font-bold">{metrics.apiResponseTime}ms</p>
                    </div>
                    <Wifi className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database Health</span>
                    <Badge variant={metrics.databaseHealth === "healthy" ? "default" : "destructive"}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {metrics.databaseHealth}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>34%</span>
                    </div>
                    <Progress value={34} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Usage Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span>Chat Sessions</span>
                    </div>
                    <span className="font-bold">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                      <span>Diary Entries</span>
                    </div>
                    <span className="font-bold">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gamepad2 className="h-4 w-4 text-green-600" />
                      <span>Games Played</span>
                    </div>
                    <span className="font-bold">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-orange-600" />
                      <span>Community Posts</span>
                    </div>
                    <span className="font-bold">8</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>User Activity Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userActivity.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium">{user.username}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.university}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-bold">{user.sessionsToday}</p>
                          <p className="text-gray-500">Sessions</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold">{user.moodEntries}</p>
                          <p className="text-gray-500">Moods</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold">{user.chatMessages}</p>
                          <p className="text-gray-500">Messages</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            user.status === "active"
                              ? "default"
                              : user.status === "flagged"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, user.status === "active" ? "ban" : "unban")}
                        >
                          {user.status === "active" ? <Ban className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Moderation Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Content Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{report.type}</Badge>
                          <span className="text-sm text-gray-600">{report.timestamp}</span>
                        </div>
                        <Badge
                          variant={
                            report.status === "pending"
                              ? "secondary"
                              : report.status === "approved"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>

                      <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded italic">"{report.content}"</p>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <span>Reported by: {report.reportedBy}</span>
                          <span className="ml-4">Reason: {report.reason}</span>
                        </div>

                        {report.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleContentModeration(report.id, "approve")}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleContentModeration(report.id, "remove")}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Wellness Leaderboard</span>
                  </div>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Rankings
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "Sarah M.", university: "MIT", score: 2450, streak: 15 },
                    { rank: 2, name: "Alex K.", university: "Stanford", score: 2380, streak: 12 },
                    { rank: 3, name: "Jamie L.", university: "Harvard", score: 2290, streak: 18 },
                    { rank: 4, name: "Taylor R.", university: "Berkeley", score: 2150, streak: 8 },
                    { rank: 5, name: "Morgan P.", university: "Caltech", score: 2080, streak: 22 },
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            user.rank === 1
                              ? "bg-yellow-500"
                              : user.rank === 2
                                ? "bg-gray-400"
                                : user.rank === 3
                                  ? "bg-orange-600"
                                  : "bg-blue-500"
                          }`}
                        >
                          {user.rank}
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.university}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-lg">{user.score}</p>
                          <p className="text-gray-500">Points</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg">{user.streak}</p>
                          <p className="text-gray-500">Day Streak</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>System Maintenance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Shutdown
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Data Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export User Data
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Analytics
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Configuration
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View System Logs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Publish New Update</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Update Title"
                    value={newUpdate.title}
                    onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                  />
                  <Input
                    placeholder="Version (e.g., v2.1.0)"
                    value={newUpdate.version}
                    onChange={(e) => setNewUpdate({ ...newUpdate, version: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Update description and changelog..."
                  value={newUpdate.description}
                  onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                  className="min-h-32"
                />
                <Button
                  onClick={publishUpdate}
                  disabled={!newUpdate.title || !newUpdate.description || !newUpdate.version}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Publish Update
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      version: "v2.0.1",
                      title: "Bug Fixes and Performance Improvements",
                      date: "2 days ago",
                      status: "deployed",
                    },
                    {
                      version: "v2.0.0",
                      title: "Major UI Overhaul and New Features",
                      date: "1 week ago",
                      status: "deployed",
                    },
                    {
                      version: "v1.9.5",
                      title: "Enhanced Security and Privacy Controls",
                      date: "2 weeks ago",
                      status: "deployed",
                    },
                  ].map((update, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{update.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {update.version} • {update.date}
                        </p>
                      </div>
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {update.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 h-16 w-16 bg-red-200/20 dark:bg-red-800/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 h-12 w-12 bg-orange-200/20 dark:bg-orange-800/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 h-20 w-20 bg-gray-200/20 dark:bg-gray-800/20 rounded-full animate-float-slow"></div>
      </div>
    </div>
  )
}