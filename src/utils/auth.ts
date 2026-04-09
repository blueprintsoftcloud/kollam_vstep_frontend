export const TOKEN_KEY = 'admin_token';

export type TokenPayload = {
  exp?: number;
  iat?: number;
  [key: string]: any;
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function parseJwt(token: string): TokenPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    ));
  } catch {
    return null;
  }
}

export function isTokenValid(token?: string | null): boolean {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload) return false;

  if (typeof payload.exp !== 'number') return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export function isLoggedIn(): boolean {
  const token = getToken();
  return isTokenValid(token);
}
