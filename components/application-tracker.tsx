"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  BarChart3,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface ApplicationData {
  id: string
  companyName: string
  hrEmail: string
  recipientName?: string
  status:
    | "pending"
    | "generating"
    | "generated"
    | "sending"
    | "sent"
    | "failed"
    | "responded"
    | "rejected"
    | "interview"
  sentAt?: Date
  emailContent?: string
  subject?: string
  notes?: string
  followUpDate?: Date
  responseReceived?: boolean
  interviewDate?: Date
}

interface ApplicationTrackerProps {
  applications: ApplicationData[]
  onUpdateApplication: (id: string, updates: Partial<ApplicationData>) => void
  onDeleteApplication: (id: string) => void
}

export function ApplicationTracker({
  applications,
  onUpdateApplication,
  onDeleteApplication,
}: ApplicationTrackerProps) {
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<ApplicationData | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const { toast } = useToast()

  const getStatusColor = (status: ApplicationData["status"]) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 border-green-200"
      case "responded":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "interview":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "generating":
      case "sending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "generated":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: ApplicationData["status"]) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-3 w-3" />
      case "responded":
      case "interview":
        return <Mail className="h-3 w-3" />
      case "rejected":
      case "failed":
        return <XCircle className="h-3 w-3" />
      case "generating":
      case "sending":
        return <Loader2 className="h-3 w-3 animate-spin" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === "all") return true
    return app.status === filterStatus
  })

  const handleUpdateStatus = (appId: string, newStatus: ApplicationData["status"]) => {
    onUpdateApplication(appId, { status: newStatus })
    toast({
      title: "Status updated",
      description: `Application status changed to ${newStatus}`,
    })
  }

  const handleSaveEdit = () => {
    if (!editingApp) return

    onUpdateApplication(editingApp.id, {
      notes: editingApp.notes,
      followUpDate: editingApp.followUpDate,
      interviewDate: editingApp.interviewDate,
      status: editingApp.status,
    })

    setIsEditDialogOpen(false)
    setEditingApp(null)
    toast({
      title: "Application updated",
      description: "Your changes have been saved",
    })
  }

  const exportApplications = () => {
    const csvContent = [
      ["Company", "Email", "Status", "Sent Date", "Notes", "Follow-up Date"].join(","),
      ...filteredApplications.map((app) =>
        [
          app.companyName,
          app.hrEmail,
          app.status,
          app.sentAt?.toLocaleDateString() || "",
          app.notes?.replace(/,/g, ";") || "",
          app.followUpDate?.toLocaleDateString() || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `job-applications-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export completed",
      description: "Applications exported to CSV file",
    })
  }

  const getApplicationStats = () => {
    const total = applications.length
    const sent = applications.filter((app) => app.status === "sent").length
    const responded = applications.filter((app) => app.status === "responded").length
    const interviews = applications.filter((app) => app.status === "interview").length
    const rejected = applications.filter((app) => app.status === "rejected").length

    return { total, sent, responded, interviews, rejected }
  }

  const stats = getApplicationStats()

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-xs text-muted-foreground">Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.responded}</p>
                <p className="text-xs text-muted-foreground">Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.interviews}</p>
                <p className="text-xs text-muted-foreground">Interviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Export Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter">Filter by status:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="generated">Generated</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportApplications} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No applications found</h3>
              <p className="text-muted-foreground">
                {filterStatus === "all"
                  ? "Upload your company data and generate emails to get started"
                  : `No applications with status "${filterStatus}"`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-lg">{app.companyName}</h4>
                      <Badge variant="outline" className={getStatusColor(app.status)}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status}</span>
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {app.hrEmail}
                      {app.recipientName && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                          {app.recipientName}
                        </span>
                      )}
                    </p>

                    {app.subject && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Subject:</strong> {app.subject}
                      </p>
                    )}

                    {app.sentAt && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Sent: {app.sentAt.toLocaleDateString()} at {app.sentAt.toLocaleTimeString()}
                      </p>
                    )}

                    {app.notes && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {app.notes}
                      </p>
                    )}

                    {app.followUpDate && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Follow-up: {app.followUpDate.toLocaleDateString()}
                      </p>
                    )}

                    {app.interviewDate && (
                      <p className="text-sm text-purple-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Interview: {app.interviewDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Update Dropdown */}
                    <Select
                      value={app.status}
                      onValueChange={(value: ApplicationData["status"]) => handleUpdateStatus(app.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="generated">Generated</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* View Email Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!app.emailContent}>
                          <Eye className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Email Content - {app.companyName}</DialogTitle>
                          <DialogDescription>Generated email for this application</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Subject:</Label>
                            <p className="text-sm bg-muted p-2 rounded">{app.subject}</p>
                          </div>
                          <div>
                            <Label>Email Body:</Label>
                            <div className="text-sm bg-muted p-4 rounded whitespace-pre-wrap">{app.emailContent}</div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingApp(app)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>

                    {/* Delete Button */}
                    <Button variant="outline" size="sm" onClick={() => onDeleteApplication(app.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Application Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>Update application details and add notes</DialogDescription>
          </DialogHeader>
          {editingApp && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingApp.status}
                  onValueChange={(value: ApplicationData["status"]) => setEditingApp({ ...editingApp, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="generated">Generated</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingApp.notes || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, notes: e.target.value })}
                  placeholder="Add notes about this application..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-followup">Follow-up Date</Label>
                <Input
                  id="edit-followup"
                  type="date"
                  value={editingApp.followUpDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) =>
                    setEditingApp({
                      ...editingApp,
                      followUpDate: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="edit-interview">Interview Date</Label>
                <Input
                  id="edit-interview"
                  type="datetime-local"
                  value={
                    editingApp.interviewDate
                      ? new Date(
                          editingApp.interviewDate.getTime() - editingApp.interviewDate.getTimezoneOffset() * 60000,
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditingApp({
                      ...editingApp,
                      interviewDate: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
