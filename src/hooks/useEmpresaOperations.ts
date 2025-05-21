
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Empresa } from '@/pages/empresas/types/empresa.types';

export const useEmpresaOperations = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const cadastrarEmpresa = async (dadosEmpresa: Partial<Empresa>) => {
    setIsLoading(true);

    try {
      // Verificar se o CNPJ já existe - garantindo que seja feito apenas se o CNPJ estiver preenchido
      if (dadosEmpresa.cnpj) {
        const cnpjLimpo = dadosEmpresa.cnpj.replace(/\D/g, '');
        
        const { data: empresaExistente } = await supabase
          .from('empresas')
          .select('id')
          .eq('cnpj', cnpjLimpo)
          .maybeSingle();

        if (empresaExistente) {
          toast({
            title: 'CNPJ já cadastrado',
            description: 'Uma empresa com este CNPJ já existe no sistema.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return false;
        }
      } else {
        toast({
          title: 'CNPJ obrigatório',
          description: 'O CNPJ é obrigatório para cadastrar uma empresa.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      // Preparar dados para inserção
      const empresaData = {
        ...dadosEmpresa,
        // Limpa formatação do CNPJ antes de salvar
        cnpj: dadosEmpresa.cnpj ? dadosEmpresa.cnpj.replace(/\D/g, '') : null,
        // Limpa formatação do CEP antes de salvar
        cep: dadosEmpresa.cep ? dadosEmpresa.cep.replace(/\D/g, '') : null,
        // Garante que o status seja 'ativo' para novos cadastros
        status: 'ativo',
        // Por padrão, definimos como 'Cliente' se não especificado
        tipo: dadosEmpresa.tipo || 'Cliente',
        // Define o perfil conforme selecionado no formulário
        perfil: dadosEmpresa.perfil,
        // Define se é transportadora principal
        transportadoraPrincipal: dadosEmpresa.transportadoraPrincipal || false,
      };

      const { data, error } = await supabase
        .from('empresas')
        .insert(empresaData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Empresa cadastrada com sucesso',
        description: `${dadosEmpresa.razaoSocial} foi cadastrada com sucesso.`,
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Erro ao cadastrar empresa:', error);
      toast({
        title: 'Erro ao cadastrar empresa',
        description: error.message || 'Não foi possível cadastrar a empresa. Tente novamente.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  };

  return {
    cadastrarEmpresa,
    isLoading,
  };
};
