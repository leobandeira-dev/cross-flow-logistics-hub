
import React, { useEffect, useState, useCallback } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primeiro, estabelecer os hooks de gerenciamento de estado
  const { 
    user, 
    session, 
    loading, 
    setLoading, 
    setUser, 
    connectionError, 
    authChecked, 
    setAuthChecked 
  } = useAuthState();
  
  // Em seguida, configurar ações que usam os setters de estado
  const { signIn, signUp, signOut, forgotPassword, updatePassword } = useAuthActions(setLoading, setUser);

  // Fornecer método para verificação explícita do estado de autenticação
  const verifyAuthState = useCallback(() => {
    if (!authChecked && !loading) {
      console.log("Explicitly verifying auth state");
      setAuthChecked(true);
    }
  }, [authChecked, loading, setAuthChecked]);

  // Registrar o estado de autenticação quando ele muda
  useEffect(() => {
    console.log('AuthProvider state updated:', { 
      user: !!user, 
      session: !!session, 
      loading, 
      connectionError,
      authChecked
    });
    
    // Auto-verificação após um período razoável se ainda não estiver verificado
    if (!authChecked && !loading) {
      const timer = setTimeout(() => {
        console.log("Auto setting authChecked to true after timeout");
        setAuthChecked(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, session, loading, connectionError, authChecked, setAuthChecked]);

  // Fornecer o contexto de autenticação aos filhos
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        connectionError,
        authChecked,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        updatePassword,
        setUser,
        verifyAuthState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
