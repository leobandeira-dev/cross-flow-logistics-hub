
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import UsersListTable from './UsersListTable';

interface User {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  cnpj: string;
  perfil: string;
  status: string;
}

interface UsersListTabProps {
  users: User[];
  onViewDetails: (user: User) => void;
}

const UsersListTab: React.FC<UsersListTabProps> = ({ users, onViewDetails }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Users className="mr-2 text-cross-blue" size={20} />
          Listagem de Usuários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UsersListTable users={users} onViewDetails={onViewDetails} />
      </CardContent>
    </Card>
  );
};

export default UsersListTab;
