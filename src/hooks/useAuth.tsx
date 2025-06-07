import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  empresa_id?: string;
  funcao?: string;
  telefone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  perfil?: {
    nome: string;
    permissoes?: Record<string, boolean>;
  };
  empresa?: {
    id: string;
    razao_social: string;
    nome_fantasia: string;
    cnpj: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  connectionError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setConnectionError(error.message);
      } else {
        setSession(session);
        if (session?.user) {
          fetchUserProfile(session.user);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
        // Verificar assinatura após login
        if (event === 'SIGNED_IN') {
          setTimeout(() => {
            checkUserSubscription(session);
          }, 1000);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserSubscription = async (userSession: Session) => {
    try {
      await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${userSession.access_token}`,
        },
      });
    } catch (error) {
      console.error('Erro ao verificar assinatura após login:', error);
    }
  };

  const fetchUserProfile = async (authUser: User) => {
    try {
      console.log('🔍 Buscando perfil do usuário:', authUser.email);

      // Buscar dados do perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('perfis')
        .select(`
          id,
          nome,
          email,
          funcao,
          empresa_id,
          created_at,
          updated_at,
          avatar_url,
          ultimo_login,
          empresa:empresas(
            id,
            razao_social,
            nome_fantasia,
            cnpj
          )
        `)
        .eq('id', authUser.id)
        .maybeSingle();

      let finalProfileData = profileData;

      if (profileError || !profileData) {
        console.error('❌ Erro ao buscar perfil:', profileError);
        
        // Se não encontrar o perfil, criar um básico
        const { data: newProfile, error: createError } = await supabase
          .from('perfis')
          .insert({
            id: authUser.id,
            nome: authUser.email?.split('@')[0] || 'Usuário',
            email: authUser.email || '',
            funcao: 'operador'
          })
          .select(`
            id,
            nome,
            email,
            funcao,
            empresa_id,
            created_at,
            updated_at,
            avatar_url,
            ultimo_login
          `)
          .single();

        if (createError) {
          console.error('❌ Erro ao criar perfil:', createError);
          setConnectionError('Erro ao carregar dados do usuário');
          return;
        }

        // Para perfil novo sem empresa, definir finalProfileData sem empresa
        finalProfileData = {
          ...newProfile,
          empresa: null
        };
      }

      console.log('✅ Perfil encontrado:', finalProfileData);

      // Extrair dados da empresa (pode vir como array)
      const empresaData = finalProfileData?.empresa ? (
        Array.isArray(finalProfileData.empresa) 
          ? finalProfileData.empresa[0] 
          : finalProfileData.empresa
      ) : null;

      setUser({
        id: finalProfileData.id,
        email: finalProfileData.email,
        nome: finalProfileData.nome,
        empresa_id: finalProfileData.empresa_id,
        funcao: finalProfileData.funcao,
        telefone: '', // Campo não existe na tabela perfis atual
        avatar_url: finalProfileData.avatar_url,
        created_at: finalProfileData.created_at,
        updated_at: finalProfileData.updated_at,
        perfil: {
          nome: finalProfileData.funcao === 'admin' ? 'admin' : 'operador',
          permissoes: finalProfileData.funcao === 'admin' ? { 'audit:view': true } : {}
        },
        empresa: empresaData
      });

      setConnectionError(null);
    } catch (error) {
      console.error('💥 Erro inesperado ao buscar perfil:', error);
      setConnectionError('Erro de conexão com o banco de dados');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        return { error };
      }

      console.log('✅ Login realizado com sucesso');
      return { error: null };
    } catch (error) {
      console.error('💥 Erro inesperado no login:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        console.error('❌ Erro no registro:', error);
        return { error };
      }

      console.log('✅ Registro realizado com sucesso');
      return { error: null };
    } catch (error) {
      console.error('💥 Erro inesperado no registro:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro no logout:', error);
      } else {
        console.log('✅ Logout realizado com sucesso');
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('💥 Erro inesperado no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error('💥 Erro ao solicitar redefinição de senha:', error);
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      console.error('💥 Erro ao atualizar senha:', error);
      return { error };
    }
  };

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
