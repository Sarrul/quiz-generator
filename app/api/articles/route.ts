// import prisma from "@/lib/prisma";

// export async function GET() {
//   const articles = await prisma.article.findMany();
//   return Response.json(articles);
// }

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// post
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, title, content, summary } = body;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return new Response("User not found", { status: 404 });

  const article = id
    ? await prisma.article.update({
        where: { id },
        data: { title, content, summary },
      })
    : await prisma.article.create({
        data: {
          title,
          content,
          summary,
          userId: user.id,
        },
      });

  return Response.json(article);
}

// get
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const articles = await prisma.article.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(articles);
}
