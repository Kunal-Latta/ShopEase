import type { Category } from "./category.types";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category?: Category;
}

export interface GetProductsParams {
  categoryId?: number;
  sortBy?: "price";
  order?: "asc" | "desc";
  priceMin?: number;
  priceMax?: number;
  limit?: number;
}
