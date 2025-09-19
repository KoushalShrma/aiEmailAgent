"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Mail,
  CheckCircle,
  XCircle,
  Users,
  Target,
  Activity,
} from "lucide-react"
import type { ApplicationData } from "./application-tracker"

interface AnalyticsDashboardProps {
  applications: ApplicationData[]
}

export function AnalyticsDashboard({ applications }: AnalyticsDashboardProps) {
  const getAnalytics = () => {
    const total = applications.length
    const sent = applications.filter((app) => app.status === "sent").length
    const responded = applications.filter((app) => app.status === "responded").length
    const interviews = applications.filter((app) => app.status === "interview").length
    const rejected = applications.filter((app) => app.status === "rejected").length
    const pending = applications.filter((app) => ["pending", "generating", "generated"].includes(app.status)).length

    const responseRate = sent > 0 ? (responded / sent) * 100 : 0
    const interviewRate = responded > 0 ? (interviews / responded) * 100 : 0
    const successRate = total > 0 ? ((responded + interviews) / total) * 100 : 0

    // Recent activity (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const recentApplications = applications.filter((app) => app.sentAt && app.sentAt >= weekAgo).length

    // Applications by day of week
    const dayStats = applications.reduce(
      (acc, app) => {
        if (app.sentAt) {
          const day = app.sentAt.toLocaleDateString("en-US", { weekday: "short" })
          acc[day] = (acc[day] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total,
      sent,
      responded,
      interviews,
      rejected,
      pending,
      responseRate,
      interviewRate,
      successRate,
      recentApplications,
      dayStats,
    }
  }

  const analytics = getAnalytics()

  const getUpcomingFollowUps = () => {
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    return applications
      .filter((app) => app.followUpDate && app.followUpDate >= today && app.followUpDate <= nextWeek)
      .sort((a, b) => (a.followUpDate?.getTime() || 0) - (b.followUpDate?.getTime() || 0))
  }

  const getUpcomingInterviews = () => {
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    return applications
      .filter((app) => app.interviewDate && app.interviewDate >= today && app.interviewDate <= nextWeek)
      .sort((a, b) => (a.interviewDate?.getTime() || 0) - (b.interviewDate?.getTime() || 0))
  }

  const upcomingFollowUps = getUpcomingFollowUps()
  const upcomingInterviews = getUpcomingInterviews()

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold">{analytics.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-3xl font-bold">{analytics.responseRate.toFixed(1)}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interview Rate</p>
                <p className="text-3xl font-bold">{analytics.interviewRate.toFixed(1)}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold">{analytics.recentApplications}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Application Progress
            </CardTitle>
            <CardDescription>Track your job search progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Applications Sent</span>
                <span>
                  {analytics.sent}/{analytics.total}
                </span>
              </div>
              <Progress value={(analytics.sent / Math.max(analytics.total, 1)) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Responses Received</span>
                <span>
                  {analytics.responded}/{analytics.sent}
                </span>
              </div>
              <Progress value={analytics.responseRate} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Interviews Scheduled</span>
                <span>
                  {analytics.interviews}/{analytics.responded}
                </span>
              </div>
              <Progress value={analytics.interviewRate} className="h-2" />
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{analytics.responded + analytics.interviews}</p>
                <p className="text-sm text-muted-foreground">Positive Outcomes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{analytics.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Follow-ups and interviews this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingFollowUps.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Follow-ups
                </h4>
                <div className="space-y-2">
                  {upcomingFollowUps.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between text-sm">
                      <span>{app.companyName}</span>
                      <Badge variant="outline" className="text-xs">
                        {app.followUpDate?.toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {upcomingInterviews.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Interviews
                </h4>
                <div className="space-y-2">
                  {upcomingInterviews.slice(0, 3).map((app) => (
                    <div key={app.id} className="flex items-center justify-between text-sm">
                      <span>{app.companyName}</span>
                      <Badge variant="outline" className="text-xs bg-purple-50">
                        {app.interviewDate?.toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {upcomingFollowUps.length === 0 && upcomingInterviews.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming tasks this week</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Application Status Breakdown
          </CardTitle>
          <CardDescription>Current status of all your applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold">{analytics.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>

            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{analytics.sent}</p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>

            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold">{analytics.responded}</p>
              <p className="text-sm text-muted-foreground">Responded</p>
            </div>

            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">{analytics.interviews}</p>
              <p className="text-sm text-muted-foreground">Interviews</p>
            </div>

            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold">{analytics.rejected}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>

            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold">{analytics.successRate.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
