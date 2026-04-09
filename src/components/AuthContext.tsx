import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getToken, isTokenValid, clearToken } from '../utils/auth';
import { apiRequest } from '../utils/api';
import toast from 'react-hot-toast';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: { id: string; username: string } | null;
};

type AuthContextType = AuthState & {
  logout: () => void;
  refreshAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    user: null,
  });

  const verifyAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const token = getToken();

      if (!token || !isTokenValid(token)) {
        clearToken();
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null,
          user: null,
        });
        // Only show session timeout toast if we were previously authenticated
        if (authState.isAuthenticated) {
          toast.error('Your session has expired. Please log in again.');
        }
        return;
      }

      // Verify token with backend
      const result = await apiRequest('/api/admin/verify');

      if (result.success) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null,
          user: result.data.admin,
        });
      } else {
        clearToken();
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null,
          user: null,
        });
        // apiRequest already handles 401 by showing toast and redirecting
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      clearToken();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to verify authentication',
        user: null,
      });
      // Show session timeout toast
      toast.error('Your session has expired. Please log in again.');
    }
  };

  const logout = () => {
    clearToken();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
    });
    // Navigate to login page
    window.location.href = '/admin/login';
  };

  const refreshAuth = async () => {
    await verifyAuth();
  };

  const login = async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (result.success) {
        if (!result.data?.token) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Login failed: missing token',
          }));
          return { success: false, error: 'Login failed: missing token' };
        }

        // Store token
        localStorage.setItem('admin_token', result.data.token);

        // Set authenticated state
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null,
          user: result.data.admin,
        });

        return { success: true };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Invalid credentials',
        }));
        return { success: false, error: result.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Unable to connect to server',
      }));
      return { success: false, error: 'Unable to connect to server' };
    }
  };




  useEffect(() => {
    verifyAuth();

    // Listen for logout events from apiRequest
    const handleLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, logout, refreshAuth, login }}>
      {children}
    </AuthContext.Provider>
  );
};