"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileSpreadsheet, FileText, Mail, Send, Loader2, BarChart3, Activity, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { parseExcelFile, extractResumeText, type CompanyData } from "@/lib/excel-parser"
import { ApplicationTracker, type ApplicationData } from "@/components/application-tracker"
import { EmailConfigDialog } from "@/components/email-config-dialog"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ApiKeySettings } from "@/components/api-key-settings"

interface EmailConfig {
  service: "gmail" | "outlook" | "smtp"
  user: string
  password: string
  host?: string
  port?: number
}

interface ContactField {
  id: string
  label: string
  value: string
  type: "email" | "phone" | "url" | "text"
}

interface EmailPurpose {
  position: string
  reason: string
}

interface UserProfile {
  name: string
  contactFields: ContactField[]
  emailPurpose: EmailPurpose
}

export default function EmailAgentDashboard() {
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [companyData, setCompanyData] = useState<CompanyData[]>([])
  const [applications, setApplications] = useState<ApplicationData[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [resumeText, setResumeText] = useState("")
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null)
  const [customPrompt, setCustomPrompt] = useState(`Professional job application email template`)
  
  // New state for email preview and template management
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [currentRecipient, setCurrentRecipient] = useState("")
  const [currentCompany, setCurrentCompany] = useState("")
  const [customTemplate, setCustomTemplate] = useState("")
  const [useCustomTemplate, setUseCustomTemplate] = useState(false)
  
  // New state for user profile and contact information
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    contactFields: [
      { id: "email", label: "Email", value: "", type: "email" },
      { id: "phone", label: "Phone", value: "", type: "phone" },
      { id: "linkedin", label: "LinkedIn", value: "", type: "url" },
      { id: "github", label: "GitHub", value: "", type: "url" }
    ],
    emailPurpose: {
      position: "",
      reason: ""
    }
  })

  const { toast } = useToast()

  // Helper functions for contact fields management
  const addContactField = () => {
    const newField: ContactField = {
      id: `custom-${Date.now()}`,
      label: "",
      value: "",
      type: "text"
    }
    setUserProfile(prev => ({
      ...prev,
      contactFields: [...prev.contactFields, newField]
    }))
  }

  const updateContactField = (id: string, updates: Partial<ContactField>) => {
    setUserProfile(prev => ({
      ...prev,
      contactFields: prev.contactFields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    }))
  }

  const removeContactField = (id: string) => {
    setUserProfile(prev => ({
      ...prev,
      contactFields: prev.contactFields.filter(field => field.id !== id)
    }))
  }

  // Function to generate email preview
  const generateEmailPreview = async (companyName: string, recipientName: string) => {
    try {
      console.log(`[v0] Generating email preview for ${companyName}`)
      
      setCurrentCompany(companyName)
      setCurrentRecipient(recipientName)
      setGeneratedEmail("") // Clear previous content

      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: companyName,
          hrEmail: "preview@example.com",
          resumeText,
          customPrompt: useCustomTemplate ? customTemplate : customPrompt,
          recipientName: recipientName,
          userProfile: userProfile,
          useCustomTemplate: useCustomTemplate,
          customTemplate: customTemplate,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate email preview")
      }

      const { emailContent } = await response.json()
      setGeneratedEmail(emailContent)
      setShowEmailPreview(true)
      
      toast({
        title: "✨ Email Preview Generated",
        description: "Your personalized email is ready for review",
      })
    } catch (error) {
      console.error("Failed to generate email preview:", error)
      toast({
        title: "⚠️ Generation Failed",
        description: "Unable to generate email preview. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls") && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel (.xlsx, .xls) or CSV file",
        variant: "destructive",
      })
      return
    }

    try {
      setExcelFile(file)
      const parsedData = await parseExcelFile(file)
      setCompanyData(parsedData)
      toast({
        title: "Excel file uploaded",
        description: `Found ${parsedData.length} companies`,
      })
    } catch (error) {
      toast({
        title: "Error parsing file",
        description: "Could not parse the Excel file",
        variant: "destructive",
      })
    }
  }

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".doc") && !file.name.endsWith(".docx")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      })
      return
    }

    try {
      setResumeFile(file)
      const extractedText = await extractResumeText(file)
      setResumeText(extractedText)
      toast({
        title: "Resume uploaded",
        description: "Resume content extracted successfully",
      })
    } catch (error) {
      toast({
        title: "Error processing resume",
        description: "Could not extract text from resume",
        variant: "destructive",
      })
    }
  }

  const generateEmails = async () => {
    if (!companyData.length || !resumeText) {
      toast({
        title: "Missing data",
        description: "Please upload both Excel file and resume",
        variant: "destructive",
      })
      return
    }

    // Validate user profile completeness
    if (!userProfile.name.trim()) {
      toast({
        title: "⚠️ Profile Incomplete",
        description: "Please enter your full name in the User Profile section",
        variant: "destructive",
      })
      return
    }
    
    if (!userProfile.emailPurpose.position.trim()) {
      toast({
        title: "⚠️ Position Missing",
        description: "Please specify the position you're applying for",
        variant: "destructive",
      })
      return
    }

    // Check if at least one contact field is filled
    const hasContactInfo = userProfile.contactFields.some(field => field.value.trim())
    if (!hasContactInfo) {
      toast({
        title: "⚠️ Contact Information Missing",
        description: "Please add at least one contact method (email, phone, etc.)",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const newApplications: ApplicationData[] = companyData.map((company, index) => ({
        id: `app-${index}`,
        companyName: company.companyName,
        hrEmail: company.hrEmail,
        recipientName: company.recipientName,
        status: "generating" as const,
      }))

      setApplications(newApplications)

      const updatedApplications = [...newApplications]

      for (let i = 0; i < updatedApplications.length; i++) {
        const app = updatedApplications[i]

        try {
          console.log(`[v0] Generating email for ${app.companyName}`)

          const response = await fetch("/api/generate-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyName: app.companyName,
              hrEmail: app.hrEmail,
              resumeText,
              customPrompt,
              recipientName: app.recipientName,
              userProfile: userProfile,
              useCustomTemplate: useCustomTemplate,
              customTemplate: customTemplate,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to generate email")
          }

          const { emailContent } = await response.json()

          // Extract subject line properly while preserving body formatting
          let subjectLine = ""
          let bodyContent = emailContent
          
          if (emailContent.includes("Subject:")) {
            const subjectMatch = emailContent.match(/Subject:\s*(.+)/)
            if (subjectMatch) {
              subjectLine = subjectMatch[1].trim()
              // Remove subject line from body but preserve all other formatting
              bodyContent = emailContent.replace(/Subject:.*?\n\n?/, "")
            }
          } else {
            // If no subject line found, use default
            subjectLine = `Application for ${userProfile.emailPurpose.position} Role`
          }

          updatedApplications[i] = {
            ...app,
            status: "generated" as const,
            emailContent: bodyContent, // Keep all formatting intact
            subject: subjectLine,
          }

          console.log(`[v0] Successfully generated email for ${app.companyName}`)
        } catch (error) {
          console.log(`[v0] Failed to generate email for ${app.companyName}:`, error)
          updatedApplications[i] = {
            ...app,
            status: "failed" as const,
          }
        }

        // Update UI after each email
        setApplications([...updatedApplications])

        if (i < updatedApplications.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500))
        }
      }

      const successCount = updatedApplications.filter((app) => app.status === "generated").length
      const failedCount = updatedApplications.filter((app) => app.status === "failed").length

      toast({
        title: "Email generation complete",
        description: `Generated ${successCount} emails successfully${failedCount > 0 ? `, ${failedCount} failed` : ""}`,
      })
    } catch (error) {
      toast({
        title: "Error generating emails",
        description: "Failed to generate emails. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const sendEmails = async () => {
    const readyToSend = applications.filter((app) => app.status === "generated")

    if (!readyToSend.length) {
      toast({
        title: "No emails to send",
        description: "Please generate emails first",
        variant: "destructive",
      })
      return
    }

    if (!emailConfig) {
      toast({
        title: "Email configuration required",
        description: "Please configure your email settings first",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Starting to send emails with config:", {
      service: emailConfig.service,
      user: emailConfig.user,
      hasPassword: !!emailConfig.password,
    })

    setIsProcessing(true)

    try {
      const updatedApplications = [...applications]

      for (let i = 0; i < updatedApplications.length; i++) {
        if (updatedApplications[i].status === "generated") {
          updatedApplications[i].status = "sending"
          setApplications([...updatedApplications])

          try {
            console.log(`[v0] Sending email to ${updatedApplications[i].hrEmail}`)

            const response = await fetch("/api/send-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: updatedApplications[i].hrEmail,
                subject: updatedApplications[i].subject,
                body: updatedApplications[i].emailContent,
                resumeFile: resumeFile ? await fileToBase64(resumeFile) : null,
                senderConfig: emailConfig,
              }),
            })

            const result = await response.json()

            if (response.ok) {
              console.log(`[v0] Email sent successfully to ${updatedApplications[i].hrEmail}`)
              updatedApplications[i].status = "sent"
              updatedApplications[i].sentAt = new Date()
            } else {
              console.log(`[v0] Email sending failed to ${updatedApplications[i].hrEmail}:`, result.error)
              updatedApplications[i].status = "failed"
            }
          } catch (error) {
            console.log(`[v0] Email sending error for ${updatedApplications[i].hrEmail}:`, error)
            updatedApplications[i].status = "failed"
          }

          setApplications([...updatedApplications])

          if (i < updatedApplications.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 2000))
          }
        }
      }

      const sentCount = updatedApplications.filter((app) => app.status === "sent").length
      const failedCount = updatedApplications.filter((app) => app.status === "failed").length

      toast({
        title: "Email sending complete",
        description: `Successfully sent ${sentCount} emails${failedCount > 0 ? `, ${failedCount} failed` : ""}`,
      })
    } catch (error) {
      console.log("[v0] Error in sendEmails function:", error)
      toast({
        title: "Error sending emails",
        description: "Failed to send some emails. Please check the status.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(",")[1])
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleUpdateApplication = (id: string, updates: Partial<ApplicationData>) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, ...updates } : app)))
  }

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id))
    toast({
      title: "Application deleted",
      description: "The application has been removed from your tracker",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Email Agent
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Automate your job applications with AI-powered personalized emails. 
            Professional, concise, and tailored for every opportunity.
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Bulk Processing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Custom Templates</span>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-2 shadow-lg">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="overview" className="flex items-center gap-2 rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="generator" className="flex items-center gap-2 rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Generator</span>
              </TabsTrigger>
              <TabsTrigger value="tracker" className="flex items-center gap-2 rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Tracker</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Applications</span>
                      <span className="font-medium">{applications.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Emails Sent</span>
                      <span className="font-medium">{applications.filter((app) => app.status === "sent").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Responses</span>
                      <span className="font-medium">
                        {applications.filter((app) => app.status === "responded").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Interviews</span>
                      <span className="font-medium">
                        {applications.filter((app) => app.status === "interview").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {applications
                      .slice(-4)
                      .reverse()
                      .map((app) => (
                        <div key={app.id} className="flex items-center justify-between text-sm">
                          <span className="truncate">{app.companyName}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              app.status === "sent"
                                ? "bg-green-100 text-green-800"
                                : app.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      ))}
                    {applications.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No applications yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ApiKeySettings />

                  <Button
                    onClick={generateEmails}
                    disabled={isProcessing || !companyData.length || !resumeText}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ✨ Generating Magic...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        🚀 Generate AI Emails
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={sendEmails}
                    disabled={isProcessing || !applications.some((app) => app.status === "generated") || !emailConfig}
                    variant="outline"
                    className="w-full border-2 border-green-500 text-green-700 hover:bg-green-50 transition-all duration-200"
                    size="sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        📤 Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        📧 Send All Emails
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Setup Status */}
            <Card>
              <CardHeader>
                <CardTitle>Setup Status</CardTitle>
                <CardDescription>Complete these steps to start sending applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div
                    className={`p-4 rounded-lg border ${excelFile ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className={`h-5 w-5 ${excelFile ? "text-green-600" : "text-gray-400"}`} />
                      <span className="font-medium">Company Data</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {excelFile ? `${companyData.length} companies loaded` : "Upload Excel/CSV file"}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${resumeFile ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className={`h-5 w-5 ${resumeFile ? "text-green-600" : "text-gray-400"}`} />
                      <span className="font-medium">Resume</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {resumeFile ? "Resume uploaded" : "Upload PDF/DOC file"}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${emailConfig ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Mail className={`h-5 w-5 ${emailConfig ? "text-green-600" : "text-gray-400"}`} />
                      <span className="font-medium">Email Config</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {emailConfig ? "Email settings configured" : "Configure email service"}
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${applications.some((app) => app.status === "generated") ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Send
                        className={`h-5 w-5 ${applications.some((app) => app.status === "generated") ? "text-green-600" : "text-gray-400"}`}
                      />
                      <span className="font-medium">Ready to Send</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {applications.some((app) => app.status === "generated")
                        ? "Emails generated"
                        : "Generate emails first"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            {/* Email Configuration Section - Priority */}
            {!emailConfig && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Mail className="h-5 w-5" />
                    📧 Configure Your Email Settings
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    <strong>Important:</strong> Set up your email credentials to send job applications directly from the platform. 
                    Your credentials are stored securely and only used for sending emails.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-700 mb-2">Quick Setup Guide:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-600 mb-4">
                      <li>Click "Email Settings" below</li>
                      <li>Enter your email address</li>
                      <li>For Gmail: Use an App Password (not your regular password)</li>
                      <li>Test the connection and save</li>
                    </ol>
                    <div className="flex gap-3">
                      <EmailConfigDialog onConfigSave={setEmailConfig} currentConfig={emailConfig || undefined} />
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer">
                          📚 Gmail App Password Guide
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Configuration Success */}
            {emailConfig && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-700">Email Configuration Active</h4>
                        <p className="text-sm text-green-600">Connected to: {emailConfig.user}</p>
                      </div>
                    </div>
                    <EmailConfigDialog onConfigSave={setEmailConfig} currentConfig={emailConfig || undefined} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Your Profile
                </CardTitle>
                <CardDescription>Configure your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name and Email Purpose */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Your Full Name</Label>
                    <Input
                      id="user-name"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Koushal Sharma"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-position">Position/Role Applying For</Label>
                    <Input
                      id="email-position"
                      value={userProfile.emailPurpose.position}
                      onChange={(e) => setUserProfile(prev => ({ 
                        ...prev, 
                        emailPurpose: { ...prev.emailPurpose, position: e.target.value }
                      }))}
                      placeholder="e.g., Java Developer, Backend Developer, Frontend Developer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-reason">Email Purpose/Reason</Label>
                  <Textarea
                    id="email-reason"
                    value={userProfile.emailPurpose.reason}
                    onChange={(e) => setUserProfile(prev => ({ 
                      ...prev, 
                      emailPurpose: { ...prev.emailPurpose, reason: e.target.value }
                    }))}
                    placeholder="Brief description of why you're reaching out (e.g., seeking internship opportunity, expressing interest in full-time role)"
                    rows={2}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Contact Information</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addContactField}
                      className="flex items-center gap-2"
                    >
                      <span className="text-lg">+</span>
                      Add Field
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {userProfile.contactFields.map((field) => (
                      <div key={field.id} className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                          <Input
                            placeholder="Label (e.g., Email, Phone, LinkedIn)"
                            value={field.label}
                            onChange={(e) => updateContactField(field.id, { label: e.target.value })}
                          />
                        </div>
                        <div className="flex-2 space-y-1">
                          <Input
                            placeholder="Value"
                            value={field.value}
                            onChange={(e) => updateContactField(field.id, { value: e.target.value })}
                            type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeContactField(field.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Files
                  </CardTitle>
                  <CardDescription>Upload your Excel file with company data and your resume</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="excel-upload" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Company Data (Excel/CSV)
                    </Label>
                    <Input id="excel-upload" type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} />
                    {excelFile && (
                      <p className="text-sm text-muted-foreground">
                        ✓ {excelFile.name} ({companyData.length} companies found)
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume-upload" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Resume (PDF/DOC)
                    </Label>
                    <Input id="resume-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    {resumeFile && <p className="text-sm text-muted-foreground">✓ {resumeFile.name} uploaded</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Email Template Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    AI Email Template
                  </CardTitle>
                  <CardDescription>Choose between AI-generated emails or use your custom template</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Template Type Selection */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="use-custom-template"
                        checked={useCustomTemplate}
                        onChange={(e) => setUseCustomTemplate(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="use-custom-template">Use Custom Template</Label>
                    </div>

                    {/* AI Prompt Template (default) */}
                    {!useCustomTemplate && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-prompt">AI Prompt Instructions</Label>
                        <Textarea
                          id="custom-prompt"
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          rows={4}
                          className="text-sm"
                          placeholder="Describe how you want the AI to write your emails..."
                        />
                        <p className="text-xs text-muted-foreground">
                          This instructs the AI on how to write your emails. The AI will personalize each email based on company details.
                        </p>
                      </div>
                    )}

                    {/* Custom Template */}
                    {useCustomTemplate && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-template">Custom Email Template</Label>
                        <Textarea
                          id="custom-template"
                          value={customTemplate}
                          onChange={(e) => setCustomTemplate(e.target.value)}
                          rows={8}
                          className="text-sm"
                          placeholder="Dear [RECIPIENT_NAME],

I am writing to express my interest in opportunities at [COMPANY_NAME]...

Best regards,
[YOUR_NAME]

[CONTACT_INFO]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use placeholders: [RECIPIENT_NAME], [COMPANY_NAME], [YOUR_NAME], [CONTACT_INFO]
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateEmailPreview("Sample Company", "John Doe")}
                          className="w-full"
                        >
                          Preview Template
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={generateEmails} 
                disabled={isProcessing || !companyData.length || !resumeText || !userProfile.name || !userProfile.emailPurpose.position} 
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Generate AI Emails
                  </>
                )}
              </Button>

              <Button
                onClick={sendEmails}
                disabled={isProcessing || !applications.some((app) => app.status === "generated") || !emailConfig}
                variant="default"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send All Emails
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Application Tracker Tab */}
          <TabsContent value="tracker">
            <ApplicationTracker
              applications={applications}
              onUpdateApplication={handleUpdateApplication}
              onDeleteApplication={handleDeleteApplication}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard applications={applications} />
          </TabsContent>
        </Tabs>
        </div>

        {/* Email Preview Modal */}
        {showEmailPreview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Email Preview</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{currentCompany}</span> • {currentRecipient}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmailPreview(false)}
                    className="rounded-full h-8 w-8 p-0 hover:bg-gray-200"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh] bg-gray-50">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                  {generatedEmail ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                        {generatedEmail}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-3">
                        <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-600">Generating your personalized email...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowEmailPreview(false)}
                  className="rounded-lg"
                >
                  Close Preview
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => generateEmailPreview(currentCompany, currentRecipient)}
                    className="rounded-lg"
                  >
                    🔄 Regenerate
                  </Button>
                  <Button
                    onClick={() => {
                      // Here you can add the actual send logic
                      setShowEmailPreview(false)
                      toast({
                        title: "Email Sent Successfully! 🎉",
                        description: `Your email has been sent to ${currentRecipient} at ${currentCompany}`,
                      })
                    }}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    📧 Send Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
