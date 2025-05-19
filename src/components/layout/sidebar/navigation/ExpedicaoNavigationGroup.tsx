
import React from 'react';
import { FileText, Calculator, Truck } from 'lucide-react';

import SubMenu from '../SubMenu';
import SidebarItem from '../SidebarItem';

const ExpedicaoNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={FileText} label="Expedição" defaultOpen={false}>
      <SidebarItem icon={FileText} label="Documentos" href="/expedicao/documentos" />
      <SidebarItem icon={Calculator} label="Faturamento" href="/expedicao/faturamento" />
      <SidebarItem icon={Truck} label="Remessas" href="/expedicao/remessas" />
    </SubMenu>
  );
};

export default ExpedicaoNavigationGroup;
