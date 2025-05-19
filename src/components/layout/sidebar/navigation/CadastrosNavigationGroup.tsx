
import React from 'react';
import { FileText, Users, Building, MapPin, Settings } from 'lucide-react';

import SubMenu from '../SubMenu';
import SidebarItem from '../SidebarItem';

const CadastrosNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={FileText} label="Cadastros" defaultOpen={false}>
      <SubMenu icon={Users} label="Usuários" defaultOpen={false}>
        <SidebarItem icon={Users} label="Cadastro" href="/usuarios/cadastro" />
        <SidebarItem icon={Settings} label="Permissões" href="/usuarios/permissoes" />
      </SubMenu>
      <SubMenu icon={Building} label="Empresas" defaultOpen={false}>
        <SidebarItem icon={Building} label="Cadastro" href="/empresas/cadastro" />
        <SidebarItem icon={Settings} label="Permissões" href="/empresas/permissoes" />
      </SubMenu>
      <SubMenu icon={MapPin} label="Endereçamento" defaultOpen={false}>
        <SidebarItem icon={MapPin} label="Cadastro" href="/cadastros/enderecamento" />
      </SubMenu>
    </SubMenu>
  );
};

export default CadastrosNavigationGroup;
