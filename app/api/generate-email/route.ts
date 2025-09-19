import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

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

async function getStoredApiKey(): Promise<string | null> {
  try {
    // Since this is an internal API call within the same application,
    // we don't need to use external URL - just return null to use environment variable
    return null
  } catch (error) {
    console.error('[v0] Error getting stored API key:', error)
    return null
  }
}

function formatEmailWithProperSpacing(emailText: string): string {
  // Clean up the email text
  let formattedEmail = emailText.trim()
  
  // Extract subject line
  let subject = ''
  let body = formattedEmail
  
  if (formattedEmail.startsWith('Subject:')) {
    const lines = formattedEmail.split('\n')
    subject = lines[0] + '\n\n'
    body = lines.slice(1).join(' ').trim()
  }
  
  // Remove all existing line breaks and excessive whitespace
  body = body.replace(/\s+/g, ' ').trim()
  
  // Split into logical sections by identifying key transition phrases
  let sections = []
  
  // Find the greeting
  const greetingMatch = body.match(/(Dear [^,]+,)/i)
  if (greetingMatch) {
    sections.push(greetingMatch[1])
    body = body.replace(greetingMatch[1], '').trim()
  }
  
  // Split the remaining content by sentence-ending periods
  const sentences = body.split(/\.\s+/)
  
  let currentSection = ''
  let sentenceCount = 0
  
  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i].trim()
    
    // Skip empty sentences
    if (!sentence) continue
    
    // Add period back if it doesn't end with punctuation
    if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?') && 
        !sentence.includes('Best regards') && !sentence.includes('Sincerely')) {
      sentence += '.'
    }
    
    // Handle closing signature separately
    if (sentence.includes('Best regards') || sentence.includes('Sincerely')) {
      if (currentSection) {
        sections.push(currentSection.trim())
        currentSection = ''
      }
      
      // Split signature from contact info
      const parts = sentence.split(/(?=Email:|Phone:|LinkedIn:|GitHub:|Website:)/g)
      if (parts.length > 1) {
        sections.push('Best regards,')
        sections.push(parts[0].replace('Best regards', '').replace(',', '').trim())
        
        // Format contact info
        const contacts = parts.slice(1).map(contact => contact.trim()).join('\n')
        sections.push(contacts)
      } else {
        sections.push(sentence)
      }
      continue
    }
    
    // Handle contact information separately
    if (sentence.includes('Email:') || sentence.includes('Phone:') || 
        sentence.includes('LinkedIn:') || sentence.includes('GitHub:') || 
        sentence.includes('Website:')) {
      
      if (currentSection) {
        sections.push(currentSection.trim())
        currentSection = ''
      }
      
      // Split contact info properly
      const contactParts = sentence.split(/(?=Email:|Phone:|LinkedIn:|GitHub:|Website:)/g)
      const formattedContacts = contactParts
        .filter(part => part.trim())
        .map(part => part.trim().replace(/\.$/, ''))
        .join('\n')
      
      sections.push(formattedContacts)
      continue
    }
    
    // Regular content - group into paragraphs (max 2 sentences each)
    if (currentSection === '') {
      currentSection = sentence
      sentenceCount = 1
    } else {
      currentSection += ' ' + sentence
      sentenceCount++
    }
    
    // Break into new paragraph every 2 sentences or at logical breaks
    if (sentenceCount >= 2 || 
        sentence.includes('I am excited') || 
        sentence.includes('I have attached') ||
        sentence.includes('Please feel free') ||
        i === sentences.length - 1) {
      
      sections.push(currentSection.trim())
      currentSection = ''
      sentenceCount = 0
    }
  }
  
  // If there's remaining content, add it
  if (currentSection.trim()) {
    sections.push(currentSection.trim())
  }
  
  // Join sections with double line breaks
  const formattedSections = sections
    .filter(section => section.trim())
    .map(section => section.trim())
    .join('\n\n')
  
  // Combine subject and formatted body
  const finalEmail = subject + formattedSections
  
  // Final cleanup
  return finalEmail
    .replace(/\n{3,}/g, '\n\n')  // Remove excessive line breaks
    .trim()
}

async function generateEmailWithRetry(prompt: string, apiKey: string, userProfile?: UserProfile, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[v0] Attempt ${attempt} to generate email`)

      const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt,
        temperature: 0.7,
      })

      console.log(`[v0] Successfully generated email on attempt ${attempt}`)
      // Apply formatting to ensure proper spacing
      const formattedText = formatEmailWithProperSpacing(text)
      return formattedText
    } catch (error: any) {
      console.log(`[v0] Attempt ${attempt} failed:`, error.message)

      // Check if it's a quota error
      if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
        if (attempt === maxRetries) {
          console.log(`[v0] Quota exceeded, using fallback template`)
          return generateFallbackEmail(prompt, userProfile)
        }

        // Wait with exponential backoff
        const waitTime = Math.pow(2, attempt) * 1000
        console.log(`[v0] Waiting ${waitTime}ms before retry`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      } else {
        throw error
      }
    }
  }
}

function generateFallbackEmail(prompt: string, userProfile?: UserProfile): string {
  // Extract company name from prompt
  const companyMatch = prompt.match(/Company Name: ([^\n]+)/)
  // Extract recipient name from prompt if available
  const recipientMatch = prompt.match(/Recipient Name: ([^\n]+)/)
  const companyName = companyMatch ? companyMatch[1] : "your company"
  const contactPerson = recipientMatch ? recipientMatch[1] : "Hiring Manager"
  
  // Use user profile info if available, otherwise fallback values
  const senderName = userProfile?.name || "[Your Name]"
  const position = userProfile?.emailPurpose.position || "Java Developer"
  
  // Build contact info from user profile
  const contactInfo = userProfile?.contactFields
    .filter((field: ContactField) => field.label && field.value)
    .map((field: ContactField) => `${field.label}: ${field.value}`)
    .join('\n') || ""

  const fallbackEmail = `Subject: Contribution to ${companyName} as a ${position}

Dear ${contactPerson},

I'm interested in the ${position} position at ${companyName}.

My experience in ${userProfile?.emailPurpose.reason || "my field"} aligns well with your team's needs.

Resume attached - looking forward to connecting.

Best regards,
${senderName}

${contactInfo}`

  return formatEmailWithProperSpacing(fallbackEmail)
}

export async function POST(req: Request) {
  try {
    const { companyName, hrEmail, resumeText, customPrompt, recipientName, userProfile, useCustomTemplate, customTemplate } = await req.json()

    if (!companyName || !hrEmail || !resumeText) {
      return Response.json({ error: "Missing required fields: companyName, hrEmail, or resumeText" }, { status: 400 })
    }

    if (!userProfile || !userProfile.name || !userProfile.emailPurpose.position) {
      return Response.json({ error: "Missing user profile information. Please configure your profile first." }, { status: 400 })
    }

    // If using custom template, process it directly
    if (useCustomTemplate && customTemplate) {
      const contactInfo = userProfile.contactFields
        .filter((field: ContactField) => field.label && field.value)
        .map((field: ContactField) => `${field.label}: ${field.value}`)
        .join('\n')

      let processedTemplate = customTemplate
        .replace(/\[RECIPIENT_NAME\]/g, recipientName || 'Hiring Manager')
        .replace(/\[COMPANY_NAME\]/g, companyName)
        .replace(/\[YOUR_NAME\]/g, userProfile.name)
        .replace(/\[CONTACT_INFO\]/g, contactInfo)

      // Add subject line if not present
      if (!processedTemplate.includes('Subject:')) {
        processedTemplate = `Subject: Application for ${userProfile.emailPurpose.position} Position at ${companyName}\n\n${processedTemplate}`
      }

      const formattedEmail = formatEmailWithProperSpacing(processedTemplate)
      return Response.json({ emailContent: formattedEmail })
    }

    // Try to get API key from environment first, then from stored settings
    let apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      try {
        // Try to get stored API key
        const storedApiKey = await getStoredApiKey()
        if (storedApiKey) {
          apiKey = storedApiKey
        }
      } catch (error) {
        console.log('[v0] Could not get stored API key:', error)
      }
    }

    if (!apiKey) {
      return Response.json(
        {
          error: "Groq API key not configured. Please set GROQ_API_KEY environment variable or configure it in the API settings.",
        },
        { status: 500 },
      )
    }

    // Build contact information string
    const contactInfo = userProfile.contactFields
      .filter((field: ContactField) => field.label && field.value)
      .map((field: ContactField) => `${field.label}: ${field.value}`)
      .join('\n')

    console.log('[v0] User profile name:', userProfile.name)
    console.log('[v0] Contact info being used:', contactInfo)
    console.log('[v0] User contact fields:', userProfile.contactFields)

    const prompt = `You are writing a professional job application email. Follow these instructions precisely:

SENDER INFORMATION:
- Name: ${userProfile.name}
- Position applying for: ${userProfile.emailPurpose.position}
- Purpose: ${userProfile.emailPurpose.reason || 'Seeking opportunity to contribute to the team'}

TONE & STYLE:
- Be polite, concise, and professional
- Keep it VERY SHORT - maximum 3-4 sentences total for entire email body
- Each paragraph should be only ONE sentence
- Focus on providing value to the company, not just asking for a role
- Avoid over-explaining or adding filler
- Write naturally so it reads like a person wrote it, not AI-generated
- CRITICAL: Maximum 50-60 words for the entire email body

EMAIL STRUCTURE (KEEP VERY SHORT):
- Subject line: Contribution to [Company Name] as a ${userProfile.emailPurpose.position}
- Greeting: Dear [Recipient's Name],
- ONE BLANK LINE after greeting
- Body structure (ULTRA CONCISE - total 3 sentences max):
  * Sentence 1: Brief interest statement (10-12 words max)
  * BLANK LINE
  * Sentence 2: One relevant skill/experience mention (12-15 words max)
  * BLANK LINE  
  * Sentence 3: Resume attachment + looking forward (10-12 words max)
- BLANK LINE before closing
- Closing: "Best regards," (simple and clean)

CRITICAL CONTENT RULES:
- Write content specific to the position: ${userProfile.emailPurpose.position}
- DO NOT mention any technical skills unless the user has specified them in their profile
- DO NOT add Spring Boot, Java, REST APIs, or any programming languages
- DO NOT mention technical experience unless it's relevant to the specified position
- Focus ONLY on skills relevant to: ${userProfile.emailPurpose.position}
- If it's a non-technical role, keep content general and professional
- Only mention experience that the user has actually provided
- Be generic and adaptable to any job type

EXPERIENCE RULES:
- DO NOT invent experience or skills
- Only mention what's relevant to the position type
- For Content Writer: focus on writing, communication, creativity
- For Marketing: focus on campaigns, analytics, creativity  
- For Sales: focus on relationship building, targets, communication
- For any role: keep it general and position-appropriate
- NEVER mention Java, Spring Boot, programming, or technical skills unless position requires it

SIGNATURE:
CRITICAL: You MUST use these EXACT values for the signature - do NOT change them:

Best regards,
${userProfile.name}

${contactInfo}

IMPORTANT SIGNATURE RULES:
- Use EXACTLY the name: "${userProfile.name}"
- Use EXACTLY the contact info: "${contactInfo.replace(/\n/g, ', ')}"
- NEVER substitute with different contact details

CUSTOMIZATION:
- Replace [Company Name] with: ${companyName}
- Replace [Recipient's Name] with: ${recipientName || 'Hiring Manager'}
- Use the position "${userProfile.emailPurpose.position}" in the subject line
- Keep the email relevant to the position and purpose specified

CRITICAL FORMATTING RULES:
- KEEP IT SHORT: Each paragraph should be 1-2 sentences maximum
- Each paragraph must be separated by a blank line
- Never write everything as one continuous paragraph
- NEVER use dummy names or placeholder information
- NEVER use any hardcoded contact info
- Use ONLY the exact contact information provided above: ${contactInfo}
- Use ONLY the exact name provided above: ${userProfile.name}
- The subject must follow: "Contribution to [Company Name] as a [Position]"
- ADD PROPER LINE SPACING: Use blank lines to separate paragraphs for readability
- NEVER write the email as one continuous paragraph - it must have 4 SHORT distinct paragraphs

LENGTH REQUIREMENT:
- Total email body should be 40-50 words maximum
- Each sentence: 8-12 words maximum
- Be extremely concise and direct
- No lengthy explanations or descriptions
- Think "elevator pitch" - brief and impactful

EXAMPLE OF IDEAL SHORT EMAIL:
"I'm interested in the [Position] role at [Company].

My experience in [relevant skill] aligns well with your needs.

Resume attached - looking forward to connecting.

Best regards,
[Name]"

OUTPUT FORMAT:
- Deliver the email as clean plain text with proper line spacing
- Add blank lines between paragraphs for readability
- Put each contact detail on a separate line in the signature
- Do not include Markdown, bold, italics, quotation marks, or extra commentary
- Do not add "before" or "after" markers around words
- Keep the formatting exactly like a real email with proper paragraph breaks
- CRITICAL: Use \\n\\n (double newlines) between paragraphs
- CRITICAL: Use \\n (single newline) at the end of each line

FORMATTING EXAMPLE WITH EXPLICIT LINE BREAKS:
Subject: Contribution to [Company Name] as a ${userProfile.emailPurpose.position}\\n\\nDear [Recipient's Name],\\n\\n[ONE brief sentence about interest]\\n\\n[ONE sentence about relevant skill]\\n\\n[ONE sentence about resume and next steps]\\n\\nBest regards,\\n${userProfile.name}\\n\\n${contactInfo}

MANDATORY: The signature above with "${userProfile.name}" and "${contactInfo}" MUST be used exactly as shown.

Generate the email now using:
- Target company: ${companyName}
- HR Contact: ${hrEmail}
- Recipient Name: ${recipientName || 'Hiring Manager'}

Additional context from resume:
${resumeText}`

    const text = await generateEmailWithRetry(prompt, apiKey, userProfile)

    return Response.json({ emailContent: text })
  } catch (error) {
    console.error("[v0] Error generating email:", error)
    return Response.json({ error: "Failed to generate email. Please try again." }, { status: 500 })
  }
}
