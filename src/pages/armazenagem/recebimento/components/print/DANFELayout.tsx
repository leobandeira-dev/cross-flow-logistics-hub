
import React from 'react';
import { formatCNPJ, formatDate, formatCurrency } from '../../../utils/formatters';

interface DANFELayoutProps {
  notaFiscalData: any;
  simplified?: boolean;
}

const DANFELayout: React.FC<DANFELayoutProps> = ({ notaFiscalData, simplified = false }) => {
  // Use default data if notaFiscalData is not provided
  const data = notaFiscalData || {
    chaveNF: '12345678901234567890123456789012345678901234',
    numeroNF: '123456',
    serieNF: '001',
    dataHoraEmissao: '2023-05-10',
    valorTotal: '1850.75',
    emitenteCNPJ: '12345678901234',
    emitenteRazaoSocial: 'EMPRESA EMITENTE LTDA',
    emitenteEndereco: 'RUA EXEMPLO, 123',
    emitenteBairro: 'CENTRO',
    emitenteCidade: 'SÃO PAULO',
    emitenteUF: 'SP',
    emitenteCEP: '01234567',
    destinatarioCNPJ: '98765432101234',
    destinatarioRazaoSocial: 'EMPRESA DESTINATÁRIA LTDA',
    destinatarioEndereco: 'AVENIDA MODELO, 456',
    destinatarioBairro: 'BAIRRO EXEMPLO',
    destinatarioCidade: 'RIO DE JANEIRO',
    destinatarioUF: 'RJ',
    destinatarioCEP: '12345678',
    itens: [
      { descricao: 'PRODUTO EXEMPLO 1', quantidade: 10, valor: 100.00, ncm: '12345678' },
      { descricao: 'PRODUTO EXEMPLO 2', quantidade: 5, valor: 150.00, ncm: '87654321' },
    ]
  };
  
  console.log("Renderizando DANFE com dados:", data);

  if (simplified) {
    return (
      <div className="bg-white p-4 w-full font-mono text-xs print:block print:visible" style={{minHeight: '500px'}}>
        <div className="border-2 border-black p-2 text-center mb-4">
          <div className="text-lg font-bold">DANFE SIMPLIFICADO</div>
          <div>DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA</div>
        </div>
        
        <div className="border border-black p-2 mb-4">
          <div className="font-bold mb-1">CHAVE DE ACESSO</div>
          <div className="text-center">{data.chaveNF}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border border-black p-2">
            <div className="font-bold">EMITENTE</div>
            <div>{data.emitenteRazaoSocial}</div>
            <div>CNPJ: {formatCNPJ(data.emitenteCNPJ)}</div>
          </div>
          
          <div className="border border-black p-2">
            <div className="font-bold">NF-e</div>
            <div>Nº {data.numeroNF}</div>
            <div>SÉRIE: {data.serieNF}</div>
            <div>EMISSÃO: {formatDate(data.dataHoraEmissao)}</div>
          </div>
        </div>
        
        <div className="border border-black p-2 mb-4">
          <div className="font-bold">DESTINATÁRIO</div>
          <div>{data.destinatarioRazaoSocial}</div>
          <div>CNPJ: {formatCNPJ(data.destinatarioCNPJ)}</div>
        </div>
        
        <div className="border border-black p-2">
          <div className="font-bold text-center border-b border-black pb-1 mb-1">VALOR TOTAL DA NOTA FISCAL</div>
          <div className="text-center text-lg font-bold">{formatCurrency(data.valorTotal)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 w-full font-mono text-xs print:block print:visible" style={{minHeight: '800px'}}>
      <div className="grid grid-cols-3 border-2 border-black">
        <div className="col-span-1 border-r-2 border-black p-2">
          <div className="text-center">
            <div className="font-bold">{data.emitenteRazaoSocial}</div>
            <div>{data.emitenteEndereco}</div>
            <div>{data.emitenteBairro} - {data.emitenteCidade}/{data.emitenteUF}</div>
            <div>CEP: {data.emitenteCEP} - CNPJ: {formatCNPJ(data.emitenteCNPJ)}</div>
          </div>
        </div>
        
        <div className="col-span-2 p-2">
          <div className="text-center text-2xl font-bold">DANFE</div>
          <div className="text-center">DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="border border-black p-1 text-center">
              <div>0 - ENTRADA</div>
              <div>1 - SAÍDA</div>
            </div>
            <div className="border border-black p-1">
              <div className="font-bold">Nº {data.numeroNF}</div>
              <div>SÉRIE: {data.serieNF}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-x-2 border-b-2 border-black p-2">
        <div className="font-bold">CHAVE DE ACESSO</div>
        <div className="text-center">{data.chaveNF}</div>
      </div>
      
      <div className="border-x-2 border-b-2 border-black p-2 mt-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold">NATUREZA DA OPERAÇÃO</div>
            <div>VENDA DE MERCADORIA</div>
          </div>
          <div>
            <div className="font-bold">PROTOCOLO DE AUTORIZAÇÃO</div>
            <div>123456789012345 - {formatDate(data.dataHoraEmissao)}</div>
          </div>
        </div>
      </div>
      
      <div className="border-x-2 border-b-2 border-black mt-2">
        <div className="font-bold border-b-2 border-black p-1">DESTINATÁRIO / REMETENTE</div>
        <div className="grid grid-cols-2 gap-2 p-2">
          <div>
            <div className="font-bold">NOME / RAZÃO SOCIAL</div>
            <div>{data.destinatarioRazaoSocial}</div>
          </div>
          <div>
            <div className="font-bold">CNPJ</div>
            <div>{formatCNPJ(data.destinatarioCNPJ)}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2 border-t border-black">
          <div className="col-span-2">
            <div className="font-bold">ENDEREÇO</div>
            <div>{data.destinatarioEndereco}</div>
          </div>
          <div>
            <div className="font-bold">BAIRRO</div>
            <div>{data.destinatarioBairro}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2 border-t border-black">
          <div>
            <div className="font-bold">MUNICÍPIO</div>
            <div>{data.destinatarioCidade}</div>
          </div>
          <div>
            <div className="font-bold">UF</div>
            <div>{data.destinatarioUF}</div>
          </div>
          <div>
            <div className="font-bold">CEP</div>
            <div>{data.destinatarioCEP}</div>
          </div>
        </div>
      </div>
      
      <div className="border-x-2 border-b-2 border-black mt-2">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black bg-gray-100">
              <th className="border-r border-black p-1 w-1/12">CÓDIGO</th>
              <th className="border-r border-black p-1 w-5/12">DESCRIÇÃO DO PRODUTO</th>
              <th className="border-r border-black p-1 w-1/12">NCM</th>
              <th className="border-r border-black p-1 w-1/12">QTDE</th>
              <th className="border-r border-black p-1 w-1/12">VALOR UNIT.</th>
              <th className="p-1 w-1/12">VALOR TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data.itens ? data.itens.map((item: any, index: number) => (
              <tr key={index} className="border-b border-black">
                <td className="border-r border-black p-1 text-center">{index + 1}</td>
                <td className="border-r border-black p-1">{item.descricao}</td>
                <td className="border-r border-black p-1 text-center">{item.ncm}</td>
                <td className="border-r border-black p-1 text-center">{item.quantidade}</td>
                <td className="border-r border-black p-1 text-right">{formatCurrency(item.valor)}</td>
                <td className="p-1 text-right">{formatCurrency(item.valor * item.quantidade)}</td>
              </tr>
            )) : (
              <tr className="border-b border-black">
                <td colSpan={6} className="p-2 text-center">Sem itens disponíveis</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="border-x-2 border-b-2 border-black mt-2 p-2">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <div className="font-bold">INFORMAÇÕES COMPLEMENTARES</div>
            <div>Documento emitido por ME ou EPP optante pelo Simples Nacional.</div>
          </div>
          <div>
            <div className="font-bold">VALOR TOTAL DA NOTA</div>
            <div className="text-xl font-bold text-center mt-2">{formatCurrency(data.valorTotal)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DANFELayout;
