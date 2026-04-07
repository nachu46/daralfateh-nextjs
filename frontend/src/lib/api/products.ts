import apiClient from './client';
import type { Product } from '@/components/ProductCard';

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export async function getProducts(params?: {
  category_id?: number;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/products', { params });
  return data;
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
}

export async function getCategories(): Promise<{ id: number; name: string }[]> {
  const { data } = await apiClient.get<{ categories: { id: number; name: string }[] }>('/categories');
  return (data as unknown as { categories: { id: number; name: string }[] }).categories;
}
