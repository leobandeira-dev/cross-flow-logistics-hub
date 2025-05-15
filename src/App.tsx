import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, BrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth'; 
import { Toaster } from './components/ui/toaster';
import { useEffect } from 'react';

import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';

// Páginas de Armazenagem
import RecebimentoOverview from './pages/armazenagem/RecebimentoOverview';
import MovimentacoesInternas from './pages/armazenagem/MovimentacoesInternas';
import Carregamento from './pages/armazenagem/Carregamento';
import OrdemCarregamento from './pages/armazenagem/carregamento/OrdemCarregamento';

// Páginas de Expedição
import Faturamento from './pages/expedicao/Faturamento';
import EmissaoDocumentos from './pages/expedicao/EmissaoDocumentos';

// Página de SAC
import Ocorrencias from './pages/sac/Ocorrencias';

// Páginas de Coletas
import SolicitacoesColeta from './pages/coletas/SolicitacoesColeta';
import AprovacoesColeta from './pages/coletas/AprovacoesColeta';
import CargasAlocacao from './pages/coletas/CargasAlocacao';

// Páginas de Relatórios
import ReportsDashboard from './pages/relatorios/ReportsDashboard';
import SolicitacoesReport from './pages/relatorios/coletas/SolicitacoesReport';

// Páginas de Cadastros
import CadastroUsuarios from './pages/usuarios/CadastroUsuarios';
import CadastroEmpresas from './pages/empresas/CadastroEmpresas';
import CadastroMotoristas from './pages/motoristas/CadastroMotoristas';
import CargasMotoristas from './pages/motoristas/CargasMotoristas';
import CadastroEnderecamento from './pages/cadastros/enderecamento/CadastroEnderecamento';

// Proteção de rotas: redireciona para login se não autenticado
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute check - user:', user, 'loading:', loading);
  }, [user, loading]);
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    console.log('No user found, redirecting to auth');
    // Save the location they were trying to access for redirect after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

// Redireciona usuários logados para o dashboard
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    console.log('PublicRoute check - user:', user, 'loading:', loading);
  }, [user, loading]);
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (user) {
    console.log('User already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('No authenticated user, rendering public content');
  return <>{children}</>;
};

// Criando o cliente do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      } />
      
      <Route path="/" element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Armazenagem */}
      <Route path="/armazenagem/recebimento" element={
        <ProtectedRoute>
          <RecebimentoOverview />
        </ProtectedRoute>
      } />
      <Route path="/armazenagem/movimentacoes" element={
        <ProtectedRoute>
          <MovimentacoesInternas />
        </ProtectedRoute>
      } />
      <Route path="/armazenagem/carregamento" element={
        <ProtectedRoute>
          <Carregamento />
        </ProtectedRoute>
      } />
      <Route path="/armazenagem/ordem-carregamento" element={
        <ProtectedRoute>
          <OrdemCarregamento />
        </ProtectedRoute>
      } />

      {/* Expedição */}
      <Route path="/expedicao" element={
        <ProtectedRoute>
          <Faturamento />
        </ProtectedRoute>
      } />
      <Route path="/expedicao/documentos" element={
        <ProtectedRoute>
          <EmissaoDocumentos />
        </ProtectedRoute>
      } />

      {/* SAC */}
      <Route path="/sac/ocorrencias" element={
        <ProtectedRoute>
          <Ocorrencias />
        </ProtectedRoute>
      } />

      {/* Coletas */}
      <Route path="/coletas/solicitacoes" element={
        <ProtectedRoute>
          <SolicitacoesColeta />
        </ProtectedRoute>
      } />
      <Route path="/coletas/aprovacoes" element={
        <ProtectedRoute>
          <AprovacoesColeta />
        </ProtectedRoute>
      } />
      <Route path="/coletas/cargas" element={
        <ProtectedRoute>
          <CargasAlocacao />
        </ProtectedRoute>
      } />

      {/* Relatórios */}
      <Route path="/relatorios" element={
        <ProtectedRoute>
          <ReportsDashboard />
        </ProtectedRoute>
      } />
      <Route path="/relatorios/coletas/solicitacoes" element={
        <ProtectedRoute>
          <SolicitacoesReport />
        </ProtectedRoute>
      } />

      {/* Cadastros */}
      <Route path="/cadastros/usuarios" element={
        <ProtectedRoute>
          <CadastroUsuarios />
        </ProtectedRoute>
      } />
      <Route path="/cadastros/empresas" element={
        <ProtectedRoute>
          <CadastroEmpresas />
        </ProtectedRoute>
      } />
      <Route path="/cadastros/motoristas" element={
        <ProtectedRoute>
          <CadastroMotoristas />
        </ProtectedRoute>
      } />
      <Route path="/cadastros/motoristas/cargas" element={
        <ProtectedRoute>
          <CargasMotoristas />
        </ProtectedRoute>
      } />
      <Route path="/cadastros/enderecamento" element={
        <ProtectedRoute>
          <CadastroEnderecamento />
        </ProtectedRoute>
      } />

      {/* NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
