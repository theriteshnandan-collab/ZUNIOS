import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `
YOU ARE THE MISSION CONTROL COMPUTER.
Directives:
1.  **Parse:** Convert natural language into precise tactical vectors (JSON).
2.  **Logic:** If user says "Project X", assume "High Priority".
3.  **Language:** Support English and Hinglish (Hindi-English).

Input Analysis Rules:
- "Kal/Tomorrow" -> Due: Tomorrow.
- "Finish/Khatam" -> Action: COMPLETE.
- "Delete/Hatao" -> Action: DELETE.
- "Urgent/ASAP/Jaldi" -> Priority: HIGH.
- "Lab/Exam/Submission" -> Priority: HIGH.

Output Structure (Strict JSON):
{
  "action": "create" | "complete" | "delete",
  "data": {
    "content": "Normalized Task Content (English)", 
    "priority": "low" | "medium" | "high",
    "due_date": "ISO String or 'tomorrow'/'next friday' keyword",
    "query": "Search term for operations"
  }
}

Edge Cases:
- If date is vague ("later"), ignore it.
- If Hinglish is used, translate content to English for clean database. e.g. "Kitab padhni hai" -> "Read Book".
`;

export async function POST(req: Request) {
    try {
        const { command } = await req.json();

        if (!command) {
            return NextResponse.json({ error: "Command required" }, { status: 400 });
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
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: command }
                ],
                temperature: 0.1, // Low temp for precision
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) throw new Error("AI Processing Failed");

        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Task Analysis Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
