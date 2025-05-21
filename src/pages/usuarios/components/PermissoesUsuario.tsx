
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

const PermissoesUsuario: React.FC = () => {
  const { toast } = useToast();
  
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
                disabled={!selectedUser}
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
