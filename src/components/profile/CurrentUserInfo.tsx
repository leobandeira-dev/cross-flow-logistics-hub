
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, BadgeCheck, Building } from 'lucide-react';

const CurrentUserInfo = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Carregando dados do usuário...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Usuário não autenticado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Por favor, faça login para visualizar suas informações.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Define avatar initials from user name
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Format role for display
  const formatRole = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'operador': return 'Operador';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5 text-primary" />
          Informações do Usuário Atual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="h-24 w-24">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.nome} />
            ) : (
              <AvatarFallback className="text-xl">{getInitials(user.nome)}</AvatarFallback>
            )}
          </Avatar>
          
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <h3 className="text-2xl font-medium">{user.nome}</h3>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-muted-foreground">
                <BadgeCheck className="mr-1 h-4 w-4" />
                <span>{formatRole(user.funcao)}</span>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              
              {user.telefone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.telefone}</span>
                </div>
              )}
              
              {user.empresa_id && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>ID da Empresa: {user.empresa_id}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Conta criada em: {new Date(user.created_at).toLocaleDateString()}</p>
              {user.updated_at && (
                <p>Última atualização: {new Date(user.updated_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentUserInfo;
