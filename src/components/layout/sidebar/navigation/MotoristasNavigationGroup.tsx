
import React from 'react';
import { Users, PackageOpen } from 'lucide-react';

import SubMenu from '../SubMenu';
import SidebarItem from '../SidebarItem';

const MotoristasNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={Users} label="Motoristas" defaultOpen={false}>
      <SidebarItem icon={Users} label="Cadastro" href="/motoristas/cadastro" />
      <SidebarItem icon={PackageOpen} label="Cargas" href="/motoristas/cargas" />
    </SubMenu>
  );
};

export default MotoristasNavigationGroup;
