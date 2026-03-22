import { notFound } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await api.getArticle(params.slug);
    const desc = article.content?.replace(/\n/g, " ").slice(0, 120) ?? "";
    return {
      title: article.title,
      description: desc ? `${desc}…` : undefined,
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: "記事", robots: { index: false, follow: false } };
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let article: Awaited<ReturnType<typeof api.getArticle>> | null = null;
  try {
    article = await api.getArticle(params.slug);
  } catch {}

  if (!article) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/articles" className="text-sm text-blue-600 hover:underline">
        ← 記事一覧に戻る
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{article.title}</h1>
      <p className="text-xs text-gray-400 mb-8">
        {new Date(article.created_at).toLocaleDateString("ja-JP")}
      </p>
      <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
        {article.content}
      </div>
    </div>
  );
}
