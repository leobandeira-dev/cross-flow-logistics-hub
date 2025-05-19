
import React, { useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // First, establish the state management hooks
  const { user, session, loading, setLoading, setUser, connectionError } = useAuthState();
  
  // Then, set up actions that use the state setters
  const { signIn, signUp, signOut, forgotPassword, updatePassword } = useAuthActions(setLoading, setUser);

  // Log the authentication state when it changes
  useEffect(() => {
    console.log('AuthProvider state updated:', { 
      user: !!user, 
      session: !!session, 
      loading, 
      connectionError 
    });
  }, [user, session, loading, connectionError]);

  // Provide the authentication context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        connectionError,
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
