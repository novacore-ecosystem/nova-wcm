import { ArticleCategoryForm } from "@/features/article-category";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleCategoryForm categoryId={id} />;
}
