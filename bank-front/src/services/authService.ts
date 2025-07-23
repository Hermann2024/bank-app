export interface LoginResponse {
  token: string;
  user: { email: string; name?: string };
}

const API_URL = 'http://localhost:8080/api/auth'; // à adapter selon ton backend

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    throw new Error('Identifiants invalides');
  }
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getUser(): { email: string; name?: string } | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
} 