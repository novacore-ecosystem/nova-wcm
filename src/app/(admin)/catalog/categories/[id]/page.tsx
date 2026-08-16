import { ProductCategoryForm } from "@/features/product-category";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductCategoryForm categoryId={id} />;
}
