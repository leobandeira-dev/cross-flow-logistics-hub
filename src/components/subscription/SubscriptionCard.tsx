
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Settings } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface SubscriptionCardProps {
  showManageButton?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ 
  showManageButton = true 
}) => {
  const { subscriptionData, loading, createCheckout, openCustomerPortal, hasAccess } = useSubscription();

  const features = [
    'Módulo de entrada de nota fiscal',
    'Geração de etiquetas avançada',
    'Exportação de dados em múltiplos formatos',
    'Relatórios personalizados',
    'Suporte prioritário'
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Plano Premium</CardTitle>
        <CardDescription>
          Acesso completo aos recursos avançados
        </CardDescription>
        <div className="text-3xl font-bold">
          R$ 49,90
          <span className="text-sm font-normal text-muted-foreground">/mês</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {hasAccess && subscriptionData && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Ativo
              </Badge>
              <span className="text-sm text-green-700">
                {subscriptionData.subscription_tier}
              </span>
            </div>
            {subscriptionData.subscription_end && (
              <p className="text-xs text-green-600 mt-1">
                Renova em: {new Date(subscriptionData.subscription_end).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        {!hasAccess ? (
          <Button 
            onClick={createCheckout} 
            disabled={loading}
            className="w-full"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {loading ? 'Processando...' : 'Assinar Agora'}
          </Button>
        ) : (
          showManageButton && (
            <Button 
              onClick={openCustomerPortal} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              {loading ? 'Carregando...' : 'Gerenciar Assinatura'}
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};
