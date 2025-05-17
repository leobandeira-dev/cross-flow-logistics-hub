
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
  const [processingInvite, setProcessingInvite] = useState(false);

  // Verifica se há tokens de convite ou outros parâmetros na URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type === 'invite') {
      setProcessingInvite(true);
      setSuccess("Processando convite, por favor aguarde...");
    }
    
    // Check URL parameters for registration tab
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
      // Limpar mensagem de processamento de convite
      setProcessingInvite(false);
      navigate(from, { replace: true });
    } else if (!loading && processingInvite) {
      // Se não está mais carregando mas estava processando um convite
      // e não há usuário, algo deu errado
      setProcessingInvite(false);
      setError("Não foi possível processar o convite. Por favor, entre em contato com o administrador.");
    }
  }, [user, loading, navigate, from, processingInvite]);

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  // Show loading state while checking authentication
  if (loading || processingInvite) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          {processingInvite && (
            <p className="text-center text-gray-600">
              Processando seu convite, por favor aguarde...
            </p>
          )}
        </div>
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
