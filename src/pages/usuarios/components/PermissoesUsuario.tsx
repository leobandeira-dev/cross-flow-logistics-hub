
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
import { systemModules, usersMock } from './permissoes/mockData';

const PermissoesUsuario: React.FC = () => {
  const { toast } = useToast();
  const [selectedUsuario, setSelectedUsuario] = useState<string>("");
  const [selectedPerfil, setSelectedPerfil] = useState<string>("");

  const { 
    permissions, 
    initializePermissions, 
    handlePermissionChange 
  } = usePermissions();

  const {
    customProfiles,
    allProfiles,
    isProfileDialogOpen,
    setIsProfileDialogOpen,
    editingProfile,
    handleSavePerfil,
    handleDeleteProfile,
    handleAddNewProfile,
    handleEditProfile
  } = useProfiles();

  // Initialize permissions when user and profile are selected
  useEffect(() => {
    if (selectedUsuario && selectedPerfil) {
      initializePermissions(selectedPerfil);
    }
  }, [selectedUsuario, selectedPerfil]);

  const handleUsuarioChange = (value: string) => {
    setSelectedUsuario(value);
  };

  const handlePerfilChange = (value: string) => {
    setSelectedPerfil(value);
  };

  const handleSavePermissions = () => {
    // Here you would typically save the permissions to a database
    toast({
      title: "Permissões salvas",
      description: `As permissões para o usuário foram salvas com sucesso.`,
    });
  };

  const getUsuarioName = (id: string) => {
    const usuario = usersMock.find(u => u.id === id);
    return usuario ? `${usuario.nome} (${usuario.email})` : '';
  };

  const combinedProfiles = [
    ...userProfiles.map((p, i) => ({ id: `default-${i}`, nome: p })),
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
          users={usersMock}
          selectedUser={selectedUsuario}
          onUserChange={handleUsuarioChange}
          allProfiles={allProfiles}
        />

        <ProfileSelector
          selectedPerfil={selectedPerfil}
          handlePerfilChange={handlePerfilChange}
          allProfiles={allProfiles}
          customProfiles={combinedProfiles}
          onAddNewProfile={handleAddNewProfile}
          onEditProfile={handleEditProfile}
          onDeleteProfile={handleDeleteProfile}
        />

        {selectedUsuario && selectedPerfil && (
          <>
            <UserPermissionsHeader
              userName={getUsuarioName(selectedUsuario)}
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
                disabled={!selectedUsuario}
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
