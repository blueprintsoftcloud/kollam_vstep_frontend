import { useEffect, useState } from 'react';
import { getToken, isTokenValid, clearToken } from '../utils/auth';
import { apiFetch } from '../utils/api';

export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

/**
 * Custom hook to handle authentication state and token verification
 * Checks localStorage for token validity and optionally verifies with backend
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = getToken();

        // Check if token exists and is locally valid
        if (!token || !isTokenValid(token)) {
          clearToken();
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          return;
        }

        // Optionally verify token with backend for extra security
        // This ensures the token is still valid on the server side
        try {
          const response = await apiFetch('/api/admin/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            // Token is valid on server
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else if (response.status === 401) {
            // Token expired or invalid on server
            clearToken();
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              error: 'Session expired',
            });
          } else {
            throw new Error('Verification failed');
          }
        } catch (verifyError) {
          // If backend verify fails, fall back to local validation
          // This allows offline support while app verifies when connection is available
          console.warn('Backend verification failed, using local validation:', verifyError);
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        clearToken();
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication error',
        });
      }
    };

    verifyAuth();
  }, []);

  return authState;
}
