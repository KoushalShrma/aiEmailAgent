import nodemailer from "nodemailer"

export interface EmailConfig {
  service: "gmail" | "outlook" | "smtp"
  user: string
  password: string
  host?: string
  port?: number
  secure?: boolean
}

export interface EmailData {
  to: string
  subject: string
  body: string
  attachments?: Array<{
    filename: string
    content: string
    encoding: string
  }>
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export class EmailService {
  private config: EmailConfig
  private transporter: nodemailer.Transporter | null = null

  constructor(config: EmailConfig) {
    this.config = config
    this.createTransport()
  }

  private createTransport() {
    try {
      console.log("[v0] Creating email transporter with config:", {
        service: this.config.service,
        user: this.config.user,
      })

      let transportConfig: any = {
        auth: {
          user: this.config.user,
          pass: this.config.password,
        },
        debug: true,
        logger: true,
      }

      if (this.config.service === "gmail") {
        // Use secure Gmail SMTP configuration for better reliability
        transportConfig = {
          ...transportConfig,
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // Use SSL
          auth: {
            user: this.config.user,
            pass: this.config.password,
          },
          tls: {
            rejectUnauthorized: false,
          },
        }
      } else if (this.config.service === "outlook") {
        transportConfig.service = "hotmail"
      } else if (this.config.service === "smtp") {
        transportConfig = {
          ...transportConfig,
          host: this.config.host || "smtp.gmail.com",
          port: this.config.port || 587,
          secure: this.config.secure || false,
        }
      }

      this.transporter = nodemailer.createTransport(transportConfig)
      console.log("[v0] Email transporter created successfully")
    } catch (error) {
      console.error("[v0] Error creating email transporter:", error)
      this.transporter = null
    }
  }

  async validateConfig(): Promise<boolean> {
    if (!this.transporter) {
      console.log("[v0] No transporter available for validation")
      return false
    }

    try {
      console.log("[v0] Validating email configuration...")

      // Basic validation without DNS lookup
      if (!this.config.user || !this.config.password) {
        console.log("[v0] Missing email credentials")
        return false
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.config.user)) {
        console.log("[v0] Invalid email format")
        return false
      }

      // For Gmail, check if password looks like an App Password (16 chars, no spaces)
      if (this.config.service === "gmail") {
        const isAppPassword = this.config.password.length === 16 && !/\s/.test(this.config.password)
        if (!isAppPassword) {
          console.log("[v0] Gmail password should be a 16-character App Password")
          return false
        }
      }

      console.log("[v0] Email configuration validation passed (format check)")
      return true
    } catch (error) {
      console.error("[v0] Email configuration validation failed:")
      console.error("[v0] Error details:", error)
      return false
    }
  }

  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    if (!this.transporter) {
      console.error("[v0] No email transporter available")
      return {
        success: false,
        error: "Email transporter not initialized",
      }
    }

    try {
      console.log("[v0] Sending email to:", emailData.to)
      console.log("[v0] Email subject:", emailData.subject)
      console.log("[v0] From address:", this.config.user)

      // Convert plain text with line breaks to HTML format
      const htmlBody = emailData.body
        .replace(/\n\n/g, '</p><p>')  // Double line breaks become paragraph breaks
        .replace(/\n/g, '<br>')       // Single line breaks become <br> tags
        
      // Wrap in paragraph tags
      const formattedHtmlBody = `<p>${htmlBody}</p>`
        .replace('<p></p>', '')      // Remove empty paragraphs
        .replace(/^<p><\/p>/, '')    // Remove leading empty paragraph

      const mailOptions = {
        from: this.config.user,
        to: emailData.to,
        subject: emailData.subject,
        html: formattedHtmlBody,
        attachments: emailData.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content,
          encoding: att.encoding as any,
        })),
      }

      console.log("[v0] Mail options prepared:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasAttachments: !!mailOptions.attachments?.length,
      })

      const result = await this.transporter.sendMail(mailOptions)

      console.log("[v0] Email sent successfully!")
      console.log("[v0] Message ID:", result.messageId)
      console.log("[v0] Response:", result.response)
      console.log("[v0] Envelope:", result.envelope)

      return {
        success: true,
        messageId: result.messageId,
      }
    } catch (error) {
      console.error("[v0] Error sending email:")
      console.error("[v0] Error details:", error)

      let errorMessage = "Unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
        if (error.message.includes("Invalid login")) {
          errorMessage = "Gmail authentication failed. Please use an App Password instead of your regular password."
        } else if (error.message.includes("authentication failed")) {
          errorMessage = "Email authentication failed. For Gmail, please use an App Password."
        }
      }

      return {
        success: false,
        error: errorMessage,
      }
    }
  }
}
