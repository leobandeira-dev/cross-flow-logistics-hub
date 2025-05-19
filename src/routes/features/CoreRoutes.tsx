
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Pages Import
import LandingPage from '../../pages/LandingPage';
import Dashboard from '../../pages/dashboard/Dashboard';
import UserProfilePage from '../../pages/UserProfilePage';
import Index from '../../pages/Index';

const CoreRoutes = () => {
  return [
    <Route key="landing" path="/" element={<LandingPage />} />,
    
    <Route key="index" path="/index" element={<Index />} />,
    
    <Route key="profile" path="/profile" element={
      <ProtectedRoute>
        <UserProfilePage />
      </ProtectedRoute>
    } />,
    
    <Route key="dashboard" path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />,
  ];
};

export default CoreRoutes;
