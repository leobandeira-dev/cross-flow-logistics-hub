
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define types for our modules and permissions
interface Permission {
  id: string;
  name: string;
}

interface Module {
  id: string;
  name: string;
  tabs: Tab[];
}

interface Tab {
  id: string;
  name: string;
  routines: Routine[];
}

interface Routine {
  id: string;
  name: string;
}

// Mock data for system modules, tabs, and routines
const systemModules: Module[] = [
  {
    id: 'armazenagem',
    name: 'Armazenagem',
    tabs: [
      {
        id: 'recebimento',
        name: 'Recebimento',
        routines: [
          { id: 'notas', name: 'Entrada de Notas' },
          { id: 'fornecedor', name: 'Recebimento de Fornecedor' },
          { id: 'filiais', name: 'Recebimento de Filiais' },
          { id: 'coleta', name: 'Recebimento de Coleta' },
          { id: 'etiquetas', name: 'Geração de Etiquetas' },
        ]
      },
      {
        id: 'movimentacoes',
        name: 'Movimentações',
        routines: [
          { id: 'enderecamento', name: 'Enderecamento' },
          { id: 'unitizacao', name: 'Unitização de Paletes' },
          { id: 'movinternas', name: 'Movimentações Internas' },
        ]
      },
      {
        id: 'carregamento',
        name: 'Carregamento',
        routines: [
          { id: 'ordemcar', name: 'Ordem de Carregamento' },
          { id: 'enderecamcaminhao', name: 'Enderecamento de Caminhão' },
          { id: 'conferencia', name: 'Conferência de Carga' },
          { id: 'checklist', name: 'Checklist de Carga' },
        ]
      },
    ]
  },
  {
    id: 'coletas',
    name: 'Coletas',
    tabs: [
      {
        id: 'solicitacoes',
        name: 'Solicitações de Coleta',
        routines: [
          { id: 'novasol', name: 'Nova Solicitação' },
          { id: 'consulta', name: 'Consultar Solicitações' },
        ]
      },
      {
        id: 'aprovacoes',
        name: 'Aprovações de Coleta',
        routines: [
          { id: 'aprovar', name: 'Aprovar Coletas' },
          { id: 'historico', name: 'Histórico de Aprovações' },
        ]
      },
      {
        id: 'alocacao',
        name: 'Alocação de Cargas',
        routines: [
          { id: 'alocar', name: 'Alocar Cargas' },
          { id: 'consultar', name: 'Consultar Alocações' },
        ]
      },
    ]
  },
  {
    id: 'usuarios',
    name: 'Usuários',
    tabs: [
      {
        id: 'cadastro',
        name: 'Cadastro de Usuários',
        routines: [
          { id: 'novo', name: 'Novo Cadastro' },
          { id: 'aprovacoes', name: 'Aprovações Pendentes' },
          { id: 'listagem', name: 'Listagem de Usuários' },
          { id: 'permissoes', name: 'Gerenciar Permissões' },
        ]
      }
    ]
  },
  {
    id: 'motoristas',
    name: 'Motoristas',
    tabs: [
      {
        id: 'cadastro',
        name: 'Cadastro de Motoristas',
        routines: [
          { id: 'novo', name: 'Novo Motorista' },
          { id: 'listar', name: 'Listar Motoristas' },
        ]
      },
      {
        id: 'cargas',
        name: 'Cargas de Motoristas',
        routines: [
          { id: 'ativas', name: 'Cargas Ativas' },
          { id: 'historico', name: 'Histórico de Cargas' },
        ]
      }
    ]
  },
];

// Available user profiles
const profiles = [
  "Cliente",
  "Fornecedor externo",
  "Funcionário Operacional",
  "Funcionário Supervisor",
  "Administrador"
];

const PermissoesUsuario: React.FC = () => {
  const { toast } = useToast();
  const [selectedProfile, setSelectedProfile] = useState<string>("Administrador");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  // Initialize permissions with all true for Administrador profile
  React.useEffect(() => {
    if (selectedProfile === "Administrador") {
      const allPermissions: Record<string, boolean> = {};
      
      systemModules.forEach(module => {
        // Module level permission
        allPermissions[`module_${module.id}`] = true;
        
        module.tabs.forEach(tab => {
          // Tab level permission
          allPermissions[`tab_${module.id}_${tab.id}`] = true;
          
          tab.routines.forEach(routine => {
            // Routine level permission
            allPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = true;
          });
        });
      });
      
      setPermissions(allPermissions);
    } else if (selectedProfile === "Funcionário Supervisor") {
      // Example: Supervisors have access to most features except some administrative ones
      const supervisorPermissions: Record<string, boolean> = {};
      
      systemModules.forEach(module => {
        // Give access to most modules
        supervisorPermissions[`module_${module.id}`] = true;
        
        module.tabs.forEach(tab => {
          supervisorPermissions[`tab_${module.id}_${tab.id}`] = true;
          
          tab.routines.forEach(routine => {
            // Restrict certain administrative functions
            if (module.id === 'usuarios' && tab.id === 'cadastro' && routine.id === 'permissoes') {
              supervisorPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = false;
            } else {
              supervisorPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = true;
            }
          });
        });
      });
      
      setPermissions(supervisorPermissions);
    } else {
      // For other profiles, start with more restricted permissions
      setPermissions({});
    }
  }, [selectedProfile]);

  const handleProfileChange = (value: string) => {
    setSelectedProfile(value);
  };

  const handlePermissionChange = (key: string, checked: boolean) => {
    setPermissions(prev => {
      const updated = { ...prev, [key]: checked };
      
      // If it's a module or tab permission, update children accordingly
      if (key.startsWith('module_')) {
        const moduleId = key.replace('module_', '');
        const module = systemModules.find(m => m.id === moduleId);
        
        if (module) {
          module.tabs.forEach(tab => {
            const tabKey = `tab_${moduleId}_${tab.id}`;
            updated[tabKey] = checked;
            
            tab.routines.forEach(routine => {
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
          const tab = module.tabs.find(t => t.id === tabId);
          if (tab) {
            tab.routines.forEach(routine => {
              const routineKey = `routine_${moduleId}_${tabId}_${routine.id}`;
              updated[routineKey] = checked;
            });
          }
        }
      }
      
      return updated;
    });
  };

  const handleSavePermissions = () => {
    // Here you would typically save the permissions to a database
    // For this demo, we'll just show a success message
    toast({
      title: "Permissões salvas",
      description: `As permissões para o perfil "${selectedProfile}" foram salvas com sucesso.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Settings className="mr-2 text-cross-blue" size={20} />
          Gerenciamento de Permissões por Perfil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="profile-select">Selecione o Perfil</Label>
          <Select value={selectedProfile} onValueChange={handleProfileChange}>
            <SelectTrigger id="profile-select" className="w-full md:w-[300px]">
              <SelectValue placeholder="Selecione um perfil" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map(profile => (
                <SelectItem key={profile} value={profile}>
                  {profile}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left font-medium">Módulo / Aba / Rotina</th>
                <th className="px-4 py-2 text-center w-24 font-medium">Acesso</th>
              </tr>
            </thead>
            <tbody>
              {systemModules.map(module => (
                <React.Fragment key={module.id}>
                  {/* Module row */}
                  <tr className="bg-gray-50 hover:bg-gray-100 border-b">
                    <td className="px-4 py-3 font-medium">
                      {module.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        id={`module_${module.id}`}
                        checked={permissions[`module_${module.id}`] || false}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(`module_${module.id}`, checked === true)
                        }
                      />
                    </td>
                  </tr>
                  
                  {/* Tab rows */}
                  {module.tabs.map(tab => (
                    <React.Fragment key={`${module.id}_${tab.id}`}>
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="px-4 py-2 pl-8">
                          {tab.name}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Checkbox
                            id={`tab_${module.id}_${tab.id}`}
                            checked={permissions[`tab_${module.id}_${tab.id}`] || false}
                            disabled={!permissions[`module_${module.id}`]}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(`tab_${module.id}_${tab.id}`, checked === true)
                            }
                          />
                        </td>
                      </tr>
                      
                      {/* Routine rows */}
                      {tab.routines.map(routine => (
                        <tr key={`${module.id}_${tab.id}_${routine.id}`} className="hover:bg-gray-50 border-b">
                          <td className="px-4 py-2 pl-12 text-sm">
                            {routine.name}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <Checkbox
                              id={`routine_${module.id}_${tab.id}_${routine.id}`}
                              checked={permissions[`routine_${module.id}_${tab.id}_${routine.id}`] || false}
                              disabled={!permissions[`tab_${module.id}_${tab.id}`]}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(`routine_${module.id}_${tab.id}_${routine.id}`, checked === true)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSavePermissions}
            className="bg-cross-blue hover:bg-cross-blue/90"
          >
            <Check size={16} className="mr-2" />
            Salvar Permissões
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissoesUsuario;
