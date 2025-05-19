
import { supabase } from "@/integrations/supabase/client";
import { SignUpCredentials } from "./authTypes";

/**
 * Serviço para operações de registro
 */
const registrationService = {
  /**
   * Cadastra um novo usuário
   */
  async signUp(credentials: SignUpCredentials) {
    console.log('RegistrationService: Cadastrando usuário com:', credentials.email, 'função:', credentials.funcao);
    
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          nome: credentials.nome,
          telefone: credentials.telefone,
          cnpj: credentials.cnpj, 
          funcao: credentials.funcao || 'operador',
          cnpj_transportadora: credentials.cnpj_transportadora
        },
        emailRedirectTo: `${window.location.origin}/auth?confirmed=true`
      }
    });

    if (error) {
      console.error('RegistrationService: Erro ao cadastrar:', error);
      throw error;
    }

    return {
      user: data.user,
      session: data.session
    };
  },
};

export default registrationService;
