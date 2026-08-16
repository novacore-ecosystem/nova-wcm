export type { Product } from "@/services/product";
export {
  productKeys,
  useCreateProductMutation,
  useDeleteProductMutation,
  useProductQuery,
  useProductsQuery,
  useUpdateProductMutation,
} from "@/features/product/api/product.queries";
export { ProductListPage } from "@/features/product/components/ProductListPage";
export { ProductForm } from "@/features/product/components/ProductForm";
