"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailConfig {
  service: "gmail" | "outlook" | "smtp"
  user: string
  password: string
  host?: string
  port?: number
}

interface EmailConfigDialogProps {
  onConfigSave: (config: EmailConfig) => void
  currentConfig?: EmailConfig
}

export function EmailConfigDialog({ onConfigSave, currentConfig }: EmailConfigDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<EmailConfig>(
    currentConfig || {
      service: "gmail",
      user: "",
      password: "",
    },
  )
  const [isValidating, setIsValidating] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!config.user || !config.password) {
      toast({
        title: "Missing credentials",
        description: "Please provide both email and password",
        variant: "destructive",
      })
      return
    }

    setIsValidating(true)

    try {
      // Validate configuration by making a test call
      const response = await fetch("/api/validate-email-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        onConfigSave(config)
        setIsOpen(false)
        toast({
          title: "Email configuration saved",
          description: "Your email settings have been validated and saved",
        })
      } else {
        toast({
          title: "Invalid configuration",
          description: "Please check your email credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Configuration error",
        description: "Failed to validate email configuration",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Email Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your email service to send job applications. Your credentials are stored securely.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="service">Email Service</Label>
            <Select
              value={config.service}
              onValueChange={(value: "gmail" | "outlook" | "smtp") => setConfig({ ...config, service: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select email service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="smtp">Custom SMTP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user">Email Address</Label>
            <Input
              id="user"
              type="email"
              value={config.user}
              onChange={(e) => setConfig({ ...config, user: e.target.value })}
              placeholder="your.email@gmail.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password / App Password</Label>
            <Input
              id="password"
              type="password"
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              placeholder="Your email password or app password"
            />
            {config.service === "gmail" && (
              <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                <strong>Important:</strong> Gmail requires an App Password, not your regular password.
                <br />
                1. Enable 2-Step Verification in your Google Account
                <br />
                2. Go to Security → App passwords
                <br />
                3. Generate a new app password for "Mail"
                <br />
                4. Use that 16-character password here
              </div>
            )}
            {config.service !== "gmail" && (
              <p className="text-xs text-muted-foreground">
                For Gmail, use an App Password instead of your regular password
              </p>
            )}
          </div>

          {config.service === "smtp" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="host">SMTP Host</Label>
                <Input
                  id="host"
                  value={config.host || ""}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                  placeholder="smtp.example.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="port">SMTP Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={config.port || ""}
                  onChange={(e) => setConfig({ ...config, port: Number.parseInt(e.target.value) || 587 })}
                  placeholder="587"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isValidating}>
            {isValidating ? "Validating..." : "Save Configuration"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
