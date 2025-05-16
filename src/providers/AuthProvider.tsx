
import React from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, setLoading, setUser } = useAuthState();
  const { signIn, signUp, signOut, forgotPassword, updatePassword } = useAuthActions(setLoading, setUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
