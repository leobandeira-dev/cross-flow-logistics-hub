import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

class ApiInterceptor {
  private static instance: ApiInterceptor;
  private errorHandlers: ((error: ApiError) => void)[] = [];

  private constructor() {
    this.setupSupabaseErrorHandling();
  }

  public static getInstance(): ApiInterceptor {
    if (!ApiInterceptor.instance) {
      ApiInterceptor.instance = new ApiInterceptor();
    }
    return ApiInterceptor.instance;
  }

  private setupSupabaseErrorHandling() {
    // Interceptar erros do Supabase
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
    });
  }

  public addErrorHandler(handler: (error: ApiError) => void) {
    this.errorHandlers.push(handler);
  }

  public handleError(error: ApiError) {
    console.error('API Error:', error);

    // Tratamento padrão de erros
    switch (error.status) {
      case 401:
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        // Redirecionar para login
        window.location.href = '/auth/login';
        break;
      
      case 403:
        toast.error('Você não tem permissão para realizar esta ação.');
        break;
      
      case 404:
        toast.error('Recurso não encontrado.');
        break;
      
      case 422:
        toast.error('Dados inválidos. Verifique as informações e tente novamente.');
        break;
      
      case 429:
        toast.error('Muitas requisições. Por favor, aguarde um momento.');
        break;
      
      case 500:
      case 502:
      case 503:
        toast.error('Erro no servidor. Tente novamente mais tarde.');
        break;
      
      default:
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
    }

    // Executar handlers customizados
    this.errorHandlers.forEach(handler => handler(error));
  }

  public async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const session = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session available');
      }

      const response = await fetch(`${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });

      if (!response.ok) {
        const error: ApiError = new Error('API request failed');
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      this.handleError(error as ApiError);
      throw error;
    }
  }

  // Métodos auxiliares para requisições comuns
  public async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  public async post<T>(endpoint: string, data: any, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }

  public async put<T>(endpoint: string, data: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  public async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }
}

export const api = ApiInterceptor.getInstance(); 