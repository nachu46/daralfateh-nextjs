import apiClient from './client';

export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  token?: string;
}

export async function login(payload: AuthPayload): Promise<AuthUser> {
  const { data } = await apiClient.post<AuthUser>('/login', payload);
  return data;
}

export async function register(payload: AuthPayload): Promise<AuthUser> {
  const { data } = await apiClient.post<AuthUser>('/register', payload);
  return data;
}
