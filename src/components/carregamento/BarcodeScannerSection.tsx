
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Barcode, FileText, Package, FileBarChart } from 'lucide-react';

interface BarcodeScannerSectionProps {
  codigoVolume: string;
  setCodigoVolume: (codigo: string) => void;
  codigoNF: string;
  setCodigoNF: (codigo: string) => void;
  codigoEtiquetaMae: string;
  setCodigoEtiquetaMae: (codigo: string) => void;
  handleVerificarPorVolume: () => void;
  handleVerificarPorNF: () => void;
  handleVerificarPorEtiquetaMae: () => void;
  verificadosCount: number;
  totalCount: number;
}

const BarcodeScannerSection: React.FC<BarcodeScannerSectionProps> = ({
  codigoVolume,
  setCodigoVolume,
  codigoNF,
  setCodigoNF,
  codigoEtiquetaMae,
  setCodigoEtiquetaMae,
  handleVerificarPorVolume,
  handleVerificarPorNF,
  handleVerificarPorEtiquetaMae,
  verificadosCount,
  totalCount
}) => {
  return (
    <>
      <div className="mt-4 pt-4 border-t">
        <h3 className="font-medium mb-2">Leitura de Códigos</h3>
        
        <div className="space-y-4">
          {/* Leitura por Volume */}
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <Package size={14} className="mr-1" />
                Leitura de código por Volume
              </div>
              <Input 
                placeholder="Escaneie ou digite o código do volume" 
                className="flex-1" 
                value={codigoVolume}
                onChange={(e) => setCodigoVolume(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleVerificarPorVolume}
              className="bg-cross-blue text-white hover:bg-cross-blue/90"
            >
              <Barcode size={16} className="mr-2" />
              Ler
            </Button>
          </div>
          
          {/* Leitura por Nota Fiscal */}
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <FileText size={14} className="mr-1" />
                Leitura de código por Nota Fiscal
              </div>
              <Input 
                placeholder="Escaneie ou digite o código da NF" 
                className="flex-1" 
                value={codigoNF}
                onChange={(e) => setCodigoNF(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleVerificarPorNF}
              className="bg-cross-blue text-white hover:bg-cross-blue/90"
            >
              <FileBarChart size={16} className="mr-2" />
              Ler
            </Button>
          </div>
          
          {/* Leitura por Etiqueta Mãe */}
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <Package size={14} className="mr-1" />
                Leitura de código por Etiqueta Mãe
              </div>
              <Input 
                placeholder="Escaneie ou digite o código da etiqueta" 
                className="flex-1" 
                value={codigoEtiquetaMae}
                onChange={(e) => setCodigoEtiquetaMae(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleVerificarPorEtiquetaMae}
              className="bg-cross-blue text-white hover:bg-cross-blue/90"
            >
              <Barcode size={16} className="mr-2" />
              Ler
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Progresso</h3>
          <span className="text-sm">
            {verificadosCount} / {totalCount}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-cross-blue h-2.5 rounded-full" 
            style={{ width: `${(verificadosCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default BarcodeScannerSection;
