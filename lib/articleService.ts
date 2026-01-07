// lib/articleService.ts

export type Article = {
  id: string;
  title: string;
  content: string;
  summary: string;
};

export const articleService = {
  async generateSummary(title: string, content: string): Promise<string> {
    const res = await fetch("/api/generateSummary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) throw new Error("Failed to generate summary");

    const data = await res.json();
    return data.summary;
  },

  async saveArticle(article: {
    id?: string | null;
    title: string;
    content: string;
    summary: string;
  }): Promise<string> {
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    });

    if (!res.ok) throw new Error(await res.text());

    const savedArticle = await res.json();
    return savedArticle.id;
  },
};
