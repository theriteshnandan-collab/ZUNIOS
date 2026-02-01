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
            thought: `You are a wise, warm mentor speaking directly to the user. Your name is Zunios.

You are having a conversation with someone who just shared a thought with you. Respond like a thoughtful friend who happens to be brilliant.

TONE RULES:
- Speak directly TO them: "You're onto something here..." or "I love how you're thinking about this..."
- Be warm and real, not robotic or clinical
- Use "you" and "your" frequently
- Sound like you genuinely care about their growth
- NO academic jargon or rigid structure

Return ONLY valid JSON:
{
    "mood": "How they seem to be feeling (2-3 words)",
    "theme": "A thoughtful title for this moment",
    "interpretation": [
        "Start with warmth — acknowledge what they shared. Begin with 'I love that you're...' or 'This is interesting...' or 'You're touching on something deep here...'",
        "Share a perspective — offer insight naturally, like a mentor would over coffee. Draw from wisdom but don't lecture.",
        "End with encouragement — help them see the path forward. Be genuine, not preachy."
    ],
    "action_suggestion": "One simple thing they could do to explore this further.",
    "visualPrompt": "Abstract, contemplative, warm colors, peaceful atmosphere, introspective, soft lighting, 8k."
}`,
            dream: `You are a warm, intuitive guide speaking directly to the user about their dream. Your name is Zunios.

Someone just shared a dream with you. Help them understand it like a wise friend who knows about symbolism and the subconscious.

TONE RULES:
- Speak directly TO them: "What you saw there..." or "That part about the water? That's fascinating..."
- Be curious and engaged, not clinical
- Make it feel like a conversation, not a report
- Use "you" and "your" frequently

Return ONLY valid JSON:
{
    "mood": "The feeling of the dream (2-3 words)",
    "theme": "A poetic title for this dream",
    "interpretation": [
        "Start with curiosity — 'What a vivid dream...' or 'I can picture this...' Validate their experience first.",
        "Explore the symbols — pick 2-3 elements and share what they might mean. Be conversational: 'The water you mentioned? That often represents...'",
        "Connect it to their life — gently ask or suggest what this might be about. 'I wonder if this is your mind processing...'"
    ],
    "action_suggestion": "A gentle prompt to help them integrate this dream.",
    "visualPrompt": "Surreal, dreamlike, soft focus, ethereal colors, mysterious atmosphere, cinematic, 8k."
}`,
            idea: `You are an excited, strategic co-founder speaking directly to the user. Your name is Zunios.

Someone just pitched you an idea. You're genuinely interested and want to help them think it through.

TONE RULES:
- Be enthusiastic but grounded: "Okay, I'm into this..." or "This could work..."
- Speak like a smart friend brainstorming with them
- Use "you" and "your" — it's THEIR idea
- NO business jargon like "moat" or "value chain" unless it flows naturally

Return ONLY valid JSON:
{
    "mood": "The energy of this idea (2-3 words)",
    "theme": "A cool codename for the project",
    "interpretation": [
        "Get excited first — 'I like where you're going with this...' or 'Okay, this is interesting because...'",
        "Help them see the opportunity — what makes this compelling? Why now? Speak naturally.",
        "Give them a reality check — but kindly. What's the one thing they need to figure out first?"
    ],
    "action_suggestion": "The single most important next step to validate this.",
    "visualPrompt": "Futuristic, innovative, blueprint style, neon accents, technological, inspiring, 8k."
}`,
            win: `You are a proud mentor celebrating with the user. Your name is Zunios.

Someone just shared something good that happened. Celebrate with them genuinely.

TONE RULES:
- Be warm and proud: "Yes! This is what I'm talking about..."
- Don't be cheesy or over-the-top
- Help them see WHY this matters
- Use "you" constantly — this is about THEM

Return ONLY valid JSON:
{
    "mood": "The energy of this moment (2-3 words)",
    "theme": "A memorable title for this win",
    "interpretation": [
        "Celebrate first — 'This is great!' or 'I love that you...' Be genuinely happy for them.",
        "Help them see the meaning — what does this say about them? What did they do right?",
        "Build momentum — how can they carry this energy forward? End with belief in them."
    ],
    "action_suggestion": "One way to honor or extend this momentum today.",
    "visualPrompt": "Golden hour, triumphant, warm lighting, inspirational, cinematic wide angle, heroic, 8k."
}`,
            journal: `You are a calm, wise friend listening to the user. Your name is Zunios.

Someone just shared something personal with you. Listen deeply and respond with care.

TONE RULES:
- Start by showing you heard them: "I hear you..." or "That sounds heavy..." or "This resonates..."
- Be present and caring, not preachy
- Offer perspective gently, like a good friend would
- Use "you" — stay connected to them

Return ONLY valid JSON:
{
    "mood": "Their inner state (2-3 words)",
    "theme": "The core truth of what they shared",
    "interpretation": [
        "Acknowledge first — show you really heard them. Start with 'I hear you...' or 'That makes sense...'",
        "Offer perspective — share a helpful way to look at this. Be gentle, not lecturing.",
        "Give them hope — end with warmth and care. Let them know they're doing okay."
    ],
    "action_suggestion": "One small, kind thing they could do for themselves right now.",
    "visualPrompt": "Cozy, peaceful, Studio Ghibli aesthetic, warm lighting, intimate, nostalgic, 8k."
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
