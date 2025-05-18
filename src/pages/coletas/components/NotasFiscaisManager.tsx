
import React from 'react';
import { NotaFiscalVolume } from '../utils/volumeCalculations';
import NotasFiscaisHeader from './notasFiscais/NotasFiscaisHeader';
import EmptyNotasFiscais from './notasFiscais/EmptyNotasFiscais';
import NotaFiscalCard from './notasFiscais/NotaFiscalCard';
import NotasFiscaisSummary from './notasFiscais/NotasFiscaisSummary';

interface NotasFiscaisManagerProps {
  notasFiscais: NotaFiscalVolume[];
  onChangeNotasFiscais: (notasFiscais: NotaFiscalVolume[]) => void;
  isLoading?: boolean;
}

const NotasFiscaisManager: React.FC<NotasFiscaisManagerProps> = ({
  notasFiscais,
  onChangeNotasFiscais,
  isLoading = false
}) => {
  const adicionarNF = () => {
    onChangeNotasFiscais([...notasFiscais, { 
      numeroNF: '', 
      volumes: [],
      remetente: '',
      destinatario: '',
      valorTotal: 0,
      pesoTotal: 0
    }]);
  };

  const removerNF = (index: number) => {
    const novasNFs = [...notasFiscais];
    novasNFs.splice(index, 1);
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarNumeroNF = (index: number, numeroNF: string) => {
    const novasNFs = [...notasFiscais];
    novasNFs[index] = { ...novasNFs[index], numeroNF };
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarRemetente = (index: number, remetente: string) => {
    const novasNFs = [...notasFiscais];
    novasNFs[index] = { ...novasNFs[index], remetente };
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarDestinatario = (index: number, destinatario: string) => {
    const novasNFs = [...notasFiscais];
    novasNFs[index] = { ...novasNFs[index], destinatario };
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarValorTotal = (index: number, valorTotalStr: string) => {
    const novasNFs = [...notasFiscais];
    const valorTotal = parseFloat(valorTotalStr) || 0;
    novasNFs[index] = { ...novasNFs[index], valorTotal };
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarPesoTotal = (index: number, pesoTotalStr: string) => {
    const novasNFs = [...notasFiscais];
    const pesoTotal = parseFloat(pesoTotalStr) || 0;
    novasNFs[index] = { ...novasNFs[index], pesoTotal };
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarVolumes = (index: number, volumes: any[]) => {
    const novasNFs = [...notasFiscais];
    novasNFs[index] = { ...novasNFs[index], volumes };
    onChangeNotasFiscais(novasNFs);
  };

  return (
    <div className="space-y-4">
      <NotasFiscaisHeader onAddNF={adicionarNF} isLoading={isLoading} />

      {notasFiscais.length === 0 ? (
        <EmptyNotasFiscais withIcon={true} />
      ) : (
        <>
          {notasFiscais.map((nf, index) => (
            <NotaFiscalCard
              key={index}
              index={index}
              nf={nf}
              onRemove={() => removerNF(index)}
              onUpdateNumeroNF={(numeroNF) => atualizarNumeroNF(index, numeroNF)}
              onUpdateRemetente={(remetente) => atualizarRemetente(index, remetente)}
              onUpdateDestinatario={(destinatario) => atualizarDestinatario(index, destinatario)}
              onUpdateValorTotal={(valorTotal) => atualizarValorTotal(index, valorTotal)}
              onUpdatePesoTotal={(pesoTotal) => atualizarPesoTotal(index, pesoTotal)}
              onUpdateVolumes={(volumes) => atualizarVolumes(index, volumes)}
              isReadOnly={isLoading}
            />
          ))}
          
          <NotasFiscaisSummary notasFiscais={notasFiscais} />
        </>
      )}
    </div>
  );
};

export default NotasFiscaisManager;
