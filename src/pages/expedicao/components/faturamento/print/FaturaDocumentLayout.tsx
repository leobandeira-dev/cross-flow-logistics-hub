
import React from 'react';
import { format } from 'date-fns';
import { DocumentInfo } from './schema/documentSchema';
import { NotaFiscal } from '../../../Faturamento';
import { CabecalhoValores, TotaisCalculados } from '../../../hooks/faturamento/types';
import { formatCurrency } from '@/pages/armazenagem/utils/formatters';

interface FaturaDocumentLayoutProps {
  documentInfo: DocumentInfo;
  notas: NotaFiscal[];
  cabecalhoValores: CabecalhoValores;
  totaisCalculados: TotaisCalculados;
}

const FaturaDocumentLayout: React.FC<FaturaDocumentLayoutProps> = ({
  documentInfo,
  notas,
  cabecalhoValores,
  totaisCalculados
}) => {
  return (
    <div className="p-8 bg-white text-black min-h-[800px] print:p-2">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center border-b-2 pb-4 mb-6">
        <div>
          {documentInfo.transporterLogo ? (
            <img 
              src={documentInfo.transporterLogo} 
              alt={`${documentInfo.transporterName} logo`} 
              className="h-16 object-contain"
            />
          ) : (
            <div className="h-16 w-32 bg-gray-200 flex items-center justify-center text-sm text-gray-600">
              Logo não disponível
            </div>
          )}
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold">{documentInfo.documentType === 'inbound' ? 'FATURA ENTRADA' : 'FATURA SAÍDA'}</h1>
          <p className="text-lg font-semibold">Nº {documentInfo.documentNumber}</p>
          <p className="text-sm">Emitido em: {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>
      </div>
      
      {/* Informações do documento */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-semibold text-lg mb-2">Dados da transportadora</h2>
          <p><strong>Nome:</strong> {documentInfo.transporterName}</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Previsão</h2>
          <p><strong>Saída:</strong> {format(documentInfo.departureDateTime, 'dd/MM/yyyy HH:mm')}</p>
          <p><strong>Chegada:</strong> {format(documentInfo.arrivalDateTime, 'dd/MM/yyyy HH:mm')}</p>
        </div>
      </div>
      
      {/* Dados do motorista */}
      <div className="mb-6 border p-4 rounded-md bg-gray-50">
        <h2 className="font-semibold text-lg mb-2">Dados do motorista</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p><strong>Nome:</strong> {documentInfo.driverName}</p>
          <p><strong>Cavalo:</strong> {documentInfo.truckId}</p>
          <p><strong>Carroceria:</strong> {documentInfo.trailerType}</p>
          <p><strong>Carreta 1:</strong> {documentInfo.trailer1 || 'N/A'}</p>
          <p><strong>Carreta 2:</strong> {documentInfo.trailer2 || 'N/A'}</p>
        </div>
      </div>
      
      {/* Totais */}
      <div className="mb-6 border p-4 rounded-md bg-gray-50">
        <h2 className="font-semibold text-lg mb-2">Valores da viagem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p><strong>Frete por tonelada:</strong> {formatCurrency(cabecalhoValores.fretePorTonelada)}</p>
            <p><strong>Peso mínimo:</strong> {cabecalhoValores.pesoMinimo.toFixed(2)} kg</p>
            <p><strong>Pedágio:</strong> {formatCurrency(cabecalhoValores.pedagio)}</p>
          </div>
          <div>
            <p><strong>ICMS (%):</strong> {cabecalhoValores.aliquotaICMS.toFixed(2)}%</p>
            <p><strong>Taxa expresso (%):</strong> {cabecalhoValores.aliquotaExpresso.toFixed(2)}%</p>
            <p><strong>Paletização:</strong> {formatCurrency(cabecalhoValores.paletizacao)}</p>
          </div>
          <div>
            <p><strong>Frete transferência:</strong> {formatCurrency(cabecalhoValores.valorFreteTransferencia)}</p>
            <p><strong>Coleta:</strong> {formatCurrency(cabecalhoValores.valorColeta)}</p>
          </div>
        </div>
      </div>
      
      {/* Totais calculados */}
      <div className="mb-6 border p-4 rounded-md bg-blue-50 text-blue-900">
        <h2 className="font-semibold text-lg mb-2">Totais calculados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p><strong>Frete peso:</strong> {formatCurrency(totaisCalculados.fretePesoViagem)}</p>
            <p><strong>Pedágio:</strong> {formatCurrency(totaisCalculados.pedagioViagem)}</p>
          </div>
          <div>
            <p><strong>Expresso:</strong> {formatCurrency(totaisCalculados.expressoViagem)}</p>
            <p><strong>ICMS:</strong> {formatCurrency(totaisCalculados.icmsViagem)}</p>
          </div>
          <div>
            <p className="font-bold text-lg">Total viagem: {formatCurrency(totaisCalculados.totalViagem)}</p>
          </div>
        </div>
      </div>
      
      {/* Notas fiscais */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Notas fiscais ({notas.length})</h2>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Nota fiscal</th>
                <th className="p-2 text-left">Cliente</th>
                <th className="p-2 text-right">Peso (kg)</th>
                <th className="p-2 text-right">Frete peso</th>
                <th className="p-2 text-right">Valor expresso</th>
                <th className="p-2 text-right">Frete ratear</th>
                <th className="p-2 text-right">ICMS</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((nota, index) => (
                <tr key={nota.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-2">{nota.notaFiscal || '-'}</td>
                  <td className="p-2">{nota.cliente}</td>
                  <td className="p-2 text-right">{nota.pesoNota.toFixed(2)}</td>
                  <td className="p-2 text-right">{formatCurrency(nota.fretePeso || 0)}</td>
                  <td className="p-2 text-right">{formatCurrency(nota.valorExpresso || 0)}</td>
                  <td className="p-2 text-right">{formatCurrency(nota.freteRatear || 0)}</td>
                  <td className="p-2 text-right">{formatCurrency(nota.icms || 0)}</td>
                  <td className="p-2 text-right">
                    {formatCurrency((nota.fretePeso || 0) + (nota.valorExpresso || 0) + (nota.freteRatear || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Assinaturas */}
      <div className="grid grid-cols-2 gap-8 mt-12">
        <div className="border-t pt-2">
          <p className="text-center mb-1">Emitido por: {documentInfo.issuerUser}</p>
          <p className="text-center text-sm text-gray-600">Emissor</p>
        </div>
        <div className="border-t pt-2">
          <p className="text-center mb-1">Conferido por: {documentInfo.checkerUser}</p>
          <p className="text-center text-sm text-gray-600">Conferente</p>
        </div>
      </div>
      
      {/* Rodapé */}
      <div className="mt-12 border-t pt-4 text-center text-sm text-gray-600">
        <p>Documento gerado automaticamente pelo sistema - {format(new Date(), 'dd/MM/yyyy HH:mm:ss')}</p>
      </div>
    </div>
  );
};

export default FaturaDocumentLayout;
