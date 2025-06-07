
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Pages Import
import Index from '../../pages/Index';
import Dashboard from '../../pages/dashboard/Dashboard';
import UserProfilePage from '../../pages/UserProfilePage';
import SubscriptionPage from '../../pages/SubscriptionPage';

const CoreRoutes = () => {
  return [
    <Route key="home" path="/" element={<Index />} />,
    
    <Route key="dashboard" path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />,
    
    <Route key="profile" path="/profile" element={
      <ProtectedRoute>
        <UserProfilePage />
      </ProtectedRoute>
    } />,

    <Route key="subscription" path="/subscription" element={
      <ProtectedRoute>
        <SubscriptionPage />
      </ProtectedRoute>
    } />
  ];
};

export default CoreRoutes;
