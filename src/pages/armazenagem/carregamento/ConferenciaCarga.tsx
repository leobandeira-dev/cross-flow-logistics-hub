
import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { FileText } from 'lucide-react';
import OrderDetailsForm, { OrdemCarregamento } from '@/components/carregamento/OrderDetailsForm';
import BarcodeScannerSection from '@/components/carregamento/BarcodeScannerSection';
import VolumesTable from '@/components/carregamento/VolumesTable';

// Mock data
const itensParaConferencia = [
  { id: 'ITEM-001', produto: 'Produto A', quantidade: 5, verificado: false, etiquetaMae: 'ETQ-001', notaFiscal: 'NF-5566' },
  { id: 'ITEM-002', produto: 'Produto B', quantidade: 10, verificado: false, etiquetaMae: 'ETQ-001', notaFiscal: 'NF-5566' },
  { id: 'ITEM-003', produto: 'Produto C', quantidade: 3, verificado: false, etiquetaMae: 'ETQ-002', notaFiscal: 'NF-7788' },
  { id: 'ITEM-004', produto: 'Produto D', quantidade: 8, verificado: false, etiquetaMae: 'ETQ-002', notaFiscal: 'NF-7788' },
];

const ConferenciaCarga: React.FC = () => {
  const [ordemSelecionada, setOrdemSelecionada] = useState<OrdemCarregamento | null>(null);
  const [itens, setItens] = useState(itensParaConferencia);
  const [codigoVolume, setCodigoVolume] = useState('');
  const [codigoNF, setCodigoNF] = useState('');
  const [codigoEtiquetaMae, setCodigoEtiquetaMae] = useState('');
  
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    // Simulando busca de OC
    setOrdemSelecionada({
      id: data.numeroOC || 'OC-2023-001',
      cliente: 'Distribuidor ABC',
      destinatario: 'São Paulo, SP',
      dataCarregamento: '15/05/2023',
      volumesTotal: 26,
      volumesVerificados: 0,
      status: 'processing'
    });
  };

  const handleVerificarItem = (id: string) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, verificado: true } : item
    ));
  };

  const handleVerificarPorVolume = () => {
    if (!codigoVolume) return;
    
    // Simula leitura de código de barras do volume
    const naoVerificados = itens.filter(item => !item.verificado);
    if (naoVerificados.length > 0) {
      handleVerificarItem(naoVerificados[0].id);
      setCodigoVolume('');
    }
  };

  const handleVerificarPorNF = () => {
    if (!codigoNF) return;
    
    // Simula leitura de código de barras da nota fiscal
    const notaFiscalLida = 'NF-5566'; // Simula que leu este código
    setItens(itens.map(item => 
      item.notaFiscal === notaFiscalLida ? { ...item, verificado: true } : item
    ));
    setCodigoNF('');
  };

  const handleVerificarPorEtiquetaMae = () => {
    if (!codigoEtiquetaMae) return;
    
    // Simula leitura de código de barras da etiqueta mãe
    const etiquetaLida = 'ETQ-001'; // Simula que leu este código
    setItens(itens.map(item => 
      item.etiquetaMae === etiquetaLida ? { ...item, verificado: true } : item
    ));
    setCodigoEtiquetaMae('');
  };

  const verificadosCount = itens.filter(i => i.verificado).length;
  const totalCount = itens.length;

  return (
    <MainLayout title="Conferência de Carga">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Conferência de Carga</h2>
        <p className="text-gray-600">Realize a conferência de itens para carregamento por volume, nota fiscal ou etiqueta mãe</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <OrderDetailsForm 
            onSubmit={handleSubmit} 
            ordemSelecionada={ordemSelecionada} 
          />
          
          {ordemSelecionada && (
            <div className="mt-4 border rounded-md p-4">
              <BarcodeScannerSection 
                codigoVolume={codigoVolume}
                setCodigoVolume={setCodigoVolume}
                codigoNF={codigoNF}
                setCodigoNF={setCodigoNF}
                codigoEtiquetaMae={codigoEtiquetaMae}
                setCodigoEtiquetaMae={setCodigoEtiquetaMae}
                handleVerificarPorVolume={handleVerificarPorVolume}
                handleVerificarPorNF={handleVerificarPorNF}
                handleVerificarPorEtiquetaMae={handleVerificarPorEtiquetaMae}
                verificadosCount={verificadosCount}
                totalCount={totalCount}
              />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <VolumesTable 
            ordemSelecionada={ordemSelecionada} 
            itens={itens}
            handleVerificarItem={handleVerificarItem}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ConferenciaCarga;
