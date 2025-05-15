
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuditTrail, { AuditEntry } from './AuditTrail';
import { useAuth } from '@/hooks/useAuth';

interface TabsWithAuditProps {
  defaultTab?: string;
  moduleName: string;
  auditEntries: AuditEntry[];
  children: ReactNode;
  mainTabLabel?: string;
}

const TabsWithAudit: React.FC<TabsWithAuditProps> = ({
  defaultTab = 'principal',
  moduleName,
  auditEntries,
  children,
  mainTabLabel = 'Principal'
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="principal">{mainTabLabel}</TabsTrigger>
        {isAdmin && <TabsTrigger value="auditoria">Auditoria</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="principal">
        {children}
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="auditoria">
          <AuditTrail entries={auditEntries} moduleName={moduleName} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default TabsWithAudit;
