
import { VolumeData } from '@/components/common/print/etiquetas/types';
import { LayoutStyle } from './types';

export const useEtiquetaPDF = () => {
  const generateEtiquetaPDF = async (
    volumes: any[], 
    notaData: any, 
    formatoImpressao: string,
    tipoEtiqueta: 'volume' | 'mae' = 'volume',
    layoutStyle: LayoutStyle = 'standard'
  ) => {
    try {
      console.log('Gerando PDF com:', { volumes, notaData, formatoImpressao, tipoEtiqueta, layoutStyle });
      
      // Create print-ready data
      const printData = volumes.map((volume, index) => {
        const volumeData: VolumeData = {
          id: volume.id || `VOL-${index + 1}`,
          notaFiscal: notaData?.notaFiscal || notaData?.numero || '',
          remetente: notaData?.remetente || notaData?.emitente_razao_social || '',
          destinatario: notaData?.destinatario || notaData?.destinatario_razao_social || '',
          endereco: notaData?.endereco || `${notaData?.destinatario_endereco || ''}, ${notaData?.destinatario_numero || ''}`,
          cidade: notaData?.cidade || notaData?.destinatario_cidade || '',
          cidadeCompleta: `${notaData?.cidade || notaData?.destinatario_cidade || ''} - ${notaData?.uf || notaData?.destinatario_uf || ''}`,
          uf: notaData?.uf || notaData?.destinatario_uf || '',
          pesoTotal: `${notaData?.pesoTotal || notaData?.peso_bruto || '0'} Kg`,
          tipoVolume: volume.tipoVolume || 'geral',
          codigoONU: volume.codigoONU,
          codigoRisco: volume.codigoRisco,
          classificacaoQuimica: volume.classificacaoQuimica || 'nao_classificada',
          etiquetaMae: volume.etiquetaMae,
          chaveNF: notaData?.chaveNF || notaData?.chave_acesso || '',
          descricao: volume.descricao || 'Volume',
          quantidade: volumes.length,
          transportadora: notaData?.transportadora || 'N/D'
        };
        
        return volumeData;
      });

      // Generate and print PDF
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Não foi possível abrir a janela de impressão');
      }

      // Create print content
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Etiquetas - ${notaData?.notaFiscal || 'Volume'}</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 0; }
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
            }
            .etiqueta-page { 
              page-break-after: always; 
              width: 100%; 
              height: 100vh; 
              display: flex; 
              align-items: center; 
              justify-content: center;
            }
            .etiqueta-content {
              border: 2px solid black;
              padding: 15px;
              max-width: ${formatoImpressao === 'a4' ? '800px' : '500px'};
              background: white;
            }
          </style>
        </head>
        <body>
          ${printData.map((volume, index) => `
            <div class="etiqueta-page">
              <div class="etiqueta-content">
                <h2 style="text-align: center; margin-bottom: 20px;">
                  ETIQUETA DE VOLUME ${index + 1}/${printData.length}
                </h2>
                <div style="margin-bottom: 15px;">
                  <strong>NF:</strong> ${volume.notaFiscal}
                </div>
                <div style="margin-bottom: 15px;">
                  <strong>Remetente:</strong> ${volume.remetente}
                </div>
                <div style="margin-bottom: 15px;">
                  <strong>Destinatário:</strong> ${volume.destinatario}
                </div>
                <div style="margin-bottom: 15px;">
                  <strong>Endereço:</strong> ${volume.endereco}
                </div>
                <div style="margin-bottom: 15px;">
                  <strong>Cidade/UF:</strong> ${volume.cidadeCompleta}
                </div>
                <div style="margin-bottom: 15px;">
                  <strong>Peso Total:</strong> ${volume.pesoTotal}
                </div>
                <div style="margin-bottom: 15px;">
                  <strong>Transportadora:</strong> ${volume.transportadora}
                </div>
                <div style="margin-bottom: 15px; font-size: 12px;">
                  <strong>Código:</strong> ${volume.id}
                </div>
                ${volume.chaveNF ? `
                  <div style="margin-bottom: 15px; font-size: 10px;">
                    <strong>Chave NF:</strong> ${volume.chaveNF}
                  </div>
                ` : ''}
                ${volume.tipoVolume === 'quimico' ? `
                  <div style="border: 2px solid red; padding: 10px; background: yellow; text-align: center;">
                    <strong>⚠️ PRODUTO QUÍMICO ⚠️</strong><br>
                    ONU: ${volume.codigoONU || 'N/A'} | Risco: ${volume.codigoRisco || 'N/A'}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      console.log('PDF gerado e enviado para impressão');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  };

  return { generateEtiquetaPDF };
};
