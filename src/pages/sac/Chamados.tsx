import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Phone, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';

const Chamados: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Gestão de Chamados</h2>
        <p className="text-gray-600">Acompanhe e gerencie os chamados de clientes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <MessageSquare className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chamados Abertos</p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Phone className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Atendimentos Hoje</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-amber-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tempo Médio</p>
                <h3 className="text-2xl font-bold">15 min</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Atendentes Online</p>
                <h3 className="text-2xl font-bold">8</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Input
              placeholder="Buscar chamados..."
              className="max-w-sm"
            />
            <Button>
              Novo Chamado
            </Button>
          </div>
          <DataTable
            columns={[
              { accessorKey: 'id', header: 'ID' },
              { accessorKey: 'cliente', header: 'Cliente' },
              { accessorKey: 'assunto', header: 'Assunto' },
              { accessorKey: 'status', header: 'Status' },
              { accessorKey: 'prioridade', header: 'Prioridade' },
              { accessorKey: 'dataAbertura', header: 'Data de Abertura' },
              { accessorKey: 'ultimaAtualizacao', header: 'Última Atualização' },
            ]}
            data={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Chamados;
