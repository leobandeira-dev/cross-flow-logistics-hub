
import React from 'react';
import { NotaFiscal } from '../../../Faturamento';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface FaturaDocumentLayoutProps {
  documentId: string;
  notas: NotaFiscal[];
  totais: {
    pesoTotal: number;
    freteTotal: number;
    expressoTotal: number;
    icmsTotal: number;
    totalViagem: number;
  };
  cabecalho: {
    numeroDocumento?: string;
    tipoDocumento?: string;
    previsaoSaida?: Date;
    previsaoChegada?: Date;
    motoristaNome?: string;
    veiculoCavalo?: string;
    veiculoCarreta1?: string;
    veiculoCarreta2?: string;
    tipoCarroceria?: string;
    usuarioEmissor?: string;
    usuarioConferente?: string;
    transportadora?: string;
    transportadoraLogo?: string;
  };
}

const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || isNaN(value)) return 'R$ 0,00';
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (date: Date | undefined): string => {
  if (!date) return '--/--/----';
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

const formatDateTime = (date: Date | undefined): string => {
  if (!date) return '--/--/---- --:--';
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

const formatWeight = (weight: number | undefined): string => {
  if (weight === undefined || isNaN(weight)) return '0,00 kg';
  return `${weight.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg`;
};

const FaturaDocumentLayout: React.FC<FaturaDocumentLayoutProps> = ({ 
  documentId, 
  notas, 
  totais,
  cabecalho 
}) => {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-1">Documento de Faturamento</h1>
          <h2 className="text-xl">{cabecalho.numeroDocumento || documentId}</h2>
          <p className="text-gray-500">{cabecalho.tipoDocumento || "Não especificado"}</p>
        </div>
        <div className="text-right">
          {cabecalho.transportadoraLogo ? (
            <img 
              src={cabecalho.transportadoraLogo} 
              alt="Logo Transportadora" 
              className="h-16 mb-2"
            />
          ) : (
            <div className="h-16 w-32 bg-gray-100 flex items-center justify-center mb-2">
              <span className="text-gray-400">Logo</span>
            </div>
          )}
          <p className="font-semibold">{cabecalho.transportadora || "Transportadora não especificada"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 border p-4 rounded">
        <div>
          <h3 className="font-semibold mb-2">Previsões</h3>
          <div className="grid gap-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Saída:</span>
              <span>{formatDateTime(cabecalho.previsaoSaida)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chegada:</span>
              <span>{formatDateTime(cabecalho.previsaoChegada)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Responsáveis</h3>
          <div className="grid gap-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Emissor:</span>
              <span>{cabecalho.usuarioEmissor || "Não informado"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conferente:</span>
              <span>{cabecalho.usuarioConferente || "Não informado"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border p-4 rounded mb-6">
        <h3 className="font-semibold mb-2">Dados do Motorista e Veículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Motorista:</span>
            <span>{cabecalho.motoristaNome || "Não informado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tipo de Carroceria:</span>
            <span>{cabecalho.tipoCarroceria || "Não informado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cavalo:</span>
            <span>{cabecalho.veiculoCavalo || "Não informado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Carreta 1:</span>
            <span>{cabecalho.veiculoCarreta1 || "Não informado"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Carreta 2:</span>
            <span>{cabecalho.veiculoCarreta2 || "Não informado"}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Notas Fiscais</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nota Fiscal</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Peso (kg)</TableHead>
              <TableHead className="text-right">Valor Frete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notas.map((nota) => (
              <TableRow key={nota.id}>
                <TableCell>{nota.notaFiscal || nota.id}</TableCell>
                <TableCell>{nota.cliente}</TableCell>
                <TableCell>{formatDate(nota.data)}</TableCell>
                <TableCell className="text-right">{formatWeight(nota.pesoNota)}</TableCell>
                <TableCell className="text-right">{formatCurrency(nota.fretePeso)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t pt-4 mb-6">
        <h3 className="font-semibold mb-2">Totais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Peso Total:</span>
            <span>{formatWeight(totais.pesoTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Frete Peso:</span>
            <span>{formatCurrency(totais.freteTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Expresso:</span>
            <span>{formatCurrency(totais.expressoTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ICMS:</span>
            <span>{formatCurrency(totais.icmsTotal)}</span>
          </div>
          <div className="flex justify-between font-bold col-span-2">
            <span>Total da Viagem:</span>
            <span>{formatCurrency(totais.totalViagem)}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 mt-12 grid grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <div className="w-40 border-b border-black">&nbsp;</div>
          <p className="mt-2 text-center">Emissor</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-40 border-b border-black">&nbsp;</div>
          <p className="mt-2 text-center">Conferente</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-40 border-b border-black">&nbsp;</div>
          <p className="mt-2 text-center">Motorista</p>
        </div>
      </div>
    </div>
  );
};

export default FaturaDocumentLayout;
