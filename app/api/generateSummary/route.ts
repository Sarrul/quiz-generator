import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    return new Response("Article not found", { status: 404 });
  }

  const summary = "This is a test summary for your article.";

  // ✅ Save summary to Prisma
  const updatedArticle = await prisma.article.update({
    where: { id },
    data: { summary },
  });
  return Response.json({ success: true });
}
