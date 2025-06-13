
import { Route } from 'react-router-dom';

// Pages Import
import LandingPage from '../../pages/LandingPage';
import Dashboard from '../../pages/dashboard/Dashboard';
import Index from '../../pages/Index';
import UserProfilePage from '../../pages/UserProfilePage';

const CoreRoutes = () => {
  return [
    <Route key="landing" path="/" element={<Index />} />,
    
    <Route key="profile" path="/profile" element={<UserProfilePage />} />,
    
    <Route key="dashboard" path="/dashboard" element={<Dashboard />} />,

    <Route key="index" path="/index" element={<Index />} />
  ];
};

export default CoreRoutes;
