
import { useState, useEffect } from 'react';
import { systemModules } from './mockData';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  
  const initializePermissions = (perfil: string) => {
    const initialPermissions: Record<string, boolean> = {};
    
    // Set default permissions based on selected profile
    if (perfil === 'Administrador') {
      // Full access for admin
      systemModules.forEach(module => {
        initialPermissions[`module_${module.id}`] = true;
        
        module.tabelas.forEach(tab => {
          initialPermissions[`tab_${module.id}_${tab.id}`] = true;
          
          tab.rotinas.forEach(routine => {
            initialPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = true;
          });
        });
      });
    } else if (perfil === 'Gerente') {
      // Most access for manager, except some admin functions
      systemModules.forEach(module => {
        initialPermissions[`module_${module.id}`] = true;
        
        module.tabelas.forEach(tab => {
          initialPermissions[`tab_${module.id}_${tab.id}`] = true;
          
          tab.rotinas.forEach(routine => {
            initialPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = true;
          });
        });
      });
    } else {
      // Limited access for other roles
      systemModules.forEach(module => {
        initialPermissions[`module_${module.id}`] = perfil === 'Operador';
        
        module.tabelas.forEach(tab => {
          initialPermissions[`tab_${module.id}_${tab.id}`] = perfil === 'Operador';
          
          tab.rotinas.forEach(routine => {
            initialPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = perfil === 'Operador' && 
              !routine.id.includes('admin');
          });
        });
      });
    }
    
    setPermissions(initialPermissions);
  };

  const handlePermissionChange = (key: string, checked: boolean) => {
    setPermissions(prev => {
      const updated = { ...prev, [key]: checked };
      
      // If it's a module or tab permission, update children accordingly
      if (key.startsWith('module_')) {
        const moduleId = key.replace('module_', '');
        const module = systemModules.find(m => m.id === moduleId);
        
        if (module) {
          module.tabelas.forEach(tab => {
            const tabKey = `tab_${moduleId}_${tab.id}`;
            updated[tabKey] = checked;
            
            tab.rotinas.forEach(routine => {
              const routineKey = `routine_${moduleId}_${tab.id}_${routine.id}`;
              updated[routineKey] = checked;
            });
          });
        }
      } else if (key.startsWith('tab_')) {
        // Extract module and tab IDs
        const [_, moduleId, tabId] = key.split('_');
        const module = systemModules.find(m => m.id === moduleId);
        
        if (module) {
          const tab = module.tabelas.find(t => t.id === tabId);
          if (tab) {
            tab.rotinas.forEach(routine => {
              const routineKey = `routine_${moduleId}_${tabId}_${routine.id}`;
              updated[routineKey] = checked;
            });
          }
        }
      }
      
      return updated;
    });
  };

  return {
    permissions,
    initializePermissions,
    handlePermissionChange
  };
};
