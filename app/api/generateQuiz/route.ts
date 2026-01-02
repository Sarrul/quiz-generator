import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  // 1️⃣ Auth check
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2️⃣ Parse request
  const { title, content } = await req.json();

  if (!content) {
    return Response.json({ error: "Content is required" }, { status: 400 });
  }

  // 3️⃣ Build prompt
  const prompt = `
Create a quiz based on the article below.

Rules:
- Exactly 5 questions
- Each question has 4 answer options
- Only one correct answer
- Return ONLY valid JSON
- No explanations

JSON format:
{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswerIndex": 0
    }
  ]
}

Article:
${content}

`;

  try {
    // 4️⃣ Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // 5️⃣ Extract text
    const summary = response.text;

    return Response.json({ summary });
  } catch (error) {
    console.error("Gemini error:", error);
    return new Response("Failed to generate summary", { status: 500 });
  }
}
