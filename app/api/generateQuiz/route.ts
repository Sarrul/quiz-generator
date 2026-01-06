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
  const { articleId } = await req.json();

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

  // 4️⃣ Check existing quiz (cache)
  const existingQuiz = await prisma.quiz.findMany({
    where: {
      articleId,
      userId: user.id,
    },
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

  // 5️⃣ Load article from DB ⭐⭐⭐
  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
      userId: user.id,
    },
  });

  if (!article) {
    return new Response("Article not found", { status: 404 });
  }

  // 6️⃣ Build Gemini prompt
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
${article.content}
`;

  try {
    // 7️⃣ Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text;
    if (!rawText) {
      return new Response("AI returned empty response", { status: 500 });
    }

    // 8️⃣ Parse response safely
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const quizData = JSON.parse(cleanedText);

    // 9️⃣ Save quiz
    await prisma.quiz.createMany({
      data: quizData.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        answer: String(q.correctAnswerIndex),
        articleId,
        userId: user.id,
      })),
    });

    // 🔟 Return quiz
    return Response.json(quizData);
  } catch (error) {
    console.error("Generate quiz error:", error);
    return new Response("Failed to generate quiz", { status: 500 });
  }
}
