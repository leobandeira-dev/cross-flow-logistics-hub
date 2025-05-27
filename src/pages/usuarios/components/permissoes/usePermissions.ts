
import { useState, useEffect } from 'react';

type Permission = Record<string, Record<string, Record<string, boolean>>>;

export const usePermissions = (profileId: string | null) => {
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  useEffect(() => {
    // Only attempt to fetch permissions if we have a profileId
    if (profileId) {
      fetchPermissions(profileId);
    } else {
      // Reset permissions when profileId is null
      setPermissions(null);
    }
  }, [profileId]);

  const fetchPermissions = async (profileId: string) => {
    setIsLoadingPermissions(true);
    try {
      // This is a mock implementation. In a real app, you would call your API here.
      // For testing, let's simulate an API call with a timeout
      setTimeout(() => {
        // Mock permission data
        const mockPermissions: Permission = {
          'mod1': {
            'tab1': {
              'view': true,
              'edit': false,
              'delete': false
            },
            'tab2': {
              'view': true,
              'edit': true,
              'delete': false
            }
          },
          'mod2': {
            'tab3': {
              'view': true,
              'edit': false,
              'delete': false
            }
          }
        };
        
        setPermissions(mockPermissions);
        setIsLoadingPermissions(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setIsLoadingPermissions(false);
    }
  };

  const savePermissions = async (profileId: string, permissions: Permission) => {
    setIsSavingPermissions(true);
    try {
      // This is a mock implementation. In a real app, you would call your API here.
      // For testing, let's simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Permissions saved for profile:', profileId, permissions);
      setIsSavingPermissions(false);
      return true;
    } catch (error) {
      console.error('Error saving permissions:', error);
      setIsSavingPermissions(false);
      throw error;
    }
  };

  return {
    permissions,
    isLoadingPermissions,
    setPermissions,
    savePermissions,
    isSavingPermissions
  };
};
