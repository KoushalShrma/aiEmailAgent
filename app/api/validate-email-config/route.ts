export const runtime = "nodejs"

import { EmailService, type EmailConfig } from "@/lib/email-service"

export async function POST(req: Request) {
  try {
    const config: EmailConfig = await req.json()

    if (!config.user || !config.password) {
      return Response.json({ error: "Missing email credentials" }, { status: 400 })
    }

    console.log("[v0] Validating email config for:", config.user)

    const emailService = new EmailService(config)
    const isValid = await emailService.validateConfig()

    if (isValid) {
      console.log("[v0] Email configuration validated successfully")
      return Response.json({
        valid: true,
        message: "Email configuration is valid",
      })
    } else {
      console.log("[v0] Email configuration validation failed")
      const errorMessage =
        config.service === "gmail"
          ? "Gmail authentication failed. Make sure you're using an App Password, not your regular password."
          : "Invalid email configuration. Please check your credentials."

      return Response.json({ error: errorMessage }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error validating email config:", error)

    const errorMessage =
      error instanceof Error && error.message.includes("auth")
        ? "Authentication failed. For Gmail, make sure you're using an App Password."
        : "Failed to validate configuration"

    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
