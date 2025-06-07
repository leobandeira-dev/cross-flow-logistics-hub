
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);

  const checkSubscription = async () => {
    if (!user || !session) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      setSubscriptionData(data);
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      toast({
        title: "Erro ao verificar assinatura",
        description: "Não foi possível verificar o status da sua assinatura.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async () => {
    if (!user || !session) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Abrir Stripe checkout em nova aba
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Não foi possível iniciar o processo de pagamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user || !session) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Abrir portal do cliente em nova aba
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      toast({
        title: "Erro ao acessar portal",
        description: "Não foi possível acessar o portal de gerenciamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && session) {
      checkSubscription();
    }
  }, [user, session]);

  return {
    subscriptionData,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    hasAccess: subscriptionData?.subscribed || false,
    isPremium: subscriptionData?.subscription_tier === 'Premium',
  };
};
