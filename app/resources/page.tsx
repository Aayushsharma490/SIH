"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Book,
  Video,
  Headphones,
  FileText,
  Users,
  Phone,
  Globe,
  Download,
  Search,
  ArrowLeft,
} from "lucide-react"

const resourcesData = {
  immediateHelp: [
    {
      name: "National Suicide Prevention Lifeline",
      contact: "988",
      available: "24/7",
      description: "Free, confidential support",
      type: "Phone",
    },
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      available: "24/7",
      description: "Text-based crisis support",
      type: "Text",
    },
    {
      name: "Emergency Services",
      contact: "911",
      available: "24/7",
      description: "Immediate emergency help",
      type: "Phone",
    },
  ],
  therapyPlatforms: [
    {
      name: "BetterHelp",
      description: "Online therapy platform",
      url: "https://www.betterhelp.com",
      cost: "$$",
      type: "Platform",
    },
    {
      name: "Talkspace",
      description: "Text and video therapy",
      url: "https://www.talkspace.com",
      cost: "$$",
      type: "Platform",
    },
    {
      name: "7 Cups",
      description: "Free emotional support",
      url: "https://www.7cups.com",
      cost: "Free",
      type: "Platform",
    },
  ],
  selfHelp: [
    {
      name: "Headspace",
      description: "Meditation and mindfulness",
      type: "App",
      category: "Meditation",
    },
    {
      name: "Calm",
      description: "Sleep and meditation",
      type: "App",
      category: "Meditation",
    },
    {
      name: "MindShift CBT",
      description: "Anxiety management",
      type: "App",
      category: "CBT",
    },
  ],
  educational: [
    {
      name: "NAMI Resources",
      description: "National Alliance on Mental Illness",
      url: "https://www.nami.org",
      type: "Organization",
    },
    {
      name: "Mental Health America",
      description: "Screening tools and resources",
      url: "https://www.mhanational.org",
      type: "Organization",
    },
  ],
}

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "All Resources" },
    { id: "immediate", label: "Immediate Help" },
    { id: "therapy", label: "Therapy Platforms" },
    { id: "selfhelp", label: "Self-Help Tools" },
    { id: "education", label: "Educational" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Mental Health Resources
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Find support, tools, and information for your mental health journey
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base md:text-lg"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap text-sm md:text-base"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Immediate Help */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <Phone className="h-7 w-7 mr-2 text-red-500" />
            Immediate Help (24/7)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesData.immediateHelp.map((resource, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow border-red-200"
              >
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    {resource.name}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="destructive" className="text-sm md:text-base">
                      {resource.contact}
                    </Badge>
                    <p className="text-sm md:text-base text-gray-600">
                      Available: {resource.available}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Therapy Platforms */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <Users className="h-7 w-7 mr-2 text-blue-500" />
            Online Therapy Platforms
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesData.therapyPlatforms.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    {resource.name}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge
                      variant={
                        resource.cost === "Free" ? "secondary" : "default"
                      }
                      className="text-sm md:text-base"
                    >
                      {resource.cost}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm md:text-base flex items-center"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Self-Help Tools */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <Download className="h-7 w-7 mr-2 text-green-500" />
            Self-Help Tools & Apps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourcesData.selfHelp.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    {resource.name}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-sm md:text-base">
                      {resource.type}
                    </Badge>
                    <Badge variant="secondary" className="text-sm md:text-base">
                      {resource.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Educational */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <Book className="h-7 w-7 mr-2 text-purple-500" />
            Educational Resources
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {resourcesData.educational.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    {resource.name}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm md:text-base"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Learn More
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}




















