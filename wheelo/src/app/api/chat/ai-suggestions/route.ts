import connectDb from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const geminiUrl = process.env.GEMINI_API_URL!

const FALLBACK_SUGGESTIONS: Record<string, string[]> = {
    driver: [
        "I am on my way to your location.",
        "I have reached the pickup spot.",
        "Please confirm your OTP before boarding."
    ],
    user: [
        "I am waiting at the pickup location.",
        "How long will you take to arrive?",
        "Okay, got it! Thank you."
    ]
}

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { lastMessage, role } = await req.json()
        const normalizedRole = role === "driver" ? "driver" : "user"

        if (!geminiUrl) {
            return NextResponse.json(
                JSON.stringify({ suggestions: FALLBACK_SUGGESTIONS[normalizedRole] }),
                { status: 200 }
            )
        }

        const prompt = `You are an AI reply suggestion system for a vehicle booking chat app.

Generate short, smart, human-like quick reply suggestions based on:
- ROLE (${normalizedRole.toUpperCase()})
- RECENT_MESSAGE: ${lastMessage || "Hello"}

Rules:
- Return exactly 3 suggestions
- Keep replies short (3–12 words)
- Match the conversation context and tone
- Driver replies should sound professional and helpful
- User replies should sound natural and realistic
- Avoid repetition
- Return ONLY valid JSON with no markdown formatting or backticks

Output format:
{
  "suggestions": [
    "Reply 1",
    "Reply 2",
    "Reply 3"
  ]
}`

        const response = await axios.post(geminiUrl, {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        }, { timeout: 8000 })

        let rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || ""

        // Strip markdown backticks if returned by Gemini (```json ... ```)
        let cleanedJson = rawText.trim()
        if (cleanedJson.startsWith("```json")) {
            cleanedJson = cleanedJson.replace(/^```json/, "").replace(/```$/, "").trim()
        } else if (cleanedJson.startsWith("```")) {
            cleanedJson = cleanedJson.replace(/^```/, "").replace(/```$/, "").trim()
        }

        // Validate JSON
        try {
            JSON.parse(cleanedJson)
            return NextResponse.json(
                cleanedJson,
                { status: 200 }
            )
        } catch {
            return NextResponse.json(
                JSON.stringify({ suggestions: FALLBACK_SUGGESTIONS[normalizedRole] }),
                { status: 200 }
            )
        }

    } catch (error) {
        return NextResponse.json(
            JSON.stringify({ suggestions: FALLBACK_SUGGESTIONS["user"] }),
            { status: 200 }
        )
    }
}
