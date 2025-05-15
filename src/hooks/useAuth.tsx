
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

// Extended user type to include role
interface ExtendedUser extends User {
  role?: 'admin' | 'user' | 'moderator';
}

type AuthContextType = {
  session: Session | null;
  user: ExtendedUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar o listener de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        // Add role information to user object
        // In a real application, you would fetch this from your user_roles table
        if (session?.user) {
          const userWithRole: ExtendedUser = {
            ...session.user,
            role: session.user.email?.includes('admin') ? 'admin' : 'user'
          };
          setUser(userWithRole);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // DEPOIS verificar a sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      // Add role information to user object
      if (session?.user) {
        const userWithRole: ExtendedUser = {
          ...session.user,
          role: session.user.email?.includes('admin') ? 'admin' : 'user'
        };
        setUser(userWithRole);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
