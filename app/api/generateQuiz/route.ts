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

    // 5️⃣ Get raw AI text
    const rawText = response.text;

    if (!rawText) {
      console.error("Gemini returned no text:", response);
      return new Response("AI returned empty response", { status: 500 });
    }

    // 6️⃣ Clean markdown (VERY IMPORTANT)
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 7️⃣ Parse JSON safely
    let quizData;
    try {
      quizData = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Invalid AI JSON:", rawText);
      return new Response("AI returned invalid JSON", { status: 500 });
    }

    // 8️⃣ Return parsed quiz
    return Response.json(quizData);
  } catch (error) {
    console.error("Gemini error:", error);
    return new Response("Failed to generate summary", { status: 500 });
  }
}
