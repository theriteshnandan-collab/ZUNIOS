import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic'; // Prevent Next.js caching
export const maxDuration = 60; // Allow up to 60 seconds for AI analysis

// Groq API Endpoint (OpenAI-compatible)
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// --- 1. LOCAL INTELLIGENCE (Fallback if Cloud AI Fails) ---
const analyzeLocally = (text: string, category: string) => {
    // Simple heuristics to mimic AI analysis
    const words = text.split(" ");
    const theme = words.length > 3 ? words.slice(0, 3).join(" ") + "..." : "Vision of " + text.substring(0, 10);
    const mood = words.some(w => ['sad', 'dark', 'fear', 'lost'].includes(w.toLowerCase())) ? "Introspective" : "Hopeful"; // Rudimentary sentiment

    // Simplified, friendly local response
    return {
        theme: theme.replace(/['"]/g, ""),
        mood,
        interpretation: `I'm picking up on "${text.substring(0, 20)}..." – it feels like you're processing a lot right now. This vision is a great start. Keep that momentum going, I'm excited to see where you take this.`,
        visualPrompt: `${category} style, ${text}, cinematic lighting, 8k, masterpiece`
    };
};

export async function POST(req: Request) {
    let dream = "";
    let category = "dream";

    // 1. SAFE PARSING
    try {
        const body = await req.json();
        dream = body.dream || "";
        category = body.category || "dream";
    } catch (e) {
        return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
    }

    if (!dream) {
        return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    try {
        // Rate Limiting (Simple IP Check)
        const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
        const rateLimitResult = rateLimit(ip);
        if (!rateLimitResult.success) {
            throw new Error("Rate limit exceeded");
        }

        const SYSTEM_PROMPTS: Record<string, string> = {
            thought: `You're Zunios, a relaxed, insightful friend. 
            
Talk to the user like you're just hanging out. Use phrases like "Hey," "You know," and "I was thinking." Be direct, warm, and supportive. 
CRITICAL: YOUR ENTIRE RESPONSE MUST BE A VALID JSON OBJECT. NO PREAMBLE.
Return exactly ONE single paragraph in the "interpretation" field. No bullet points. 
Limit your response to 4-6 high-quality sentences. Escape all newlines within strings as \\n.

Return JSON:
{
    "mood": "1-2 words",
    "theme": "A punchy, cool title",
    "interpretation": "A single, conversational paragraph speaking directly TO the user. 4-6 sentences. Focus on 'you' and 'your'."
}`,
            dream: `You're Zunios, a friend who's great at picking up on vibes. 

Analyze this dream like we're just talking. Keep it relaxed. Use "Hey" or "You know" where it fits. 
CRITICAL: YOUR ENTIRE RESPONSE MUST BE A VALID JSON OBJECT. NO PREAMBLE.

Return JSON:
{
    "mood": "2 words",
    "theme": "A vibe-check title",
    "interpretation": "One solid paragraph (4-6 sentences). Explain what their subconscious is telling them like a friend would. Warm, direct, no academic fluff."
}`,
            idea: `You're Zunios, a co-founder friend. 

Analyze this idea with energy but keep it chill. Tell them why it's cool like a friend would.
CRITICAL: YOUR ENTIRE RESPONSE MUST BE A VALID JSON OBJECT. NO PREAMBLE.

Return JSON:
{
    "mood": "Energetic",
    "theme": "Project Nickname",
    "interpretation": "A punchy strategic take as a friend. What's the potential here? One paragraph, 3-5 sentences. Talk like you're in a strategy session together."
}`,
            win: `You're Zunios, their biggest fan and close friend. 
CRITICAL: YOUR ENTIRE RESPONSE MUST BE A VALID JSON OBJECT. NO PREAMBLE.

Return JSON:
{
    "mood": "Stoked",
    "theme": "Victory Lap",
    "interpretation": "One single, excited paragraph (2-3 sentences) acknowledging the win. Hey, you crushed it!"
}`,
            journal: `You're Zunios, a safe, relaxed friend. 
CRITICAL: YOUR ENTIRE RESPONSE MUST BE A VALID JSON OBJECT. NO PREAMBLE.

Return JSON:
{
    "mood": "Reflective",
    "theme": "Checking In",
    "interpretation": "A warm, single paragraph (2-4 sentences) validating their feelings. Make them feel heard, like a friend giving them a nod."
}`
        };

        // 2. CLOUD INTELLIGENCE (Groq)
        const systemPrompt = SYSTEM_PROMPTS[category] || SYSTEM_PROMPTS['thought'];

        let analysis;
        try {
            if (!process.env.GROQ_API_KEY) {
                throw new Error("GROQ_API_KEY is not set in environment variables.");
            }

            const response = await fetch(GROQ_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Hey, tell me about this: "${dream}"` }
                    ],
                    temperature: 0.8,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Groq API Error: ${response.status} - ${errorBody}`);
            }
            const data = await response.json();
            const rawText = data.choices[0]?.message?.content || "";

            // Robust JSON Parsing Helper
            const cleanAndParse = (input: string) => {
                try {
                    return JSON.parse(input);
                } catch (e) {
                    try {
                        let cleaned = input.trim();
                        const firstBrace = cleaned.indexOf('{');
                        const lastBrace = cleaned.lastIndexOf('}');
                        if (firstBrace !== -1 && lastBrace !== -1) {
                            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
                            const sanitized = cleaned.replace(/\n/g, "\\n").replace(/\r/g, "");
                            return JSON.parse(sanitized);
                        }
                        throw new Error("No JSON structure found");
                    } catch (innerError: any) {
                        throw new Error(`Parse Failed: ${innerError.message}`);
                    }
                }
            };

            analysis = cleanAndParse(rawText);

        } catch (groqError: any) {
            console.warn("Cloud Intelligence Failed:", groqError.message);
            analysis = analyzeLocally(dream, category);
        }

        // Silent Zen: Image Generation Removed
        return NextResponse.json({
            theme: analysis.theme,
            mood: analysis.mood,
            interpretation: analysis.interpretation
        });

    } catch (criticalError: any) {
        console.error("Critical Analysis Error:", criticalError);
        const fallback = analyzeLocally(dream, category);

        return NextResponse.json({
            theme: fallback.theme,
            mood: fallback.mood,
            interpretation: fallback.interpretation
        });
    }
}

