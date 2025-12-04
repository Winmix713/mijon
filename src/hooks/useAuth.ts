/**
 * useAuth Hook
 * Provides access to authentication state and methods
 * Manages user session, role claims, and auth operations
 */

import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * useAuthGuard Hook
 * Guards route access based on authentication and role requirements
 */
export function useAuthGuard() {
  const { isLoading, user, userRole } = useAuth();

  return {
    isLoading,
    isAuthenticated: !!user,
    user,
    userRole,
    isAdmin: userRole === 'admin',
    isAnalyst: userRole === 'analyst' || userRole === 'admin',
    isUser: !!userRole,
  };
}

export default useAuth;
