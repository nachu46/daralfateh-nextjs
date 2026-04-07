import apiClient from './client';

export interface CartAddPayload {
  product_id: number;
  quantity: number;
}

export interface OrderLine {
  product_id: number;
  quantity: number;
  price_unit: number;
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  address: string;
  lines: OrderLine[];
}

export interface OrderResult {
  order_id: number;
  order_name: string;
  total: number;
}

export async function addToCart(payload: CartAddPayload): Promise<{ cart_id: number }> {
  const { data } = await apiClient.post<{ cart_id: number }>('/cart/add', payload);
  return data;
}

export async function createOrder(payload: OrderPayload): Promise<OrderResult> {
  const { data } = await apiClient.post<OrderResult>('/order/create', payload);
  return data;
}
