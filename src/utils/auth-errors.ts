import { AuthError } from '@supabase/supabase-js';

export function getAuthErrorMessage(error: AuthError | null): string {
  if (!error) return '';

  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email não confirmado. Por favor, verifique sua caixa de entrada',
    'User not found': 'Usuário não encontrado',
    'Invalid email': 'Email inválido',
    'Password is too short': 'A senha deve ter pelo menos 6 caracteres',
    'Email already registered': 'Este email já está registrado',
    'Rate limit exceeded': 'Muitas tentativas. Por favor, aguarde alguns minutos',
    'Network error': 'Erro de conexão. Verifique sua internet',
  };

  // Log the error for debugging
  console.error('[Auth Error]', {
    message: error.message,
    status: error.status,
    name: error.name
  });

  return errorMap[error.message] || 'Erro ao realizar a operação. Tente novamente.';
} 