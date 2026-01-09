import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// POST - Create or update article
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { id, title, content, summary } = body;

  if (!title || !content || !summary) {
    return new Response("Invalid article data", { status: 400 });
  }

  // ✅ Find or create user if they don't exist yet
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    console.log("User not found in DB, creating...");

    // Get user info from Clerk
    const clerkUser = await currentUser();

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress || "",
        name: clerkUser?.fullName || clerkUser?.firstName || "Unknown",
      },
    });

    console.log("User created:", user.id);
  }

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

// GET - Fetch all articles for the user
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // ✅ Find or create user if they don't exist yet
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    console.log("User not found in DB, creating...");

    // Get user info from Clerk
    const clerkUser = await currentUser();

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress || "",
        name: clerkUser?.fullName || clerkUser?.firstName || "Unknown",
      },
    });

    console.log("User created:", user.id);
  }

  const articles = await prisma.article.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(articles);
}
