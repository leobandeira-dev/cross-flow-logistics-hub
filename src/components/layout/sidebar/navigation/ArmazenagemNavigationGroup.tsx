
import React from 'react';
import { Archive, Package, Box, Truck, FileText, Search } from 'lucide-react';

import SubMenu from '../SubMenu';
import SidebarItem from '../SidebarItem';

const ArmazenagemNavigationGroup: React.FC = () => {
  return (
    <SubMenu icon={Archive} label="Armazenagem" defaultOpen={false}>
      <SubMenu icon={Package} label="Recebimento" defaultOpen={false}>
        <SidebarItem icon={Package} label="Visão Geral" href="/armazenagem" />
        <SidebarItem icon={Box} label="Fornecedor" href="/armazenagem/recebimento/fornecedor" />
        <SidebarItem icon={Box} label="Coleta" href="/armazenagem/recebimento/coleta" />
        <SidebarItem icon={Box} label="Entre Filiais" href="/armazenagem/recebimento/filiais" />
        <SidebarItem icon={FileText} label="Notas Fiscais" href="/armazenagem/recebimento/notas" />
        <SidebarItem icon={FileText} label="Etiquetas" href="/armazenagem/recebimento/etiquetas" />
      </SubMenu>
      
      <SubMenu icon={Package} label="Movimentações" defaultOpen={false}>
        <SidebarItem icon={Box} label="Visão Geral" href="/armazenagem/movimentacoes" />
        <SidebarItem icon={Box} label="Unitização" href="/armazenagem/movimentacoes/unitizacao" />
        <SidebarItem icon={Box} label="Cancelar Unit." href="/armazenagem/movimentacoes/cancelar-unitizacao" />
        <SidebarItem icon={Box} label="Endereçamento" href="/armazenagem/movimentacoes/enderecamento" />
      </SubMenu>
      
      <SubMenu icon={Truck} label="Carregamento" defaultOpen={false}>
        <SidebarItem icon={Truck} label="Visão Geral" href="/armazenagem/carregamento" />
        <SidebarItem icon={FileText} label="Ordem" href="/armazenagem/carregamento/ordem" />
        <SidebarItem icon={FileText} label="Conferência" href="/armazenagem/carregamento/conferencia" />
        <SidebarItem icon={Box} label="Endereçamento" href="/armazenagem/carregamento/enderecamento" />
        <SidebarItem icon={FileText} label="Checklist" href="/armazenagem/carregamento/checklist" />
      </SubMenu>
      
      <SidebarItem icon={Search} label="Rastreamento NF" href="/armazenagem/rastreamento" />
    </SubMenu>
  );
};

export default ArmazenagemNavigationGroup;
