"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Key, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiKeySettingsProps {
  onApiKeyUpdate?: (apiKey: string) => void
}

export function ApiKeySettings({ onApiKeyUpdate }: ApiKeySettingsProps) {
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Groq API key",
        variant: "destructive",
      })
      return
    }

    setIsValidating(true)
    setIsValid(null)

    try {
      const response = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      const result = await response.json()

      if (response.ok && result.valid) {
        setIsValid(true)
        toast({
          title: "API Key Valid",
          description: "Your Groq API key is working correctly",
        })
        onApiKeyUpdate?.(apiKey)
      } else {
        setIsValid(false)
        toast({
          title: "Invalid API Key",
          description: result.error || "The API key is not valid or has insufficient quota",
          variant: "destructive",
        })
      }
    } catch (error) {
      setIsValid(false)
      toast({
        title: "Validation Error",
        description: "Could not validate the API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const saveApiKey = async () => {
    if (!isValid) {
      toast({
        title: "Invalid API Key",
        description: "Please validate your API key first",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/update-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      if (response.ok) {
        toast({
          title: "API Key Saved",
          description: "Your Groq API key has been updated successfully",
        })
        setIsOpen(false)
      } else {
        throw new Error("Failed to save API key")
      }
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Could not save the API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          API Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Groq API Key
          </DialogTitle>
          <DialogDescription>
            Configure your Groq API key for email generation. You can get your API key from{" "}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Groq Console
            </a>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                {isValid === true ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">API Key is valid and working</span>
                  </>
                ) : isValid === false ? (
                  <>
                    <X className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">API Key is invalid or has issues</span>
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">No API key configured</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="api-key">Groq API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="gsk_..."
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setIsValid(null)
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={validateApiKey}
              disabled={isValidating || !apiKey.trim()}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              {isValidating ? "Validating..." : "Validate Key"}
            </Button>
            <Button onClick={saveApiKey} disabled={!isValid} className="flex-1">
              Save API Key
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Your API key is stored securely and only used for email generation</p>
            <p>• Make sure your API key has sufficient quota for generating emails</p>
            <p>• You can update your API key anytime from this dialog</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
