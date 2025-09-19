"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Code, Zap, Github, ExternalLink, ChevronRight, Sparkles, Brain, Rocket } from "lucide-react"
import Link from 'next/link'

export default function Portfolio() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center space-y-8 mb-20">
            {/* Name with glowing effect */}
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-bold text-white animate-pulse">
                Koushal Sharma
              </h1>
              <div className="absolute inset-0 text-6xl md:text-8xl font-bold text-white blur-sm opacity-50">
                Koushal Sharma
              </div>
            </div>
            
            {/* Subtitle */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-light text-gray-300">
                Full-Stack Developer & AI Enthusiast
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Crafting intelligent solutions that bridge the gap between cutting-edge technology and real-world applications. 
                Specializing in AI-powered platforms, modern web development, and scalable architectures.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-8 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <Link href="#projects" className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Explore Projects
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-purple-400/30 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400/60 px-8 py-6 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link href="https://github.com/KoushalShrma" target="_blank" className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  View GitHub
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Projects Section */}
          <section id="projects" className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Featured Projects
              </h3>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Innovative solutions that demonstrate the power of modern technology and intelligent design
              </p>
            </div>

            {/* AI Email Agent Project */}
            <div className="max-w-6xl mx-auto">
              <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative z-10 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                        <Mail className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                          AI Email Agent
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            Live
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      asChild
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transform transition-all duration-300"
                    >
                      <Link href="/email-agent" className="flex items-center gap-2">
                        <span className="hidden sm:inline">Launch App</span>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-6">
                  <CardDescription className="text-lg text-gray-700 leading-relaxed">
                    Intelligent email generation and automated outreach platform using AI. Perfect for recruitment, business development, and personalized communication at scale.
                  </CardDescription>
                  
                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Key Features:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">AI-powered email generation</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Excel data import</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Automated sending</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">User-friendly configuration</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Technologies */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 border border-gray-200">
                        Next.js
                      </span>
                      <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 border border-gray-200">
                        TypeScript
                      </span>
                      <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 border border-gray-200">
                        Groq AI
                      </span>
                      <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 border border-gray-200">
                        Tailwind CSS
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      asChild
                      size="lg"
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white"
                    >
                      <Link href="/email-agent" className="flex items-center justify-center gap-2">
                        <Code className="h-5 w-5" />
                        Try AI Email Agent
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Section */}
          <section className="text-center space-y-8 mt-32 mb-20">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Let's Build Something Amazing
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Ready to turn your ideas into reality? Let's collaborate and create innovative solutions together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-6 text-lg font-semibold rounded-full"
                asChild
              >
                <Link href="mailto:contact@koushal.tech" className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Get In Touch
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}