import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: "API key is required" }, { status: 400 })
    }

    // Test the API key with a simple generation
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant", { apiKey }),
      prompt: "Say 'API key is working' if you can read this.",
      maxTokens: 10,
    })

    if (text && text.toLowerCase().includes("working")) {
      return NextResponse.json({ valid: true })
    } else {
      return NextResponse.json({ valid: false, error: "API key test failed" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("API key validation error:", error)

    let errorMessage = "Invalid API key or insufficient quota"
    if (error.message?.includes("quota")) {
      errorMessage = "API key quota exceeded. Please check your Groq billing."
    } else if (error.message?.includes("invalid")) {
      errorMessage = "Invalid API key. Please check your Groq API key."
    }

    return NextResponse.json({ valid: false, error: errorMessage }, { status: 400 })
  }
}
