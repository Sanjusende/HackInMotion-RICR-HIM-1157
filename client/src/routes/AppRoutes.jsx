import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageSkeleton } from '../components/ui/Loader';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

// Public pages
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * Placeholder Dashboard Component
 */
const DashboardPlaceholder = () => {
  const { currentUser, logout } = useAuth();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-2xl">
        KM
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-dark-text">Welcome, {currentUser?.name || 'Farmer'}!</h1>
        <p className="text-secondary-text max-w-md mx-auto">
          Your authentication is active and JWT session is established successfully. The full smart agricultural dashboard interface will be integrated in the next milestone.
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={logout}>
          Log Out
        </Button>
      </div>
    </div>
  );
};

/**
 * Route guard for protected routes.
 * Accessible only by authenticated users.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Route guard for public/auth routes.
 * Redirects authenticated users to /dashboard automatically.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageSkeleton />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Public auth pages: redirect if already authenticated */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPlaceholder /></ProtectedRoute>} />

        {/* Catch all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
