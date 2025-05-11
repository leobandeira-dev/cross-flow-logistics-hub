
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SolicitacoesColeta from "./pages/coletas/SolicitacoesColeta";
import AprovacoesColeta from "./pages/coletas/AprovacoesColeta";
import CargasAlocacao from "./pages/coletas/CargasAlocacao";
import CadastroMotoristas from "./pages/motoristas/CadastroMotoristas";
import CargasMotoristas from "./pages/motoristas/CargasMotoristas";
import Ocorrencias from "./pages/sac/Ocorrencias";
import EmissaoDocumentos from "./pages/expedicao/EmissaoDocumentos";

// Armazenagem Module Pages
import RecebimentoOverview from "./pages/armazenagem/RecebimentoOverview";
import RecebimentoFornecedor from "./pages/armazenagem/recebimento/RecebimentoFornecedor";
import RecebimentoColeta from "./pages/armazenagem/recebimento/RecebimentoColeta";
import RecebimentoFiliais from "./pages/armazenagem/recebimento/RecebimentoFiliais";
import EntradaNotas from "./pages/armazenagem/recebimento/EntradaNotas";
import GeracaoEtiquetas from "./pages/armazenagem/recebimento/GeracaoEtiquetas";
import MovimentacoesInternas from "./pages/armazenagem/movimentacoes/MovimentacoesInternas";
import UnitizacaoPaletes from "./pages/armazenagem/movimentacoes/UnitizacaoPaletes";
import CancelarUnitizacao from "./pages/armazenagem/movimentacoes/CancelarUnitizacao";
import Enderecamento from "./pages/armazenagem/movimentacoes/Enderecamento";
import Carregamento from "./pages/armazenagem/Carregamento";
import OrdemCarregamento from "./pages/armazenagem/carregamento/OrdemCarregamento";
import ConferenciaCarga from "./pages/armazenagem/carregamento/ConferenciaCarga";
import EnderecamentoCaminhao from "./pages/armazenagem/carregamento/EnderecamentoCaminhao";
import ChecklistCarga from "./pages/armazenagem/carregamento/ChecklistCarga";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/coletas/solicitacoes" element={<SolicitacoesColeta />} />
          <Route path="/coletas/aprovacoes" element={<AprovacoesColeta />} />
          <Route path="/coletas/alocacao" element={<CargasAlocacao />} />
          <Route path="/motoristas/cadastro" element={<CadastroMotoristas />} />
          <Route path="/motoristas/cargas" element={<CargasMotoristas />} />
          <Route path="/sac" element={<Ocorrencias />} />
          <Route path="/expedicao" element={<EmissaoDocumentos />} />
          
          {/* Armazenagem Module Routes */}
          <Route path="/armazenagem" element={<RecebimentoOverview />} />
          
          {/* Recebimento Routes */}
          <Route path="/armazenagem/recebimento/fornecedor" element={<RecebimentoFornecedor />} />
          <Route path="/armazenagem/recebimento/coleta" element={<RecebimentoColeta />} />
          <Route path="/armazenagem/recebimento/filiais" element={<RecebimentoFiliais />} />
          <Route path="/armazenagem/recebimento/notas" element={<EntradaNotas />} />
          <Route path="/armazenagem/recebimento/etiquetas" element={<GeracaoEtiquetas />} />
          
          {/* Movimentações Internas Routes */}
          <Route path="/armazenagem/movimentacoes" element={<MovimentacoesInternas />} />
          <Route path="/armazenagem/movimentacoes/unitizacao" element={<UnitizacaoPaletes />} />
          <Route path="/armazenagem/movimentacoes/cancelar-unitizacao" element={<CancelarUnitizacao />} />
          <Route path="/armazenagem/movimentacoes/enderecamento" element={<Enderecamento />} />
          
          {/* Carregamento Routes */}
          <Route path="/armazenagem/carregamento" element={<Carregamento />} />
          <Route path="/armazenagem/carregamento/ordem" element={<OrdemCarregamento />} />
          <Route path="/armazenagem/carregamento/conferencia" element={<ConferenciaCarga />} />
          <Route path="/armazenagem/carregamento/enderecamento" element={<EnderecamentoCaminhao />} />
          <Route path="/armazenagem/carregamento/checklist" element={<ChecklistCarga />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
