import { type NextRequest, NextResponse } from "next/server"

// In a real application, you would store this in a secure database
// For this demo, we'll use a simple in-memory storage
let storedApiKey: string | null = null

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Store the API key (in production, this should be in a secure database)
    storedApiKey = apiKey

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating API key:", error)
    return NextResponse.json({ error: "Failed to update API key" }, { status: 500 })
  }
}

export async function GET() {
  // Return the stored API key, or fall back to environment variable
  const apiKey = storedApiKey || process.env.GROQ_API_KEY || null
  
  return NextResponse.json({
    apiKey: apiKey,
    hasApiKey: !!apiKey,
  })
}
