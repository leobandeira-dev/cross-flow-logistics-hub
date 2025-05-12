
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Biohazard, QrCode } from 'lucide-react';

interface EtiquetaPreviewProps {
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
}

const EtiquetaPreview: React.FC<EtiquetaPreviewProps> = ({ 
  tipoEtiqueta,
  isQuimico 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Modelo de Etiqueta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4 h-auto flex items-center justify-center">
          <div className="text-center">
            {tipoEtiqueta === 'mae' ? (
              <div className="p-3 border-2 border-red-500 rounded-md bg-red-50">
                <QrCode size={40} className="mx-auto mb-2 text-red-600" />
                <p className="font-bold text-red-600">ETIQUETA MÃE</p>
                <p className="text-sm mt-2">Agrupa múltiplos volumes</p>
              </div>
            ) : isQuimico ? (
              <div className="p-3 border-2 border-yellow-500 rounded-md bg-yellow-50">
                <Biohazard size={40} className="mx-auto mb-2 text-red-500" />
                <p className="font-bold text-red-500">PRODUTO QUÍMICO</p>
                <p className="text-sm mt-2">ONU / Risco exibido na etiqueta</p>
              </div>
            ) : (
              <div className="p-3 border-2 border-blue-500 rounded-md bg-blue-50">
                <QrCode size={40} className="mx-auto mb-2 text-blue-600" />
                <p className="font-bold text-blue-600">ETIQUETA DE VOLUME</p>
                <p className="text-sm mt-2">Com QR code e ID único</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Informações na Etiqueta</h3>
          <ul className="text-sm space-y-1">
            {tipoEtiqueta === 'mae' ? (
              <>
                <li>• ID único da etiqueta mãe</li>
                <li>• QR Code de identificação</li>
                <li>• Número da nota fiscal</li>
                <li>• Quantidade total de volumes</li>
                <li>• Remetente / Destinatário</li>
                <li>• Cidade completa / UF</li>
              </>
            ) : (
              <>
                <li>• ID único do volume com QR Code</li>
                <li>• Número da nota fiscal</li>
                <li>• Numeração sequencial (X/Y)</li>
                <li>• Remetente / Destinatário</li>
                <li>• Cidade completa / UF</li>
                <li>• Tipo de volume (Geral / Químico)</li>
                {isQuimico && (
                  <>
                    <li>• Código ONU</li>
                    <li>• Código de Risco</li>
                    <li>• Simbologia de Perigo</li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Impressoras Disponíveis</h3>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2">
            <option value="">Selecionar impressora</option>
            <option value="zebra">Zebra ZT410</option>
            <option value="datamax">Datamax E-4205</option>
            <option value="brother">Brother QL-820NWB</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default EtiquetaPreview;
