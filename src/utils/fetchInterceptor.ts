import toast from 'react-hot-toast';
import { clearToken, getToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function getFullUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input.startsWith('/api') ? `${API_BASE_URL}${input}` : input;
  }

  if (input instanceof URL) {
    return input.pathname.startsWith('/api') ? `${API_BASE_URL}${input.pathname}${input.search}` : input.toString();
  }

  return input.url;
}

/**
 * Installs a global fetch interceptor that handles 401s as session expiration.
 *
 * This ensures that any `fetch` call (even direct ones used in the app) will
 * trigger a logout redirect when the backend returns 401.
 */
export function initFetchInterceptor() {
  // Prevent installing multiple times
  if ((window as any).__fetchInterceptorInstalled) return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const requestUrl = getFullUrl(input);
    const response = await originalFetch(requestUrl, init);

    // Only consider 401 when we have an auth token (meaning user was logged in).
    // Ignore login endpoint so wrong credentials don't trigger redirect.
    const token = getToken();

    if (response.status === 401 && token && !requestUrl.includes('/login')) {
      clearToken();
      toast.error('Your session has expired. Please log in again.');

      // Redirect without requiring manual refresh.
      // Using location.href forces a full reload, which ensures all state is cleared.
      window.location.href = '/admin/login';
    }

    return response;
  };

  (window as any).__fetchInterceptorInstalled = true;
}
