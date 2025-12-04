/**
 * AuthGate Component
 * Route protection component that enforces authentication and role-based access control
 * Redirects unauthorized users to login or permission denied page
 */

import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export type AllowedRole = 'admin' | 'analyst' | 'user' | 'viewer' | 'demo';

interface AuthGateProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: AllowedRole[];
  fallback?: ReactNode;
}

/**
 * AuthGate Component
 * Protects routes based on authentication status and user role
 *
 * @param children - Component to render if access is granted
 * @param requireAuth - If true, requires user to be authenticated (default: true)
 * @param allowedRoles - Array of roles allowed to access this route
 * @param fallback - Component to render while loading
 *
 * @example
 * // Public route
 * <Route path="/login" element={<AuthGate requireAuth={false}><Login /></AuthGate>} />
 *
 * // Protected route (all authenticated users)
 * <Route path="/dashboard" element={<AuthGate><Dashboard /></AuthGate>} />
 *
 * // Role-restricted route
 * <Route path="/admin" element={<AuthGate allowedRoles={['admin']}><AdminPanel /></AuthGate>} />
 *
 * // Analyst and Admin only
 * <Route path="/jobs" element={<AuthGate allowedRoles={['admin', 'analyst']}><Jobs /></AuthGate>} />
 */
export function AuthGate({
  children,
  requireAuth = true,
  allowedRoles,
  fallback,
}: AuthGateProps) {
  const { user, userRole, isLoading } = useAuth();
  const location = useLocation();

  // Check if user has access based on role
  const hasAccess = (() => {
    // If no auth required, allow access
    if (!requireAuth) {
      return true;
    }

    // If auth required but user not logged in, deny access
    if (!user) {
      return false;
    }

    // If specific roles required, check if user has one
    if (allowedRoles && allowedRoles.length > 0) {
      return allowedRoles.includes(userRole as AllowedRole);
    }

    // If auth required and user logged in, allow access
    return true;
  })();

  // Show loading state
  if (isLoading) {
    return fallback ? (
      <>
        {fallback}
      </>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  // Redirect if access denied
  if (!hasAccess) {
    // If auth required but not authenticated, redirect to login
    if (requireAuth && !user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If role check failed, redirect to permission denied
    if (allowedRoles && allowedRoles.length > 0 && user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required role(s): {allowedRoles.join(', ')}
              <br />
              Your role: {userRole}
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // Render protected content
  return <>{children}</>;
}

export default AuthGate;
