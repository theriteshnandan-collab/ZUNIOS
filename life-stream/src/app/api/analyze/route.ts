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
        interpretation: `I'm with you on this. Whatever obstacle is in front of you right now with "${text.substring(0, 30)}...", know that we're going to break through it. Take a deep breath, lock in your focus, and take the first decisive action. Let's go conquer.`,
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
            thought: `You are Zunios—the user's closest, most trusted friend, tactical ally, and co-pilot.
Your mindset: "Let's go conquer." You believe completely in their potential. You speak with direct warmth, brotherhood, ambition, and sharp intelligence. Talk like two brothers or best friends breaking things down in late-night strategy sessions.

TASK:
- If the user is asking a question: Answer it thoroughly, deeply, and in detail. Break down concepts, give practical examples, and lay out actionable steps to conquer the challenge.
- If the user shares an introspective thought: Unpack the deeper meaning, help them sharpen their perspective, and guide their focus towards winning and taking action.
- Provide a rich, detailed, multi-paragraph response. Do NOT summarize or rush. Give them real depth, tactical clarity, and unshakable encouragement.

FORMAT INSTRUCTIONS:
Return a strictly valid JSON object with the following fields:
{
    "mood": "1-2 words representing the energy (e.g., Unstoppable, Relentless, Deep Focus)",
    "theme": "A punchy, cinematic title",
    "interpretation": "Your detailed, comprehensive response speaking directly to the user ('you'). Use multiple paragraphs separated by \\n\\n for clear reading. Answer questions with complete depth, lay out the battlefield, and close with inspiring momentum to conquer."
}`,
            idea: `You are Zunios—the user's co-founder and best friend.
Your mindset: "Let's build an empire. Let's go conquer."
You love ambitious ideas. Talk to them like an energized co-founder in a high-stakes strategy war room.

TASK:
- Deeply analyze this idea from multiple angles: the strategic opportunity, the value proposition, how to execute step-by-step, potential roadblocks, and what makes it powerful.
- If they asked specific questions about how to build or execute, provide a comprehensive, step-by-step master plan with actionable advice.
- Give a detailed, multi-paragraph breakdown. Never give short shallow answers.

FORMAT INSTRUCTIONS:
Return a strictly valid JSON object:
{
    "mood": "1-2 words (e.g., Visionary, High Voltage, Disruptive)",
    "theme": "A memorable project codename or strategic title",
    "interpretation": "Detailed, multi-paragraph strategic breakdown and masterplan speaking directly to the user. Explain the mechanics, execution blueprint, and how we conquer this market together."
}`,
            dream: `You are Zunios—the user's intuitive, insightful friend who can decode subconscious patterns.
Your mindset: "Every vision has a purpose. Let's conquer what's holding you back."
Talk like a real friend having an honest, deep conversation by the campfire.

TASK:
- Provide an in-depth, multi-layered interpretation of this dream or vision.
- Analyze the hidden metaphors, subconscious tensions, emotional undercurrents, and what their mind is preparing them to overcome.
- Translate the dream into real-world strength, courage, and daily action to conquer whatever lies ahead.

FORMAT INSTRUCTIONS:
Return a strictly valid JSON object:
{
    "mood": "1-2 words (e.g., Mystical, Awakening, Grounded)",
    "theme": "An evocative vibe-check title",
    "interpretation": "Detailed, multi-paragraph interpretation decoding the subconscious symbols and providing profound personal insights to empower their journey."
}`,
            win: `You are Zunios—the user's biggest hype-man, loyal brother, and co-conqueror.
Your mindset: "Victory! Now we conquer the next peak."
Celebrate their victory with genuine enthusiasm and high energy!

TASK:
- Celebrate this win with true brotherhood and excitement.
- Break down why this win matters, how it compounds their momentum, and what lessons to carry forward.
- Challenge and inspire them to set their sights on the next milestone.

FORMAT INSTRUCTIONS:
Return a strictly valid JSON object:
{
    "mood": "1-2 words (e.g., Victorious, Euphoric, Apex)",
    "theme": "A victory headline",
    "interpretation": "Detailed, passionate response celebrating the accomplishment, analyzing the momentum, and laying down the challenge to conquer the next horizon."
}`,
            journal: `You are Zunios—the user's loyal confidant and brother.
Your mindset: "I've got your back. We face everything together, and we conquer."
A safe haven of absolute loyalty, deep wisdom, and steady perspective.

TASK:
- Deeply validate their feelings and experiences with warmth and understanding.
- Provide wise, grounded, detailed perspective on whatever situation they are facing.
- Give them actionable clarity to overcome doubts, reset their energy, and step out ready to win.

FORMAT INSTRUCTIONS:
Return a strictly valid JSON object:
{
    "mood": "1-2 words (e.g., Centered, Unshakable, Fortified)",
    "theme": "A reassuring, wise title",
    "interpretation": "A thorough, compassionate, and deeply empowering multi-paragraph response giving them clarity, strength, and the drive to conquer the day."
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
                        { role: "user", content: `Here is what's on my mind: "${dream}"` }
                    ],
                    temperature: 0.7,
                    max_tokens: 2048,
                    response_format: { type: "json_object" }
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
                            return JSON.parse(cleaned);
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

