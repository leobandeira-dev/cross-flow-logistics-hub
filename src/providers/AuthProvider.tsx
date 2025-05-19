
import React, { useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primeiro, estabelecer os hooks de gerenciamento de estado
  const { user, session, loading, setLoading, setUser, connectionError, authChecked } = useAuthState();
  
  // Em seguida, configurar ações que usam os setters de estado
  const { signIn, signUp, signOut, forgotPassword, updatePassword } = useAuthActions(setLoading, setUser);

  // Registrar o estado de autenticação quando ele muda
  useEffect(() => {
    console.log('AuthProvider state updated:', { 
      user: !!user, 
      session: !!session, 
      loading, 
      connectionError,
      authChecked
    });
  }, [user, session, loading, connectionError, authChecked]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
