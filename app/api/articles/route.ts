import prisma from "@/lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany();
  return Response.json(articles);
}
