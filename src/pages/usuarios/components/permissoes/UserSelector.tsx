
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchFilter, { FilterConfig } from '@/components/common/SearchFilter';

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

interface UserSelectorProps {
  users: User[];
  selectedUser: string;
  onUserChange: (value: string) => void;
  allProfiles: string[];
}

const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUser,
  onUserChange,
  allProfiles
}) => {
  const [filteredUsers, setFilteredUsers] = React.useState(users);

  // Filter configs
  const filterConfigs: FilterConfig[] = [
    {
      id: 'perfil',
      label: 'Perfil',
      options: allProfiles.map(profile => ({ id: profile, label: profile }))
    }
  ];

  // Handle search and filtering
  const handleSearch = (term: string, activeFilters?: Record<string, string[]>) => {
    let results = users;
    
    // Apply search term filter
    if (term) {
      const searchLower = term.toLowerCase();
      results = results.filter(usuario => 
        usuario.nome.toLowerCase().includes(searchLower) ||
        usuario.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply perfil filters
    if (activeFilters && activeFilters.perfil && activeFilters.perfil.length > 0) {
      results = results.filter(usuario => activeFilters.perfil.includes(usuario.perfil));
    }
    
    setFilteredUsers(results);
  };

  return (
    <div className="mb-6">
      <Label htmlFor="usuario-search" className="mb-2 block">Buscar Usuário</Label>
      <SearchFilter
        placeholder="Buscar por nome ou email..."
        onSearch={handleSearch}
        filters={filterConfigs}
        className="mb-4"
      />
      
      <Label htmlFor="usuario-select" className="mb-2 block">Selecione o Usuário</Label>
      <Select value={selectedUser} onValueChange={onUserChange}>
        <SelectTrigger id="usuario-select" className="w-full md:w-[400px]">
          <SelectValue placeholder="Selecione um usuário" />
        </SelectTrigger>
        <SelectContent>
          {filteredUsers.map(usuario => (
            <SelectItem key={usuario.id} value={usuario.id}>
              {usuario.nome} - {usuario.email} ({usuario.perfil})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserSelector;
