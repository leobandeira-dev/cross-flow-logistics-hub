
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from './components/ui/toaster';
import { queryClient } from './lib/queryClient';
import AppRoutes from './routes/AppRoutes';

// Improved function to detect preview environment
const isPreviewEnvironment = () => {
  const isPreview = window.location.hostname.includes('lovableproject.com') || 
                   window.location.hostname.includes('lovable.app') ||
                   window.top !== window.self; // Detect if in iframe
  console.log('Preview environment detection:', isPreview);
  return isPreview;
};

function App() {
  // Use HashRouter in preview environment to avoid history API issues
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
