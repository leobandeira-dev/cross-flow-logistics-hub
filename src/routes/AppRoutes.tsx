import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';
import { ProtectedRoute } from './ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import LandingPage from '@/pages/LandingPage';

// Lazy loaded components
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Lazy loaded feature routes
const CoreRoutes = React.lazy(() => import('./features/CoreRoutes'));
const ArmazenagemRoutes = React.lazy(() => import('./features/ArmazenagemRoutes'));
const ExpedicaoRoutes = React.lazy(() => import('./features/ExpedicaoRoutes'));
const SACRoutes = React.lazy(() => import('./features/SACRoutes'));
const ColetasRoutes = React.lazy(() => import('./features/ColetasRoutes'));
const RelatoriosRoutes = React.lazy(() => import('./features/RelatoriosRoutes'));
const CadastrosRoutes = React.lazy(() => import('./features/CadastrosRoutes'));
const ConfiguracoesRoutes = React.lazy(() => import('./features/ConfiguracoesRoutes'));
const AdminRoutes = React.lazy(() => import('./features/AdminRoutes'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/auth/login" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            {user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          </Suspense>
        } 
      />

      {/* Protected routes wrapped in MainLayout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Feature routes */}
                  <Route
                    path="dashboard/*"
                    element={<CoreRoutes />}
                  />
                  
                  <Route
                    path="armazenagem/*"
                    element={
                      <ProtectedRoute requiredPermission="armazenagem.access">
                        <ArmazenagemRoutes />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="expedicao/*"
                    element={
                      <ProtectedRoute requiredPermission="expedicao.access">
                        <ExpedicaoRoutes />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="sac/*"
                    element={
                      <ProtectedRoute requiredPermission="sac.access">
                        <SACRoutes />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="coletas/*"
                    element={
                      <ProtectedRoute requiredPermission="coletas.access">
                        <ColetasRoutes />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="relatorios/*"
                    element={
                      <ProtectedRoute requiredPermission="relatorios.access">
                        <RelatoriosRoutes />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="cadastros/*"
                    element={
                      <ProtectedRoute requiredRole="SUPERVISOR">
                        <CadastrosRoutes />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="configuracoes/*"
                    element={
                      <ProtectedRoute requiredRole="GERENTE">
                        <ConfiguracoesRoutes />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="admin/*"
                    element={
                      <ProtectedRoute requiredRole="ADMIN">
                        <AdminRoutes />
                      </ProtectedRoute>
                    }
                  />

                  {/* Default route for protected area */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* NotFound for public routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
