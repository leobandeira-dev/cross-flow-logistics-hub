
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from './components/ui/toaster';
import { queryClient } from './lib/queryClient';
import AppRoutes from './routes/AppRoutes';

// Use HashRouter in preview environment to avoid history API security issues
const isPreviewEnvironment = () => {
  return window.location.hostname.includes('lovableproject.com') || 
         window.location.hostname.includes('lovable.app');
};

function App() {
  const Router = isPreviewEnvironment() ? HashRouter : BrowserRouter;
  
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
