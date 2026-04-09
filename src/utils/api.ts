import { getToken, clearToken } from './auth';
import toast from 'react-hot-toast';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const status = response.status;

    // Only treat 401 as session expired if we have a token (meaning we're authenticated)
    // For login endpoint, 401 means invalid credentials, not expired session
    if (status === 401 && token && !url.includes('/login')) {
      // Token expired or invalid
      clearToken();
      toast.error('Your session has expired. Please log in again.');

      // No redirect here; the global fetch interceptor will handle it.
      return { success: false, error: 'Session expired', status };
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (response.ok) {
      return { success: true, data, status };
    } else {
      const error = data?.message || data?.error || `Request failed with status ${status}`;
      return { success: false, error, status };
    }
  } catch (error) {
    console.error('API request error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return { success: false, error: errorMessage };
  }
}

// Convenience methods
export const api = {
  get: <T = any>(url: string) => apiRequest<T>(url),
  post: <T = any>(url: string, data?: any) => apiRequest<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }),
  put: <T = any>(url: string, data?: any) => apiRequest<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }),
  delete: <T = any>(url: string) => apiRequest<T>(url, {
    method: 'DELETE',
  }),
};