
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

// Pages Import
import AuthPage from '../pages/AuthPage';
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/dashboard/Dashboard';
import NotFound from '../pages/NotFound';
import Index from '../pages/Index';

// Páginas de Armazenagem
import RecebimentoOverview from '../pages/armazenagem/RecebimentoOverview';
import MovimentacoesInternas from '../pages/armazenagem/MovimentacoesInternas';
import Carregamento from '../pages/armazenagem/Carregamento';
import OrdemCarregamento from '../pages/armazenagem/carregamento/OrdemCarregamento';

// Páginas de Expedição
import Faturamento from '../pages/expedicao/Faturamento';
import EmissaoDocumentos from '../pages/expedicao/EmissaoDocumentos';

// Página de SAC
import Ocorrencias from '../pages/sac/Ocorrencias';

// Páginas de Coletas
import SolicitacoesColeta from '../pages/coletas/SolicitacoesColeta';
import AprovacoesColeta from '../pages/coletas/AprovacoesColeta';
import CargasAlocacao from '../pages/coletas/CargasAlocacao';

// Páginas de Relatórios
import ReportsDashboard from '../pages/relatorios/ReportsDashboard';
import SolicitacoesReport from '../pages/relatorios/coletas/SolicitacoesReport';

// Páginas de Cadastros
import CadastroUsuarios from '../pages/usuarios/CadastroUsuarios';
import CadastroEmpresas from '../pages/empresas/CadastroEmpresas';
import CadastroMotoristas from '../pages/motoristas/CadastroMotoristas';
import CargasMotoristas from '../pages/motoristas/CargasMotoristas';
import CadastroEnderecamento from '../pages/cadastros/enderecamento/CadastroEnderecamento';

// Route wrapper components
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      } />
      
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/index" element={<Index />} />

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
};

export default AppRoutes;
