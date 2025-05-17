
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Usuario } from '@/types/supabase.types';

export const useAuthActions = (
  setLoading: (loading: boolean) => void,
  setUser: (user: Usuario | null) => void
) => {
  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('Login attempt with:', email);
      
      // For demonstration, allow any login in frontend-only mode
      const mockUser: Usuario = {
        id: '1',
        email: email,
        nome: email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Update user state
      setUser(mockUser);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      console.log('User logged in:', mockUser);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: error?.message || "Check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string, telefone?: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('Registration attempt with:', email);
      
      // Frontend-only mode registration
      const mockUser: Usuario = {
        id: '1',
        email: email,
        nome: nome,
        telefone: telefone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Store user in localStorage for simulation
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Update user state
      setUser(mockUser);
      
      toast({
        title: "Registration successful",
        description: "Welcome to the system!",
      });
      
      console.log('User registered:', mockUser);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: error?.message || "Check the information provided and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      
      // Remove user from localStorage
      localStorage.removeItem('mockUser');
      
      // Clear user state
      setUser(null);
      
      toast({
        title: "Logged out successfully",
        description: "You have been disconnected from the system.",
      });
      
      console.log('User signed out');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error?.message || "An error occurred while disconnecting.",
        variant: "destructive",
      });
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      // Simulate sending password reset email
      console.log('Password reset request for:', email);
      
      toast({
        title: "Email sent",
        description: "Check your inbox to reset your password.",
      });
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      toast({
        title: "Error requesting reset",
        description: error?.message || "Check the email provided and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      // Simulate password update
      console.log('Updating password');
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Error updating password",
        description: error?.message || "An error occurred while updating your password.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    signIn,
    signUp,
    signOut,
    forgotPassword,
    updatePassword
  };
};
