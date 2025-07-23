import { getToken } from './authService';

const API_BASE = 'http://localhost:8080/api'; // à adapter selon ton backend

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!response.ok) {
    throw new Error(await response.text() || 'Erreur API');
  }
  return response.json();
}

export async function getNotifications() {
  return apiFetch<any[]>('/notifications');
}

export async function markNotificationAsRead(id: string) {
  return apiFetch(`/notifications/${id}/read`, { method: 'POST' });
} 