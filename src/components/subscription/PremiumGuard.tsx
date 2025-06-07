
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

interface PremiumGuardProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
}

export const PremiumGuard: React.FC<PremiumGuardProps> = ({ 
  children, 
  feature, 
  description 
}) => {
  const { hasAccess, createCheckout, loading } = useSubscription();
  const navigate = useNavigate();

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-amber-100 rounded-full">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
        <CardTitle className="flex items-center gap-2 justify-center">
          <Lock className="h-5 w-5" />
          Recurso Premium
        </CardTitle>
        <CardDescription>
          {description || `O recurso "${feature}" está disponível apenas para assinantes Premium.`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Desbloqueie este recurso:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✓ Entrada de notas fiscais</li>
            <li>✓ Geração de etiquetas avançada</li>
            <li>✓ Exportação de dados</li>
            <li>✓ Relatórios personalizados</li>
          </ul>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={createCheckout} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Processando...' : 'Assinar por R$ 49,90/mês'}
          </Button>
          <Button 
            onClick={() => navigate('/subscription')} 
            variant="outline"
          >
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
