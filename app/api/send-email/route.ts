import { EmailService, type EmailConfig, type EmailData } from "@/lib/email-service.ts"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    console.log("[v0] Send email API called")
    const { to, subject, body, resumeFile, senderConfig } = await req.json()

    console.log("[v0] Email request data:", {
      to,
      subject: subject?.substring(0, 50) + "...",
      hasBody: !!body,
      hasResumeFile: !!resumeFile,
      hasSenderConfig: !!senderConfig,
    })

    if (!to || !subject || !body) {
      console.log("[v0] Missing required fields")
      return Response.json({ error: "Missing required fields: to, subject, or body" }, { status: 400 })
    }

    // Require user-provided email configuration
    if (!senderConfig) {
      console.log("[v0] No email configuration provided by user")
      return Response.json(
        {
          error: "Email configuration required. Please configure your email settings in the application.",
        },
        { status: 400 },
      )
    }

    const emailConfig: EmailConfig = senderConfig

    if (!emailConfig.user || !emailConfig.password) {
      console.log("[v0] Missing email credentials in user configuration")
      return Response.json(
        {
          error: "Email credentials not configured. Please set up your email settings in the application.",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Using email config:", {
      service: emailConfig.service,
      user: emailConfig.user,
      hasPassword: !!emailConfig.password,
    })

    const emailService = new EmailService(emailConfig)

    // Validate configuration
    console.log("[v0] Validating email configuration...")
    const isConfigValid = await emailService.validateConfig()
    if (!isConfigValid) {
      console.log("[v0] Email configuration validation failed")
      return Response.json({ error: "Invalid email configuration. Please check your credentials." }, { status: 400 })
    }

    console.log("[v0] Email configuration validated successfully")

    const emailData: EmailData = {
      to,
      subject,
      body,
      attachments: resumeFile
        ? [
            {
              filename: "resume.pdf",
              content: resumeFile,
              encoding: "base64",
            },
          ]
        : [],
    }

    console.log("[v0] Attempting to send email...")
    const result = await emailService.sendEmail(emailData)

    if (result.success) {
      console.log("[v0] Email sent successfully:", result.messageId)
      return Response.json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
        sentAt: new Date().toISOString(),
      })
    } else {
      console.log("[v0] Email sending failed:", result.error)
      return Response.json({ error: result.error || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Error in send-email API:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
