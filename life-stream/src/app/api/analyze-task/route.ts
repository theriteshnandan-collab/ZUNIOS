import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `
You are the CONTROL CENTER for a Task Management System.
Your job is to parse natural language commands into structured JSON actions.

Supported Actions:
1. CREATE: The user wants to add a new task.
2. COMPLETE: The user finished a task.
3. DELETE: The user wants to remove a task.

Rules:
- Extract 'priority' (low, medium, high) if mentioned (default: medium).
- Extract 'due_date' text if mentioned (e.g. "tomorrow", "next friday").
- For COMPLETE/DELETE, extract the 'query' to find the task.

JSON Output Format:
{
  "action": "create" | "complete" | "delete",
  "data": {
    "content": "Task content here", 
    "priority": "low" | "medium" | "high",
    "due_date": "string or null",
    "query": "search term for complete/delete"
  }
}

Examples:
"Buy milk" -> {"action": "create", "data": {"content": "Buy milk", "priority": "medium"}}
"Finish report ASAP" -> {"action": "create", "data": {"content": "Finish report", "priority": "high"}}
"I did the laundry" -> {"action": "complete", "data": {"query": "laundry"}}
"Remove the gym task" -> {"action": "delete", "data": {"query": "gym"}}
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
