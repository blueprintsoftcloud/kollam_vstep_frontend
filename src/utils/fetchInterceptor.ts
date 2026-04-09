import toast from 'react-hot-toast';
import { clearToken, getToken } from './auth';

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
    const response = await originalFetch(input, init);

    // Only consider 401 when we have an auth token (meaning user was logged in).
    // Ignore login endpoint so wrong credentials don't trigger redirect.
    const token = getToken();
    const requestUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

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
