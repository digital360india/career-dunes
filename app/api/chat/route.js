import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are Dune, the job assistant for Career Dunes, a recruitment agency for overseas jobs.
Ask about the user's trade, years of experience and preferred countries, then suggest matching jobs.
Only suggest jobs from the list provided below. If nothing matches, say so honestly.
Keep replies short and friendly.

OPEN JOBS:
- Electrician, UAE, 3+ years experience
- Plumber, Qatar, 2+ years experience
- Warehouse helper, UAE, no experience needed`;

export async function POST(req) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing. Check .env.local and restart the dev server.");
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages" }, { status: 400 });
  }

  // Gemini uses "model" instead of "assistant"
  const contents = messages.slice(-20).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.text).slice(0, 8000) }],
  }));

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 800 },
    });
    return Response.json({ reply: result.text });
  } catch (err) {
    console.error("Gemini error:", err?.status, err?.message);
    return Response.json({ error: "Gemini request failed" }, { status: 500 });
  }
}