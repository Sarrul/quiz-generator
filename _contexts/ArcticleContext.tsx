"use client";

import { createContext, useContext, useState } from "react";

export type Article = {
  id: string;
  title: string;
  content: string;
  summary: string | null;
};

type ArticleContextType = {
  selectedArticle: Article | null;
  selectArticle: (article: Article) => void;
  clearSelectedArticle: () => void;
};

const ArticleContext = createContext<ArticleContextType | null>(null);

export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <ArticleContext.Provider
      value={{
        selectedArticle,
        selectArticle: (article) => setSelectedArticle(article),
        clearSelectedArticle: () => setSelectedArticle(null),
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticle() {
  const ctx = useContext(ArticleContext);
  if (!ctx) {
    throw new Error("useArticle must be used inside ArticleProvider");
  }
  return ctx;
}
