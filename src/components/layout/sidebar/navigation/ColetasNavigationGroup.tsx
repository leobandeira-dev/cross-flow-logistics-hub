
import React from 'react';
import { Truck, FileText, Map } from 'lucide-react';

import SubMenu from '../SubMenu';
import SidebarItem from '../SidebarItem';

const ColetasNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={Truck} label="Coletas" defaultOpen={false}>
      <SidebarItem icon={FileText} label="Solicitações" href="/coletas/solicitacoes" />
      <SidebarItem icon={FileText} label="Aprovações" href="/coletas/aprovacoes" />
      <SidebarItem icon={Map} label="Alocação de Cargas" href="/coletas/alocacao" />
    </SubMenu>
  );
};

export default ColetasNavigationGroup;
