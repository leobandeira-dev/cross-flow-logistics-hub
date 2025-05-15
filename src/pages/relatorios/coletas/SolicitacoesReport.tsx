
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePicker } from "@/components/ui/calendar";
import { BarChart, Download, FileText, Printer } from "lucide-react";
import { format } from "date-fns";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SolicitacoesReport = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [reportView, setReportView] = useState<'table' | 'chart'>('table');

  // Dados mock para o relatório
  const mockData = [
    { data: '2025-05-01', solicitacoesTotal: 24, aprovadas: 18, recusadas: 6 },
    { data: '2025-05-02', solicitacoesTotal: 32, aprovadas: 25, recusadas: 7 },
    { data: '2025-05-03', solicitacoesTotal: 18, aprovadas: 15, recusadas: 3 },
    { data: '2025-05-04', solicitacoesTotal: 27, aprovadas: 22, recusadas: 5 },
    { data: '2025-05-05', solicitacoesTotal: 35, aprovadas: 30, recusadas: 5 },
    { data: '2025-05-06', solicitacoesTotal: 22, aprovadas: 17, recusadas: 5 },
    { data: '2025-05-07', solicitacoesTotal: 29, aprovadas: 24, recusadas: 5 },
  ];

  const chartData = mockData.map(item => ({
    name: format(new Date(item.data), 'dd/MM'),
    Solicitações: item.solicitacoesTotal,
    Aprovadas: item.aprovadas,
    Recusadas: item.recusadas
  }));

  return (
    <MainLayout title="Relatório - Solicitações por Período">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Parâmetros do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="aprovadas">Aprovadas</SelectItem>
                    <SelectItem value="recusadas">Recusadas</SelectItem>
                    <SelectItem value="pendentes">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline">Limpar</Button>
              <Button>Gerar Relatório</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Resultados</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setReportView('table')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Tabela
                </Button>
                <Button variant="outline" size="sm" onClick={() => setReportView('chart')}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Gráfico
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {reportView === 'table' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Total de Solicitações</TableHead>
                    <TableHead>Aprovadas</TableHead>
                    <TableHead>Recusadas</TableHead>
                    <TableHead>Taxa de Aprovação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(row.data), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{row.solicitacoesTotal}</TableCell>
                      <TableCell>{row.aprovadas}</TableCell>
                      <TableCell>{row.recusadas}</TableCell>
                      <TableCell>{((row.aprovadas / row.solicitacoesTotal) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Solicitações" fill="#8884d8" />
                    <Bar dataKey="Aprovadas" fill="#82ca9d" />
                    <Bar dataKey="Recusadas" fill="#ff8042" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SolicitacoesReport;
