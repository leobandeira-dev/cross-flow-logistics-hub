
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth'; 
import { Toaster } from './components/ui/toaster';

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

// Criando o cliente do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Armazenagem */}
            <Route path="/armazenagem/recebimento" element={<RecebimentoOverview />} />
            <Route path="/armazenagem/movimentacoes" element={<MovimentacoesInternas />} />
            <Route path="/armazenagem/carregamento" element={<Carregamento />} />
            <Route path="/armazenagem/ordem-carregamento" element={<OrdemCarregamento />} />

            {/* Expedição */}
            <Route path="/expedicao" element={<Faturamento />} />
            <Route path="/expedicao/documentos" element={<EmissaoDocumentos />} />

            {/* SAC */}
            <Route path="/sac/ocorrencias" element={<Ocorrencias />} />

            {/* Coletas */}
            <Route path="/coletas/solicitacoes" element={<SolicitacoesColeta />} />
            <Route path="/coletas/aprovacoes" element={<AprovacoesColeta />} />
            <Route path="/coletas/cargas" element={<CargasAlocacao />} />

            {/* Relatórios */}
            <Route path="/relatorios" element={<ReportsDashboard />} />
            <Route path="/relatorios/coletas/solicitacoes" element={<SolicitacoesReport />} />

            {/* Cadastros */}
            <Route path="/cadastros/usuarios" element={<CadastroUsuarios />} />
            <Route path="/cadastros/empresas" element={<CadastroEmpresas />} />
            <Route path="/cadastros/motoristas" element={<CadastroMotoristas />} />
            <Route path="/cadastros/motoristas/cargas" element={<CargasMotoristas />} />
            <Route path="/cadastros/enderecamento" element={<CadastroEnderecamento />} />

            {/* NotFound */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
