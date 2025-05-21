
// useEtiquetaHTML.ts
import { LayoutStyle } from './types';
import { getClassificacaoText } from '../../components/common/print/etiquetas/utils';

export const useEtiquetaHTML = () => {
  // Generate HTML for a label
  const generateEtiquetaHTML = (volume: any, tipoEtiqueta: string, layoutStyle: LayoutStyle) => {
    // Check if it's a chemical product
    const isQuimico = volume.tipoVolume === 'quimico';
    
    // Generate chemical product icon HTML if needed
    const quimicoIconHTML = isQuimico ? `
      <div style="position: absolute; top: 10px; right: 10px; background-color: #FEE2E2; border-radius: 50%; padding: 8px; border: 2px solid #EF4444;">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #DC2626;">
          <path d="M8.65 3.35 5.86 6.14a8 8 0 1 0 11.31 0L14.38 3.35a.2.2 0 0 0-.28 0l-1.96 1.96a.2.2 0 0 1-.28 0L9.9 3.35a.2.2 0 0 0-.28 0Z"></path>
          <path d="M12 8v12"></path>
          <path d="M8.65 14h6.7"></path>
        </svg>
      </div>
    ` : '';
    
    // Get classification text
    const classificacaoText = getClassificacaoText(volume.classificacaoQuimica);
    
    // Template HTML based on the requested layout
    return `
      <div class="etiqueta" style="width: 100%; height: 100%; padding: 10px; font-family: Arial; border: 1px solid #ccc; position: relative;">
        ${quimicoIconHTML}
        <div style="font-size: 16px; font-weight: bold; text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
          ${tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'ETIQUETA DE VOLUME'}
        </div>
        <div style="display: flex; margin-top: 10px;">
          <div style="flex: 2; padding-right: 10px;">
            <div style="font-size: 12px; margin-bottom: 5px;">
              <span style="font-weight: bold;">ID:</span> ${volume.id}
            </div>
            <div style="font-size: 12px; margin-bottom: 5px; background-color: #FFEB3B; padding: 2px 5px; border: 1px solid #FBC02D; border-radius: 3px;">
              <span style="font-weight: bold;">NF:</span> ${volume.notaFiscal || 'N/A'}
            </div>
            <div style="font-size: 12px; margin-bottom: 5px; background-color: #E3F2FD; padding: 2px 5px; border: 1px solid #BBDEFB; border-radius: 3px;">
              <span style="font-weight: bold;">Remetente:</span> ${volume.remetente || 'N/A'}
            </div>
            <div style="font-size: 12px; margin-bottom: 5px;">
              <span style="font-weight: bold;">Destinatário:</span> ${volume.destinatario || 'N/A'}
            </div>
            <div style="font-size: 12px; margin-bottom: 5px;">
              <span style="font-weight: bold;">Endereço:</span> ${volume.endereco || 'N/A'}
            </div>
            <div style="font-size: 12px; margin-bottom: 5px; background-color: #E8F5E9; padding: 2px 5px; border: 1px solid #C8E6C9; border-radius: 3px;">
              <span style="font-weight: bold;">Cidade/UF:</span> ${volume.cidade || 'N/A'}/${volume.uf || 'N/A'}
            </div>
            <div style="font-size: 12px; margin-bottom: 5px;">
              <span style="font-weight: bold;">Peso:</span> ${volume.pesoTotal || '0 Kg'}
            </div>
            <div style="font-size: 12px; margin-bottom: 5px;">
              <span style="font-weight: bold;">Transportadora:</span> ${volume.transportadora || 'N/D'}
            </div>
            ${isQuimico ? `
            <div style="font-size: 12px; margin-bottom: 5px; background-color: #FFEBEE; padding: 2px 5px; border: 1px solid #FFCDD2; border-radius: 3px;">
              <span style="font-weight: bold;">Código ONU:</span> ${volume.codigoONU || 'N/A'}
            </div>
            <div style="font-size: 12px; margin-bottom: 5px; background-color: #FFEBEE; padding: 2px 5px; border: 1px solid #FFCDD2; border-radius: 3px;">
              <span style="font-weight: bold;">Código de Risco:</span> ${volume.codigoRisco || 'N/A'}
            </div>
            <div style="font-size: 12px; margin-bottom: 5px; background-color: #FFEBEE; padding: 2px 5px; border: 1px solid #FFCDD2; border-radius: 3px;">
              <span style="font-weight: bold;">Classificação:</span> ${classificacaoText}
            </div>
            ` : ''}
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            ${volume.qrCode ? 
              `<img src="${volume.qrCode}" alt="QR Code" style="width: 80px; height: 80px;">` : 
              `<div style="width: 80px; height: 80px; border: 1px solid #000; display: flex; justify-content: center; align-items: center; font-size: 10px;">QR Code: ${volume.id}</div>`
            }
            <div style="text-align: center; font-size: 10px; margin-top: 5px;">${volume.id}</div>
          </div>
        </div>
        ${volume.descricao ? `
          <div style="font-size: 12px; margin-top: 5px; padding-top: 5px; border-top: 1px solid #ccc;">
            <span style="font-weight: bold;">Descrição:</span> ${volume.descricao}
          </div>
        ` : ''}
        ${tipoEtiqueta === 'mae' ? `
          <div style="font-size: 12px; margin-top: 5px; padding-top: 5px; border-top: 1px solid #ccc;">
            <span style="font-weight: bold;">Total de volumes:</span> ${volume.quantidade || '0'}
          </div>
        ` : ''}
      </div>
    `;
  };

  return { generateEtiquetaHTML };
};
