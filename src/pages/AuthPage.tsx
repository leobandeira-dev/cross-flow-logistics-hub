
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthCard } from '@/components/auth/AuthCard';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Check URL parameters for registration tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
    }
    if (params.get('forgotPassword') === 'true') {
      setShowForgotPassword(true);
    }
  }, [location]);

  // Get the intended destination from the location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect authenticated users
  useEffect(() => {
    console.log('AuthPage useEffect - user:', !!user, 'loading:', loading);
    
    if (user && !loading) {
      console.log('User is authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm
        onBackToLogin={handleBackToLogin}
        error={error}
        success={success}
        setError={setError}
        setSuccess={setSuccess}
      />
    );
  }

  return (
    <AuthCard
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      error={error}
      success={success}
      setError={setError}
      setSuccess={setSuccess}
      onForgotPassword={handleForgotPasswordClick}
    />
  );
};

export default AuthPage;
