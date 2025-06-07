
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmpresaLogo = (empresaId?: string) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!empresaId) {
      console.log('🔍 Nenhum ID de empresa fornecido');
      setLogoUrl(null);
      return;
    }

    const fetchLogo = async () => {
      setIsLoading(true);
      try {
        console.log('🔍 Buscando logo para empresa:', empresaId);

        const { data, error } = await supabase
          .from('empresas')
          .select('logo_url')
          .eq('id', empresaId)
          .single();

        if (error) {
          console.error('❌ Erro ao buscar logo:', error);
          setLogoUrl(null);
          return;
        }

        console.log('✅ Logo encontrado:', data?.logo_url);
        setLogoUrl(data?.logo_url || null);

      } catch (error) {
        console.error('💥 Erro inesperado ao buscar logo:', error);
        setLogoUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, [empresaId]);

  // Função para atualizar a URL do logo no estado
  const updateLogoUrl = (newUrl: string | null) => {
    setLogoUrl(newUrl);
  };

  return {
    logoUrl,
    setLogoUrl: updateLogoUrl,
    isLoading
  };
};
