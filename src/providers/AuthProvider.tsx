
import React, { useEffect, useState, useCallback, useRef } from 'react';
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

  // For preventing multiple verifications
  const verificationAttempted = useRef(false);

  // Method to explicitly verify auth state
  const verifyAuthState = useCallback(() => {
    if (!authChecked && !loading && !verificationAttempted.current) {
      console.log("Explicitly verifying auth state");
      verificationAttempted.current = true;
      setAuthChecked(true);
    }
  }, [authChecked, loading, setAuthChecked]);

  // Debugging auth state changes
  useEffect(() => {
    console.log('AuthProvider state updated:', { 
      user: !!user, 
      session: !!session, 
      loading, 
      connectionError,
      authChecked
    });
  }, [user, session, loading, connectionError, authChecked]);

  // Auto-verification after initialization completes
  useEffect(() => {
    if (!authChecked && !loading && !verificationAttempted.current) {
      const timer = setTimeout(() => {
        console.log("Auto setting authChecked to true after initialization completed");
        verificationAttempted.current = true;
        setAuthChecked(true);
      }, 800); // Increased timeout to ensure all listeners are set up
      
      return () => clearTimeout(timer);
    }
  }, [user, session, loading, authChecked, setAuthChecked]);

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
