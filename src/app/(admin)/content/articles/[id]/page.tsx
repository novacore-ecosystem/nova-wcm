import { ArticleWorkspace } from "@/features/article";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleWorkspace articleId={id} />;
}
