
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import ProfileSelector from './permissoes/ProfileSelector';
import UserSelector from './permissoes/UserSelector';
import PermissionTable from './permissoes/PermissionTable';
import ManageProfilesDialog from './permissoes/ManageProfilesDialog';
import { usePermissions } from './permissoes/usePermissions';
import { useProfiles } from './permissoes/useProfiles';
import { useUsers } from './permissoes/useUsers';

const PermissoesUsuario: React.FC = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [manageProfilesOpen, setManageProfilesOpen] = useState(false);
  
  const { profiles, isLoadingProfiles } = useProfiles();
  const { users, isLoadingUsers } = useUsers();
  const { 
    permissions, 
    isLoadingPermissions, 
    setPermissions,
    savePermissions,
    isSavingPermissions
  } = usePermissions(selectedProfileId);

  // Fix: Only initialize permissions when the component mounts or when selectedProfileId changes
  // This avoids the infinite update loop
  useEffect(() => {
    // This effect should only run when selectedProfileId changes
    // No need to call any setter functions that would trigger re-renders here
  }, [selectedProfileId]);

  const handleProfileChange = (profileId: string | null) => {
    setSelectedProfileId(profileId);
    // Clear user selection when profile changes
    setSelectedUserId(null);
  };

  const handleUserChange = (userId: string | null) => {
    setSelectedUserId(userId);
  };

  const handlePermissionChange = (moduleId: string, tableId: string, routineId: string, allowed: boolean) => {
    if (!permissions) return;
    
    const updatedPermissions = {...permissions};
    
    if (!updatedPermissions[moduleId]) {
      updatedPermissions[moduleId] = {};
    }
    
    if (!updatedPermissions[moduleId][tableId]) {
      updatedPermissions[moduleId][tableId] = {};
    }
    
    updatedPermissions[moduleId][tableId][routineId] = allowed;
    
    setPermissions(updatedPermissions);
  };

  const handleSavePermissions = async () => {
    if (!selectedProfileId || !permissions) return;
    
    try {
      await savePermissions(selectedProfileId, permissions);
    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Settings className="mr-2 text-cross-blue" size={20} />
          Gerenciamento de Permissões
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ProfileSelector 
            profiles={profiles}
            isLoading={isLoadingProfiles}
            selectedProfileId={selectedProfileId}
            onProfileChange={handleProfileChange}
            onManageProfilesClick={() => setManageProfilesOpen(true)}
          />
          
          <UserSelector 
            users={users}
            isLoading={isLoadingUsers}
            selectedUserId={selectedUserId}
            onUserChange={handleUserChange}
          />
        </div>
        
        <PermissionTable 
          permissions={permissions}
          isLoading={isLoadingPermissions}
          onPermissionChange={handlePermissionChange}
          onSave={handleSavePermissions}
          isSaving={isSavingPermissions}
          disabled={!selectedProfileId}
        />
      </CardContent>
      
      <ManageProfilesDialog 
        open={manageProfilesOpen}
        onOpenChange={setManageProfilesOpen}
      />
    </Card>
  );
};

export default PermissoesUsuario;
