
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from './components/ui/toaster';
import { queryClient } from './lib/queryClient';
import AppRoutes from './routes/AppRoutes';

// Add authentication debug logging
const logAuthState = () => {
  console.log('App rendering');
  return null;
};

function App() {
  logAuthState();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
