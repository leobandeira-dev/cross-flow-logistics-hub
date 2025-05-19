
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from './components/ui/toaster';
import { queryClient } from './lib/queryClient';
import AppRoutes from './routes/AppRoutes';

// Função melhorada para detectar ambiente de preview
const isPreviewEnvironment = () => {
  return window.location.hostname.includes('lovableproject.com') || 
         window.location.hostname.includes('lovable.app') ||
         window.top !== window.self; // Detecta se está em um iframe
};

function App() {
  // Usa HashRouter em ambiente de preview para evitar problemas com a API de histórico
  const Router = isPreviewEnvironment() ? HashRouter : BrowserRouter;
  
  console.log('Ambiente de preview detectado:', isPreviewEnvironment());
  console.log('Usando roteador:', isPreviewEnvironment() ? 'HashRouter' : 'BrowserRouter');
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
