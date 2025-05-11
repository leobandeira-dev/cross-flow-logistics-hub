import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Check, Search, Plus, Pencil } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ModuloEmpresa, PerfilEmpresa } from '../types/empresa.types';
import SearchFilter from '@/components/common/SearchFilter';
import { FilterConfig } from '@/components/common/SearchFilter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Similar to user permissions, adapted for companies
const systemModules: ModuloEmpresa[] = [
  {
    id: 'armazenagem',
    nome: 'Armazenagem',
    tabelas: [
      {
        id: 'recebimento',
        nome: 'Recebimento',
        rotinas: [
          { id: 'notas', nome: 'Entrada de Notas' },
          { id: 'fornecedor', nome: 'Recebimento de Fornecedor' },
          { id: 'filiais', nome: 'Recebimento de Filiais' },
          { id: 'coleta', nome: 'Recebimento de Coleta' },
          { id: 'etiquetas', nome: 'Geração de Etiquetas' },
        ]
      },
      {
        id: 'movimentacoes',
        nome: 'Movimentações',
        rotinas: [
          { id: 'enderecamento', nome: 'Enderecamento' },
          { id: 'unitizacao', nome: 'Unitização de Paletes' },
          { id: 'movinternas', nome: 'Movimentações Internas' },
        ]
      },
      {
        id: 'carregamento',
        nome: 'Carregamento',
        rotinas: [
          { id: 'ordemcar', nome: 'Ordem de Carregamento' },
          { id: 'enderecamcaminhao', nome: 'Enderecamento de Caminhão' },
          { id: 'conferencia', nome: 'Conferência de Carga' },
          { id: 'checklist', nome: 'Checklist de Carga' },
        ]
      },
    ]
  },
  {
    id: 'coletas',
    nome: 'Coletas',
    tabelas: [
      {
        id: 'solicitacoes',
        nome: 'Solicitações de Coleta',
        rotinas: [
          { id: 'novasol', nome: 'Nova Solicitação' },
          { id: 'consulta', nome: 'Consultar Solicitações' },
        ]
      },
      {
        id: 'aprovacoes',
        nome: 'Aprovações de Coleta',
        rotinas: [
          { id: 'aprovar', nome: 'Aprovar Coletas' },
          { id: 'historico', nome: 'Histórico de Aprovações' },
        ]
      },
      {
        id: 'alocacao',
        nome: 'Alocação de Cargas',
        rotinas: [
          { id: 'alocar', nome: 'Alocar Cargas' },
          { id: 'consultar', nome: 'Consultar Alocações' },
        ]
      },
    ]
  },
  {
    id: 'empresas',
    nome: 'Empresas',
    tabelas: [
      {
        id: 'cadastro',
        nome: 'Cadastro de Empresas',
        rotinas: [
          { id: 'novo', nome: 'Nova Empresa' },
          { id: 'listagem', nome: 'Listagem de Empresas' },
          { id: 'permissoes', nome: 'Gerenciar Permissões' },
        ]
      }
    ]
  },
  {
    id: 'motoristas',
    nome: 'Motoristas',
    tabelas: [
      {
        id: 'cadastro',
        nome: 'Cadastro de Motoristas',
        rotinas: [
          { id: 'novo', nome: 'Novo Motorista' },
          { id: 'listar', nome: 'Listar Motoristas' },
        ]
      },
      {
        id: 'cargas',
        nome: 'Cargas de Motoristas',
        rotinas: [
          { id: 'ativas', nome: 'Cargas Ativas' },
          { id: 'historico', nome: 'Histórico de Cargas' },
        ]
      }
    ]
  },
];

// Company profiles - Updated terminology as requested
const profiles = [
  "Transportadora",
  "Filial",
  "Cliente",
  "Fornecedor"
];

// Mock companies for select
const empresasMock = [
  { id: "1", nome: "Transportes Rápidos Ltda", cnpj: "12.345.678/0001-90", perfil: "Transportadora" },
  { id: "2", nome: "Filial SP Transportes", cnpj: "12.345.678/0002-71", perfil: "Filial" },
  { id: "3", nome: "Indústria ABC S.A.", cnpj: "45.678.901/0001-23", perfil: "Cliente" },
  { id: "4", nome: "Fornecedor XYZ S.A.", cnpj: "56.789.012/0001-34", perfil: "Fornecedor" },
];

const ProfileDialog = ({ 
  onSavePerfil, 
  editingProfile = null, 
  isOpen,
  setIsOpen
}: { 
  onSavePerfil: (nome: string, descricao: string, id?: string) => void, 
  editingProfile?: { id: string, nome: string, descricao?: string } | null,
  isOpen: boolean,
  setIsOpen: (open: boolean) => void
}) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (editingProfile) {
      setNome(editingProfile.nome);
      setDescricao(editingProfile.descricao || '');
    } else {
      setNome('');
      setDescricao('');
    }
  }, [editingProfile, isOpen]);

  const handleSubmit = () => {
    if (!nome) {
      toast({
        title: "Erro",
        description: "Nome do perfil é obrigatório",
        variant: "destructive"
      });
      return;
    }

    onSavePerfil(nome, descricao, editingProfile?.id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingProfile ? 'Editar Perfil de Empresa' : 'Adicionar Novo Perfil de Empresa'}</DialogTitle>
          <DialogDescription>
            {editingProfile ? 'Edite as informações do perfil existente.' : 'Crie um novo perfil para categorizar as empresas do sistema.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Perfil</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Prestador de Serviços" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Input id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição do perfil" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} className="bg-cross-blue hover:bg-cross-blue/90">
            {editingProfile ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ManageProfilesDialog = ({ 
  profiles, 
  onEditProfile, 
  onDeleteProfile 
}: { 
  profiles: Array<{ id: string, nome: string, descricao?: string }>, 
  onEditProfile: (profile: any) => void,
  onDeleteProfile: (id: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          Gerenciar Perfis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Perfis de Empresa</DialogTitle>
          <DialogDescription>
            Visualize, edite ou exclua os perfis de empresa existentes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.nome}</TableCell>
                  <TableCell>{profile.descricao || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        onEditProfile(profile);
                        setIsOpen(false);
                      }}
                    >
                      <Pencil size={16} className="mr-1" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o perfil "{profile.nome}"?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                              onDeleteProfile(profile.id);
                              setIsOpen(false);
                            }}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PermissoesEmpresa: React.FC = () => {
  const { toast } = useToast();
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("");
  const [selectedPerfil, setSelectedPerfil] = useState<string>("Transportadora");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [filteredEmpresas, setFilteredEmpresas] = useState(empresasMock);
  const [customProfiles, setCustomProfiles] = useState<Array<{ id: string, nome: string, descricao?: string }>>([]);
  const [allProfiles, setAllProfiles] = useState<string[]>(profiles);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<{ id: string, nome: string, descricao?: string } | null>(null);
  
  // Search filter config
  const filterConfigs: FilterConfig[] = [
    {
      id: 'perfil',
      label: 'Perfil',
      options: allProfiles.map(profile => ({ id: profile, label: profile }))
    }
  ];

  // Update all profiles when custom profiles change
  useEffect(() => {
    setAllProfiles([...profiles, ...customProfiles.map(p => p.nome)]);
  }, [customProfiles]);

  // Initialize permissions based on company and profile selection
  React.useEffect(() => {
    if (selectedEmpresa && selectedPerfil) {
      const initialPermissions: Record<string, boolean> = {};
      
      // Default all permissions to true for Transportadora
      if (selectedPerfil === "Transportadora") {
        systemModules.forEach(module => {
          initialPermissions[`module_${module.id}`] = true;
          
          module.tabelas.forEach(tab => {
            initialPermissions[`tab_${module.id}_${tab.id}`] = true;
            
            tab.rotinas.forEach(routine => {
              initialPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = true;
            });
          });
        });
      } 
      // For Filial, give access to most features except some administrative ones
      else if (selectedPerfil === "Filial") {
        systemModules.forEach(module => {
          initialPermissions[`module_${module.id}`] = true;
          
          module.tabelas.forEach(tab => {
            // Exclude permissions management
            if (module.id === 'empresas' && tab.id === 'cadastro') {
              initialPermissions[`tab_${module.id}_${tab.id}`] = false;
            } else {
              initialPermissions[`tab_${module.id}_${tab.id}`] = true;
            }
            
            tab.rotinas.forEach(routine => {
              if (module.id === 'empresas' && tab.id === 'cadastro') {
                initialPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = false;
              } else {
                initialPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = true;
              }
            });
          });
        });
      }
      // For clients, provide limited access
      else {
        systemModules.forEach(module => {
          if (module.id === 'coletas') {
            initialPermissions[`module_${module.id}`] = true;
            
            module.tabelas.forEach(tab => {
              if (tab.id === 'solicitacoes') {
                initialPermissions[`tab_${module.id}_${tab.id}`] = true;
                
                tab.rotinas.forEach(routine => {
                  initialPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = true;
                });
              } else {
                initialPermissions[`tab_${module.id}_${tab.id}`] = false;
                
                tab.rotinas.forEach(routine => {
                  initialPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = false;
                });
              }
            });
          } else {
            initialPermissions[`module_${module.id}`] = false;
            
            module.tabelas.forEach(tab => {
              initialPermissions[`tab_${module.id}_${tab.id}`] = false;
              
              tab.rotinas.forEach(routine => {
                initialPermissions[`routine_${module.id}_${tab.id}_${routine.id}`] = false;
              });
            });
          }
        });
      }
      
      setPermissions(initialPermissions);
    }
  }, [selectedEmpresa, selectedPerfil]);

  const handleEmpresaChange = (value: string) => {
    setSelectedEmpresa(value);
  };

  const handlePerfilChange = (value: string) => {
    setSelectedPerfil(value);
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

  const handleSavePermissions = () => {
    // Here you would typically save the permissions to a database
    toast({
      title: "Permissões salvas",
      description: `As permissões para a empresa foram salvas com sucesso.`,
    });
  };

  const getEmpresaName = (id: string) => {
    const empresa = empresasMock.find(e => e.id === id);
    return empresa ? `${empresa.nome} (${empresa.cnpj})` : '';
  };

  // Handle adding or editing a profile
  const handleSavePerfil = (nome: string, descricao: string, id?: string) => {
    if (id) {
      // Edit existing profile
      setCustomProfiles(prev => prev.map(p => 
        p.id === id ? { ...p, nome, descricao } : p
      ));
      toast({
        title: "Perfil atualizado",
        description: `O perfil "${nome}" foi atualizado com sucesso.`,
      });
    } else {
      // Add new profile
      const newId = `custom-${Date.now()}`;
      setCustomProfiles(prev => [...prev, { id: newId, nome, descricao }]);
      toast({
        title: "Perfil adicionado",
        description: `O perfil "${nome}" foi adicionado com sucesso.`,
      });
    }
  };

  // Handle deleting a profile
  const handleDeleteProfile = (id: string) => {
    setCustomProfiles(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Perfil excluído",
      description: `O perfil foi excluído com sucesso.`,
    });
  };

  // Open dialog to add new profile
  const handleAddNewProfile = () => {
    setEditingProfile(null);
    setIsProfileDialogOpen(true);
  };

  // Open dialog to edit profile
  const handleEditProfile = (profile: any) => {
    setEditingProfile(profile);
    setIsProfileDialogOpen(true);
  };

  // Handle search and filtering
  const handleSearch = (term: string, activeFilters?: Record<string, string[]>) => {
    let results = empresasMock;
    
    // Apply search term filter
    if (term) {
      const searchLower = term.toLowerCase();
      results = results.filter(empresa => 
        empresa.nome.toLowerCase().includes(searchLower) ||
        empresa.cnpj.includes(term)
      );
    }
    
    // Apply perfil filters
    if (activeFilters && activeFilters.perfil && activeFilters.perfil.length > 0) {
      results = results.filter(empresa => activeFilters.perfil.includes(empresa.perfil));
    }
    
    setFilteredEmpresas(results);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Settings className="mr-2 text-cross-blue" size={20} />
          Gerenciamento de Permissões por Empresa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="empresa-search" className="mb-2 block">Buscar Empresa</Label>
          <SearchFilter
            placeholder="Buscar por nome ou CNPJ..."
            onSearch={handleSearch}
            filters={filterConfigs}
            className="mb-4"
          />
          
          <Select value={selectedEmpresa} onValueChange={handleEmpresaChange}>
            <SelectTrigger id="empresa-select" className="w-full md:w-[400px]">
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              {filteredEmpresas.map(empresa => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.nome} - {empresa.cnpj} ({empresa.perfil})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6 flex items-end gap-2">
          <div className="flex-grow">
            <Label htmlFor="perfil-select" className="mb-2 block">Tipo de Perfil</Label>
            <Select value={selectedPerfil} onValueChange={handlePerfilChange}>
              <SelectTrigger id="perfil-select" className="w-full">
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent>
                {allProfiles.map(profile => (
                  <SelectItem key={profile} value={profile}>
                    {profile}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={handleAddNewProfile}>
              <Plus size={14} />
              Novo Perfil
            </Button>
            <ManageProfilesDialog 
              profiles={[
                ...profiles.map((p, i) => ({ id: `default-${i}`, nome: p })),
                ...customProfiles
              ]} 
              onEditProfile={handleEditProfile}
              onDeleteProfile={handleDeleteProfile}
            />
          </div>
        </div>

        {selectedEmpresa && (
          <>
            <div className="mb-4 p-4 bg-blue-50 rounded-md">
              <p className="font-medium">Configurando permissões para:</p>
              <p className="text-lg">{getEmpresaName(selectedEmpresa)}</p>
              <p className="text-sm text-gray-500">Perfil: {selectedPerfil}</p>
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
                          {module.nome}
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
                      {module.tabelas.map(tab => (
                        <React.Fragment key={`${module.id}_${tab.id}`}>
                          <tr className="hover:bg-gray-50 border-b">
                            <td className="px-4 py-2 pl-8">
                              {tab.nome}
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
                          {tab.rotinas.map(routine => (
                            <tr key={`${module.id}_${tab.id}_${routine.id}`} className="hover:bg-gray-50 border-b">
                              <td className="px-4 py-2 pl-12 text-sm">
                                {routine.nome}
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
                disabled={!selectedEmpresa}
              >
                <Check size={16} className="mr-2" />
                Salvar Permissões
              </Button>
            </div>
          </>
        )}

        {/* Profile Dialog */}
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

export default PermissoesEmpresa;
