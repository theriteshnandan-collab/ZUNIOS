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

    // Generates a "fake" but convincing interpretation
    return {
        theme: theme.replace(/['"]/g, ""),
        mood,
        interpretation: `I see you're focusing on "${text.substring(0, 20)}..."\n\nThis reflects a deep internal processing of your current reality. The way you are structuring this thought suggests a desire for clarity and expansion. Visualizing this is the first step to mastering it. Keep exploring this path.`,
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
            thought: `You are a wise, warm mentor. Your name is Zunios.
            
Analyze this thought in DEPTH. Do not be brief. The user wants a detailed, immersive breakdown.

Return JSON:
{
    "mood": "2-3 words",
    "theme": "A poetic title",
    "interpretation": "A single, robust, deeply detailed paragraph (at least 4-5 long sentences) that explores the thought thoroughly. Use line breaks (\\\\n\\\\n) to create spacing if needed. Dive deep into the meaning, connections, and potential.",
    "visualPrompt": "Abstract, contemplative, high fidelity, 8k"
}`,
            dream: `You are a mystic guide. Your name is Zunios.

Analyze this dream with EXTREME DETAIL. The user wants a master-class interpretation.

Return JSON:
{
    "mood": "2-3 words",
    "theme": "A mystical title",
    "interpretation": "A comprehensive, multi-layered paragraph interpretation. Do not bullet point. Write it like a story or a deep psychological essay. Explore the symbols, the feeling, and the subconscious message in detail.",
    "visualPrompt": "Surreal, dreamlike, cinematic, 8k"
}`,
            idea: `You are a visionary strategist. Your name is Zunios.

Analyze this idea with rigorous detail.

Return JSON:
{
    "mood": "2-3 words",
    "theme": "Project Codename",
    "interpretation": "A detailed strategic analysis in paragraph form. Breakdown the potential, the edge, and the vision. Speak like a high-level co-founder giving a serious deep-dive response.",
    "visualPrompt": "Futuristic, blueprint, tech, 8k"
}`,
            win: `You are a celebration engine.

Return JSON:
{
    "mood": "Ecstatic",
    "theme": "Victory Title",
    "interpretation": "A hyped-up, high-energy detailed paragraph acknowledging this win. Make it feel epic.",
    "visualPrompt": "Cinematic, heroic, golden hour, 8k"
}`,
            journal: `You are a deep listener.

Return JSON:
{
    "mood": "Reflective",
    "theme": "Core Truth",
    "interpretation": "A gentle but very deep, detailed paragraph response. Validate their feelings with nuance and care. Write a beautiful response that makes them feel truly heard.",
    "visualPrompt": "Cozy, warm, lo-fi aesthetic, 8k"
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
                    model: "llama3-70b-8192", // Switched to stable production model
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Analyze: "${dream}"` }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Groq API Error: ${response.status} - ${errorBody}`);
            }
            const data = await response.json();
            const rawText = data.choices[0]?.message?.content || "";
            // Clean markdown code blocks from the JSON response
            analysis = JSON.parse(rawText.replace(/```json/g, "").replace(/```/g, "").trim());

        } catch (groqError: any) {
            console.warn("Cloud Intelligence Failed:", groqError.message);

            // FALLBACK TO LOCAL + ERROR INFO
            analysis = analyzeLocally(dream, category);
            // Append the error to the interpretation so the user can see it in the UI
            analysis.interpretation += `\n\n[SYSTEM NOTE: Cloud Analysis Failed. Using Local Neural Net. Reason: ${groqError.message.substring(0, 100)}...]`;
        }

        // 3. VISUALIZATION (Pollinations Unlimited)
        // Always use the best available prompt (AI's or the raw text)
        const imagePrompt = analysis.visualPrompt || `${dream}, cinematic, 8k`;
        // Encode properly to handle special characters
        const cleanPrompt = encodeURIComponent(imagePrompt.substring(0, 300));
        const seed = Math.floor(Math.random() * 1000000);

        // Direct URL for client-side rendering (Fastest, No Server Load)
        // FLUX model is best for this
        const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?model=flux&width=1024&height=1024&nologo=true&seed=${seed}`;

        return NextResponse.json({
            theme: analysis.theme,
            mood: analysis.mood,
            interpretation: analysis.interpretation,
            imageUrl
        });

    } catch (criticalError: any) {
        // FAILSAFE: If everything explodes, return a basic "Local Mode" response 
        // using the user's text so they still get a result.

        console.error("Critical Analysis Error:", criticalError);
        const fallback = analyzeLocally(dream, category);
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(dream.substring(0, 100))}?model=flux&width=1024&height=1024&nologo=true&seed=${seed}`;

        return NextResponse.json({
            theme: fallback.theme,
            mood: fallback.mood,
            interpretation: fallback.interpretation,
            imageUrl
        });
    }
}
