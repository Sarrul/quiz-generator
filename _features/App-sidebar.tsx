"use client";

import { Article, useArticle } from "@/_contexts/ArcticleContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectArticle } = useArticle();

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      });
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <p className="px-4 py-2 font-semibold">Saved Articles</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {loading && <p className="px-4 text-sm text-zinc-500">Loading...</p>}

          {!loading && articles.length === 0 && (
            <p className="px-4 text-sm text-zinc-500">No saved articles yet</p>
          )}

          {articles.map((article) => (
            <button
              key={article.id}
              onClick={() => selectArticle(article)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 rounded"
            >
              {article.title}
            </button>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
