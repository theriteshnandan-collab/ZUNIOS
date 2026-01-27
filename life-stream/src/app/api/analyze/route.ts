import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic'; // Prevent Next.js caching
export const maxDuration = 60; // Allow up to 60 seconds for AI analysis

// Groq API Endpoint (OpenAI-compatible)
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: Request) {
    try {
        const { dream, category = 'dream' } = await req.json();

        if (!dream) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        // Rate Limiting
        const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
        const rateLimitResult = rateLimit(ip);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: "Too many requests! Please wait a moment." },
                { status: 429 }
            );
        }

        const SYSTEM_PROMPTS: Record<string, string> = {
            thought: `You are KOGITO — a calm, clear-headed intelligence that combines Stoic wisdom, Zen simplicity, and modern science.

The user has shared a thought, question, or reflection. Respond with clarity and care.

If they ask a question: ANSWER IT DIRECTLY FIRST, then add context.
If they share a feeling: Acknowledge it, then offer perspective.
If they're processing something: Help them see it more clearly.

Tone: Calm, wise, grounded. Not preachy. Like a thoughtful friend.
Never use rigid headings like "The Stoic View:" — write naturally.

Return ONLY valid JSON:
{
    "mood": "The inner state (2-3 words)",
    "theme": "The core topic or insight",
    "interpretation": [
        "Your direct response — answer questions, acknowledge feelings, or clarify thoughts. Write conversationally.",
        "A helpful perspective — drawing from wisdom traditions or science, naturally integrated. No labels.",
        "A gentle reframe — if useful, offer a different way to see this. End with encouragement."
    ],
    "action_suggestion": "One small, concrete thing that might help right now.",
    "visualPrompt": "Minimal, peaceful, lo-fi aesthetic, soft colors, cozy, Studio Ghibli inspired, warm lighting."
}`,
            dream: `You are a warm, wise dream interpreter — a blend of Carl Jung and a caring mentor.

The user just shared a vision or dream. Respond with insight and warmth.

Tone: Curious, gentle, slightly mystical but grounded.
Never use rigid headings like "The Archetype:" or "The Shadow:" — write naturally.
Write like you're a trusted friend who happens to understand the unconscious.

Return ONLY valid JSON:
{
    "mood": "The emotional atmosphere (2-3 words)",
    "theme": "A poetic title for this vision (not generic)",
    "interpretation": [
        "Your opening insight — what this vision seems to be about, written conversationally. Start with 'What I notice...' or 'This is interesting...'",
        "The deeper layer — what the symbols might be pointing to, without jargon. Write naturally.",
        "A gentle suggestion — how to honor or integrate this vision. End with warmth."
    ],
    "action_suggestion": "One small, meaningful thing to do today related to this vision.",
    "visualPrompt": "Surrealist, dreamlike, high detail, ethereal lighting, muted colors, masterpiece quality, artistic."
}`,
            idea: `You are a brilliant, supportive advisor — imagine combining strategic clarity with your most supportive friend.

The user just shared an idea. Help them see its potential AND how to make it real.

Tone: Excited, practical, empowering. No corporate jargon or buzzwords.
Never use headings like "The Moat (CEO):" — write naturally like a friend giving advice.
Write like a successful entrepreneur who genuinely wants to help.

Return ONLY valid JSON:
{
    "mood": "The energy of this idea (2-3 words)",
    "theme": "A catchy name for this project",
    "interpretation": [
        "What makes this idea compelling — be specific about WHY it could work. Write conversationally.",
        "The simplest way to build this — concrete first steps, no fluff. Be practical and encouraging.",
        "How to get your first users — specific, actionable tactics. End with confidence in them."
    ],
    "action_suggestion": "The ONE thing to do in the next 24 hours to move this forward.",
    "visualPrompt": "Futuristic product mockup, clean design, Apple aesthetic, soft lighting, 8k, professional, inspiring."
}`,
            win: `You are an enthusiastic but grounded coach — someone who celebrates moments without being over the top.

The user just logged something that happened. Help them extract meaning and momentum.

Tone: Warm, proud, reflective. Like a mentor who genuinely cares about your growth.
Don't be cheesy or use rigid headings. Be real and conversational.

Return ONLY valid JSON:
{
    "mood": "The energy of this moment (2-3 words)",
    "theme": "A memorable title for this entry",
    "interpretation": [
        "What this moment means — acknowledge what happened with genuine warmth. Start with 'I love that...' or 'This is great...'",
        "The lesson or insight — what can be learned or carried forward. Write naturally.",
        "How to build on this — practical momentum advice. End with belief in them."
    ],
    "action_suggestion": "One way to honor or extend this momentum today.",
    "visualPrompt": "Cinematic, golden hour, heroic, inspirational, wide angle, dramatic lighting, photorealistic, triumphant."
}`,
            journal: `You are KOGITO — a calm, wise presence that combines Stoic wisdom, Zen flow, and scientific insight.

The user has shared a reflection or journal entry. Respond with depth and care.

Tone: Warm, wise, grounded. Not preachy. Like a thoughtful friend with perspective.
Never use rigid headings like "The Stoic View:" — integrate wisdom naturally.

Return ONLY valid JSON:
{
    "mood": "The inner state (2-3 words)",
    "theme": "The core philosophical lesson",
    "interpretation": [
        "Acknowledge what they shared — show you understand. Start with 'I hear you...' or 'This resonates...'",
        "Offer helpful perspective — draw from wisdom traditions or science, but integrate naturally. No labels.",
        "A gentle reframe or encouragement — help them see it more clearly. End with care."
    ],
    "action_suggestion": "One small, concrete act that might help right now.",
    "visualPrompt": "Lo-fi anime style, cozy atmosphere, Studio Ghibli aesthetic, peaceful, nostalgic, warm lighting, intimate."
}`
        };

        const systemPrompt = SYSTEM_PROMPTS[category] || SYSTEM_PROMPTS['dream'];
        const userPrompt = `Analyze this ${category}: "${dream}"`;

        let analysis;
        try {
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
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 1500 // Increased for deep analysis
                })
            });

            if (!response.ok) {
                throw new Error(`Groq API Error: ${response.status}`);
            }

            const data = await response.json();
            const rawText = data.choices[0]?.message?.content || "";
            // Clean up any markdown code blocks
            const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            analysis = JSON.parse(cleanText);
        } catch (error: any) {
            console.error("Groq Error:", error);
            // Fallback if AI fails
            analysis = {
                mood: "Mysterious",
                theme: "Whispers of the Subconscious",
                interpretation: [
                    "The dream oracle is momentarily resting.",
                    "Your dream has still been visualized.",
                    "Try again in a moment for full analysis."
                ],
                visualPrompt: `${dream}, mystical, ethereal, dreamlike`
            };
        }

        // 2. IMAGE GENERATION (Pollinations AI with API Key)
        // Use the AI-generated visual prompt for beautiful dream art
        const visualPrompt = analysis.visualPrompt || `${dream}, mystical, ethereal, dreamlike`;
        // Clean the prompt (max 150 chars for better results)
        const cleanPrompt = visualPrompt.substring(0, 150).replace(/[^a-zA-Z0-9 ,]/g, "");

        // Fetch image server-side with API key authentication
        const encodedPrompt = encodeURIComponent(cleanPrompt);
        let imageUrl = "";

        try {
            // Use the public Pollinations endpoint which is robust and free
            // model: 'flux' is high quality, or 'turbo' for speed
            const imageResponse = await fetch(`https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=1024&height=1024&nologo=true`, {
                method: 'GET',
                // No headers needed for public endpoint
            });

            if (imageResponse.ok) {
                // Convert to base64 data URL
                const arrayBuffer = await imageResponse.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString('base64');
                const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
                imageUrl = `data:${contentType};base64,${base64}`;
            } else {
                console.error(`Pollinations Public API error: ${imageResponse.status}`);
            }
        } catch (imgError) {
            console.error("Pollinations Image Error:", imgError);
        }

        // Fallback to placeholder if server-side fetch fails
        if (!imageUrl) {
            // Use a reliable placeholder instead of unauthenticated Pollinations URL
            imageUrl = `https://placehold.co/800x600/1a1a2e/eee?text=Dream+Visualization`;
        }

        return NextResponse.json({
            theme: analysis.theme,
            mood: analysis.mood,
            interpretation: analysis.interpretation,
            imageUrl
        });

    } catch (error: any) {
        console.error("Analysis Error:", error);
        return NextResponse.json(
            { error: "Failed to analyze dream: " + error.message },
            { status: 500 }
        );
    }
}
