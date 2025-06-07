import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, ROLE_HIERARCHY, DEFAULT_ROLE_PERMISSIONS } from '@/types/auth.types';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  hasPermission: (permission: string) => boolean;
  hasRole: (requiredRole: UserRole) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Função para carregar as permissões do usuário
  const loadUserPermissions = useCallback(async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Determinar o role do usuário
      const role = profile.funcao?.toUpperCase() as UserRole || 'VISITANTE';
      
      // Combinar permissões padrão do role com permissões customizadas
      const defaultPerms = DEFAULT_ROLE_PERMISSIONS[role] || [];
      const customPerms = profile.permissions || [];
      
      return {
        id: userId,
        email: profile.email,
        role,
        permissions: [...new Set([...defaultPerms, ...customPerms])]
      };
    } catch (err) {
      console.error('Error loading user permissions:', err);
      throw err;
    }
  }, []);

  // Efeito para monitorar mudanças na sessão
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setLoading(true);
          
          if (event === 'SIGNED_IN' && session?.user) {
            const userData = await loadUserPermissions(session.user.id);
            setUser(userData);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
          setLoading(false);
        }
      }
    );

    // Carregar sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session?.user) {
          const userData = await loadUserPermissions(session.user.id);
          setUser(userData);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserPermissions]);

  // Verificar se o usuário tem uma permissão específica
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    
    // Admin tem todas as permissões
    if (user.role === 'ADMIN' || user.permissions.includes('*')) {
      return true;
    }

    return user.permissions.includes(permission);
  }, [user]);

  // Verificar se o usuário tem um role específico ou superior
  const hasRole = useCallback((requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
    const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  }, [user]);

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign in'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    hasPermission,
    hasRole,
    signIn,
    signOut
  };
}; 