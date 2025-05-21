
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Import refactored components
import ProfileDialog from './permissoes/ProfileDialog';
import PermissionTable from './permissoes/PermissionTable';
import UserSelector from './permissoes/UserSelector';
import ProfileSelector from './permissoes/ProfileSelector';
import UserPermissionsHeader from './permissoes/UserPermissionsHeader';
import { usePermissions } from './permissoes/usePermissions';
import { useProfiles } from './permissoes/useProfiles';
import { systemModules } from './permissoes/mockData';
import { useUsers } from './permissoes/useUsers';
import { hasPermissionManagement } from '@/services/userService';

const PermissoesUsuario: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  
  // Check if user has permission to manage permissions
  useEffect(() => {
    setHasPermission(hasPermissionManagement(user?.funcao));
  }, [user]);
  
  // Use the custom hook for user data
  const { 
    filteredUsers, 
    selectedUser, 
    handleUserChange, 
    handleUserSearch,
    isLoading,
    allProfiles
  } = useUsers();

  const { 
    permissions, 
    initializePermissions, 
    handlePermissionChange 
  } = usePermissions();

  const {
    customProfiles,
    allProfiles: profilesData,
    isProfileDialogOpen,
    setIsProfileDialogOpen,
    editingProfile,
    handleSavePerfil,
    handleDeleteProfile,
    handleAddNewProfile,
    handleEditProfile,
    selectedPerfil,
    handlePerfilChange
  } = useProfiles();

  // Initialize permissions when user and profile are selected
  useEffect(() => {
    if (selectedUser && selectedPerfil) {
      initializePermissions(selectedPerfil);
    }
  }, [selectedUser, selectedPerfil, initializePermissions]);

  const handleSavePermissions = () => {
    // Here you would typically save the permissions to a database
    if (!hasPermission) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para modificar permissões de usuários.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Permissões salvas",
      description: `As permissões para o usuário foram salvas com sucesso.`,
    });
  };

  const getUsuarioName = (id: string) => {
    const usuario = filteredUsers.find(u => u.id === id);
    return usuario ? `${usuario.nome} (${usuario.email})` : '';
  };

  // Using all available profiles from both sources
  const combinedProfiles = [
    ...profilesData.map((p, i) => ({ id: `default-${i}`, nome: p })),
    ...customProfiles
  ];

  if (!hasPermission && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Settings className="mr-2 text-cross-blue" size={20} />
            Gerenciamento de Permissões por Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50">
            <AlertTriangle className="flex-shrink-0 inline w-5 h-5 mr-3" />
            <span className="font-medium">Acesso restrito!</span> Apenas administradores e gerentes podem gerenciar permissões de usuários.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Settings className="mr-2 text-cross-blue" size={20} />
          Gerenciamento de Permissões por Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserSelector 
          users={filteredUsers}
          selectedUser={selectedUser}
          onUserChange={handleUserChange}
          onSearch={handleUserSearch}
          allProfiles={allProfiles}
          isLoading={isLoading}
        />

        <ProfileSelector
          selectedPerfil={selectedPerfil}
          handlePerfilChange={handlePerfilChange}
          allProfiles={profilesData}
          customProfiles={combinedProfiles}
          onAddNewProfile={handleAddNewProfile}
          onEditProfile={handleEditProfile}
          onDeleteProfile={handleDeleteProfile}
        />

        {selectedUser && selectedPerfil && (
          <>
            <UserPermissionsHeader
              userName={getUsuarioName(selectedUser)}
              profileName={selectedPerfil}
            />

            <PermissionTable
              systemModules={systemModules}
              permissions={permissions}
              handlePermissionChange={handlePermissionChange}
            />
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSavePermissions}
                className="bg-cross-blue hover:bg-cross-blue/90"
                disabled={!selectedUser || !hasPermission}
              >
                <Check size={16} className="mr-2" />
                Salvar Permissões
              </Button>
            </div>
          </>
        )}

        <ProfileDialog 
          onSavePerfil={handleSavePerfil} 
          editingProfile={editingProfile} 
          isOpen={isProfileDialogOpen}
          setIsOpen={setIsProfileDialogOpen}
        />
      </CardContent>
    </Card>
  );
};

export default PermissoesUsuario;
