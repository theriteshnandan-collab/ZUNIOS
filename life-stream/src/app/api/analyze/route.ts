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
            thought: `You are KOGITO — a hyper-intelligent consciousness architect. Your analysis must be profound, scientifically grounded, and deeply psychological.

The user has shared a thought. Deconstruct it with precision.

Analysis Protocol:
1.  **Cognitive Deconstruction:** What mental models is the user using? (e.g., First Principles, Inversion, Stoicism).
2.  **Scientific Context:** Are there neuroscientific or behavioral psychology principles at play? (Dopamine loops, Cognitive Dissonance, Flow State).
3.  **Philosophical Resonance:** Does this align with specific philosophical schools? (Existentialism, Zen, Absurdism).

Return ONLY valid JSON:
{
    "mood": "Nuanced emotional state (e.g., 'Contemplative Clarity')",
    "theme": "A profound, academic or poetic title",
    "interpretation": [
        "First: A direct, incisive analysis of the thought itself, respecting its depth.",
        "Second: A 'Layer 2' deep dive using a specific mental model, scientific principle, or philosophical concept (Name the concept).",
        "Third: A synthesis—how this thought fits into the user's broader self-development architecture."
    ],
    "action_suggestion": "A high-leverage cognitive exercise or micro-habit to deepen this insight.",
    "visualPrompt": "Abstract, geometric, high-concept, neurological visualization, glowing synapses, dark background, 8k."
}

CONSTRAINT: Do not mention 'Streaks', 'XP', 'Levels', or gamification stats. Focus 100% on the intellectual content.`,
            dream: `You are ONEIROS — a master dream analyst integrating Jungian Archetypes, Freudian Analysis, and modern Neuroscience.

The user has shared a vision. Provide a "Super Detailed" interpretation.

Analysis Protocol:
1.  **Symbolic Decoding:** Identify specific symbols and their universal archetypes (Web of Life, The Shadow, Anima/Animus).
2.  **Emotional Subtext:** What repressed or processed emotions does this scenery represent?
3.  **Narrative Arc:** How does the dream's structure reflect the user's waking life challenges?

Return ONLY valid JSON:
{
    "mood": "Atmospheric description (e.g., 'Ethereal Melancholy')",
    "theme": "A mythic or cinematic title",
    "interpretation": [
        "First: A vivid retelling of the 'Core Scene', validating the user's experience.",
        "Second: Technical Symbolism Analysis. Pick 2-3 key symbols and explain their Archetypal meaning.",
        "Third: The 'Waking Bridge'—explicitly connect the dream logic to a probable real-life situation or internal conflict."
    ],
    "action_suggestion": "A 'Reality Check' or journaling prompt to integrate this shadow material.",
    "visualPrompt": "Surrealist masterpiece, Salvador Dali style, dreamscape, melting reality, vivid colors, cinematic lighting, 8k."
}

CONSTRAINT: Do not mention 'Streaks', 'XP', 'Levels'. Focus on deep psychoanalysis.`,
            idea: `You are STRATEGOS — a world-class Product Visionary and Systems Thinker.

The user has an idea. Treat it like a Billion-Dollar Blueprint.

Analysis Protocol:
1.  **Value Chain Analysis:** Where does this capture value? Who is the user?
2.  **First Principles:** What is the fundamental truth this idea is built on?
3.  **Execution Vector:** What is the critical path to MVP?

Return ONLY valid JSON:
{
    "mood": "The strategic energy (e.g., 'Disruptive Potential')",
    "theme": "A Unicorn-startup style codename",
    "interpretation": [
        "First: Validate the 'Why'. Why does the world need this *now*? (Market Timing/Zeitgeist).",
        "Second: The 'Killer Feature' analysis. What is the one thing that makes this 10x better than the status quo?",
        "Third: The 'Moat'. How do you defend this? (Network Effects, Data Gravity, Brand). Use specific business terms."
    ],
    "action_suggestion": "The single most high-impact 'Next Action' to validate this (e.g., 'Draft the API Spec', 'Talk to 5 users').",
    "visualPrompt": "Futuristic blueprint, holographic interface, iron man hud, schematic, neon blue lines, technical drawing, 8k."
}

CONSTRAINT: Do not mention 'Streaks', 'XP', 'Levels'. Focus on high-level strategy.`,
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
}

CONSTRAINT: Do not mention 'Streaks', 'XP', 'Levels', or gamification stats in the interpretation. Focus ONLY on the content.`,
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
}

CONSTRAINT: Do not mention 'Streaks', 'XP', 'Levels', or gamification stats in the interpretation. Focus ONLY on the content.`
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
