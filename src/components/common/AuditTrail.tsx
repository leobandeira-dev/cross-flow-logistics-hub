
import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';

export interface AuditEntry {
  id: string;
  timestamp: Date;
  username: string;
  action: string;
  details?: string;
}

interface AuditTrailProps {
  entries: AuditEntry[];
  moduleName: string;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ entries, moduleName }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin'; // This assumes user has a role property
  
  if (!isAdmin) {
    return null; // Don't render anything for non-admins
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Shield className="mr-2 text-cross-blue" size={20} />
          Auditoria - {moduleName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum registro de auditoria encontrado para este módulo.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }).format(entry.timestamp)}
                  </TableCell>
                  <TableCell>{entry.username}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>{entry.details || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditTrail;
