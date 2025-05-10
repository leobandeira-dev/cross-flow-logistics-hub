
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SolicitacoesColeta from "./pages/coletas/SolicitacoesColeta";
import AprovacoesColeta from "./pages/coletas/AprovacoesColeta";
import CadastroMotoristas from "./pages/motoristas/CadastroMotoristas";
import Ocorrencias from "./pages/sac/Ocorrencias";
import EmissaoDocumentos from "./pages/expedicao/EmissaoDocumentos";

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
          <Route path="/motoristas/cadastro" element={<CadastroMotoristas />} />
          <Route path="/sac" element={<Ocorrencias />} />
          <Route path="/expedicao" element={<EmissaoDocumentos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
