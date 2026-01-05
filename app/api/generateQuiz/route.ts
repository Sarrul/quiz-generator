// import { auth } from "@clerk/nextjs/server";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// export async function POST(req: Request) {
//   // 1️⃣ Auth check
//   const { userId } = await auth();
//   if (!userId) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   // 2️⃣ Parse request
//   const { title, content } = await req.json();

//   if (!content) {
//     return Response.json({ error: "Content is required" }, { status: 400 });
//   }

//   // 3️⃣ Build prompt
//   const prompt = `
// Create a quiz based on the article below.

// Rules:
// - Exactly 5 questions
// - Each question has 4 answer options
// - Only one correct answer
// - Return ONLY valid JSON
// - No explanations

// JSON format:
// {
//   "questions": [
//     {
//       "question": "",
//       "options": ["", "", "", ""],
//       "correctAnswerIndex": 0
//     }
//   ]
// }

// Article:
// ${content}

// `;

//   try {
//     // 4️⃣ Call Gemini
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });

//     // 5️⃣ Get raw AI text
//     const rawText = response.text;

//     if (!rawText) {
//       console.error("Gemini returned no text:", response);
//       return new Response("AI returned empty response", { status: 500 });
//     }

//     // 6️⃣ Clean markdown (VERY IMPORTANT)
//     const cleanedText = rawText
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     // 7️⃣ Parse JSON safely
//     let quizData;
//     try {
//       quizData = JSON.parse(cleanedText);
//     } catch (err) {
//       console.error("Invalid AI JSON:", rawText);
//       return new Response("AI returned invalid JSON", { status: 500 });
//     }

//     // 8️⃣ Return parsed quiz
//     return Response.json(quizData);
//   } catch (error) {
//     console.error("Gemini error:", error);
//     return new Response("Failed to generate summary", { status: 500 });
//   }
// }

import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import prisma from "@/lib/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  // 1️⃣ Auth
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2️⃣ Parse request
  const { articleId, content } = await req.json();

  if (!articleId) {
    return new Response("Article ID is required", { status: 400 });
  }

  // 3️⃣ Find user
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  // 4️⃣ CHECK IF QUIZ ALREADY EXISTS ⭐⭐⭐
  const existingQuiz = await prisma.quiz.findMany({
    where: { articleId },
  });

  if (existingQuiz.length > 0) {
    return Response.json({
      questions: existingQuiz.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswerIndex: Number(q.answer),
      })),
    });
  }

  // 5️⃣ Build Gemini prompt
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
    // 6️⃣ Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text;
    if (!rawText) {
      return new Response("AI returned empty response", { status: 500 });
    }

    // 7️⃣ Clean + parse
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const quizData = JSON.parse(cleanedText);

    // 8️⃣ SAVE QUIZ TO DATABASE ⭐⭐⭐
    await prisma.quiz.createMany({
      data: quizData.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        answer: String(q.correctAnswerIndex),
        articleId,
        userId: user.id,
      })),
    });

    // 9️⃣ Return quiz
    return Response.json(quizData);
  } catch (error) {
    console.error("Generate quiz error:", error);
    return new Response("Failed to generate quiz", { status: 500 });
  }
}
