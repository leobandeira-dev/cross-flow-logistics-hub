
import React, { useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication state hooks
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
  
  // Actions that affect auth state
  const { signIn, signUp, signOut, forgotPassword, updatePassword } = useAuthActions(setLoading, setUser);

  // Method to explicitly verify auth state
  const verifyAuthState = () => {
    if (!authChecked) {
      console.log("Explicitly verifying auth state");
      setAuthChecked(true);
    }
  };

  // Debugging auth state changes
  useEffect(() => {
    console.log('AuthProvider state updated:', { 
      userId: user?.id,
      userEmail: user?.email,
      userName: user?.nome,
      userFunction: user?.funcao,
      hasSession: !!session, 
      loading, 
      connectionError,
      authChecked
    });
  }, [user, session, loading, connectionError, authChecked]);

  // Provide auth context to children
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
