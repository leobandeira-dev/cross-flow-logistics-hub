
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuthTabs } from './AuthTabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthCardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  error: string | null;
  success: string | null;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  onForgotPassword: () => void;
  userType: 'cliente' | 'transportador';
}

export const AuthCard = ({
  activeTab,
  setActiveTab,
  error,
  success,
  setError,
  setSuccess,
  onForgotPassword,
  userType
}: AuthCardProps) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="mb-6 w-full max-w-md">
        <Button variant="link" asChild className="p-0">
          <Link to="/" className="flex items-center text-primary">
            <ExternalLink className="mr-2 h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Tabs value={userType} className="w-full">
              <TabsList className="grid grid-cols-2">
                <Link to="/auth?user_type=cliente">
                  <TabsTrigger value="cliente" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Sou Cliente
                  </TabsTrigger>
                </Link>
                <Link to="/auth?user_type=transportador">
                  <TabsTrigger value="transportador" className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Sou Transportador
                  </TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </div>
          <CardTitle className="text-2xl font-bold">
            {userType === 'transportador' ? 'Área do Transportador' : 'Sistema Logístico'}
          </CardTitle>
          <CardDescription>
            {userType === 'transportador' 
              ? 'Faça login ou crie sua conta para solicitar coletas' 
              : 'Faça login ou crie sua conta para continuar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            error={error}
            success={success}
            setError={setError}
            setSuccess={setSuccess}
            onForgotPassword={onForgotPassword}
            userType={userType}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <p className="text-sm text-center text-muted-foreground">
            Ao continuar, você concorda com os termos de serviço e políticas de privacidade.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
