
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { checkSubscription, loading: subLoading } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      toast({
        title: "Assinatura realizada com sucesso!",
        description: "Bem-vindo ao Plano Premium. Seus recursos já estão disponíveis.",
      });
      // Atualizar status da assinatura
      checkSubscription();
    } else if (subscriptionStatus === 'cancel') {
      toast({
        title: "Assinatura cancelada",
        description: "Você cancelou o processo de assinatura.",
        variant: "destructive",
      });
    }
  }, [searchParams, checkSubscription]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout title="Assinatura Premium">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Planos e Assinatura</h1>
          <p className="text-muted-foreground">
            Desbloqueie recursos avançados com nosso Plano Premium
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <SubscriptionCard />
        </div>

        <div className="text-center">
          <Button 
            onClick={checkSubscription} 
            disabled={subLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {subLoading ? 'Verificando...' : 'Verificar Status da Assinatura'}
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Sua assinatura será processada de forma segura através do Stripe.
            <br />
            Você pode cancelar a qualquer momento através do portal de gerenciamento.
          </p>
        </div>
    </div>
  );
};

export default SubscriptionPage;
