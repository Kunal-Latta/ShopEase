import axios from "axios";
import type { GetProductsParams, Product } from "../types/product.types";
import type { Category } from "../types/category.types";

const API_BASE_URL = "https://api.escuelajs.co/api/v1";

export function buildProductsUrl(params?: GetProductsParams) {
  const url = new URLSearchParams();

  if (params?.categoryId !== undefined)
    url.set("categoryId", String(params.categoryId));
  if (params?.sortBy) url.set("sortBy", params.sortBy);
  if (params?.order) url.set("order", params.order);
  if (params?.priceMin !== undefined)
    url.set("price_min", String(params.priceMin));
  if (params?.priceMax !== undefined)
    url.set("price_max", String(params.priceMax));
  if (params?.limit !== undefined) url.set("limit", String(params.limit));

  const query = url.toString();

  return `${API_BASE_URL}/products${query ? `?${query}` : ""}`;
}

export async function request<T>(url: string): Promise<T> {
  try {
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Something went wrong", { cause: error });
  }
}

export function getProducts(params?: GetProductsParams) {
  return request<Product[]>(buildProductsUrl(params));
}

export function getProductById(id: number) {
  return request<Product>(`${API_BASE_URL}/products/${id}`);
}

export function getCategories() {
  return request<Category[]>(`${API_BASE_URL}/categories`);
}
