import Link from "next/link";
import { api } from "@/lib/api";

export const revalidate = 60;

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof api.getArticles>> = [];
  try {
    articles = await api.getArticles();
  } catch {}

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">記事一覧</h1>
      <p className="text-sm text-gray-500 mb-8">ITエンジニアの年収・面接に関する情報をお届けします</p>

      {articles.length === 0 ? (
        <p className="text-gray-400">記事はまだありません</p>
      ) : (
        <div className="space-y-4">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition"
            >
              <h2 className="font-semibold text-gray-900">{a.title}</h2>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(a.created_at).toLocaleDateString("ja-JP")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
