
// useEtiquetaHTML.ts
import { LayoutStyle } from './types';
import { getClassificacaoText } from '../../components/common/print/etiquetas/utils';

export const useEtiquetaHTML = () => {
  // Generate HTML for a label
  const generateEtiquetaHTML = (volume: any, tipoEtiqueta: string, layoutStyle: LayoutStyle, transportadoraLogo?: string) => {
    // Check if it's a chemical product
    const isQuimico = volume.tipoVolume === 'quimico';
    
    // Generate chemical product icon HTML if needed
    const quimicoIconHTML = isQuimico ? `
      <div style="position: absolute; top: 10px; right: 10px; background-color: #FEE2E2; border-radius: 50%; padding: 8px; border: 2px solid #EF4444;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #DC2626;">
          <circle cx="9" cy="12" r="1"></circle>
          <circle cx="15" cy="12" r="1"></circle>
          <path d="M8 20v2h8v-2"></path>
          <path d="m12.5 17-.5-1-.5 1h1z"></path>
          <path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"></path>
        </svg>
      </div>
    ` : '';
    
    // Get classification text
    const classificacaoText = getClassificacaoText(volume.classificacaoQuimica);
    
    // Header HTML with logo or text
    const headerHTML = transportadoraLogo ? `
      <div style="display: flex; justify-content: center;">
        <img 
          src="${transportadoraLogo}" 
          alt="Logo Transportadora" 
          style="width: auto; height: 48px; max-width: 200px; object-fit: contain;"
        />
      </div>
    ` : (tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'ETIQUETA DE VOLUME');
    
    // Enhanced Contrast layout template
    if (layoutStyle === 'enhanced_contrast') {
      return `
        <div class="etiqueta" style="width: 100%; height: 100%; padding: 15px; font-family: Arial; border: 3px solid #333; position: relative; background-color: #F9FAFB;">
          ${quimicoIconHTML}
          
          <!-- Header -->
          <div style="text-align: center; font-size: 18px; font-weight: 900; border-bottom: 2px solid #ccc; padding-bottom: 8px; margin-bottom: 15px;">
            ${headerHTML}
          </div>
          
          <div style="display: flex;">
            <!-- Coluna principal com informações -->
            <div style="flex: 2; padding-right: 15px;">
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">ID:</span> ${volume.id}
              </div>
              
              <!-- Nota Fiscal - CONTAINER PRETO -->
              <div style="background: #000000; border: 2px solid #374151; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
                <span style="color: white; font-weight: 700;">NF:</span> <span style="color: white; font-size: 20px; font-weight: 900;">${volume.notaFiscal || 'N/A'}</span>
              </div>
              
              <!-- Remetente - CONTAINER PRETO -->
              <div style="background: #000000; border: 2px solid #374151; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
                <span style="color: white; font-weight: 700;">Remetente:</span> <span style="color: white; font-size: 16px; font-weight: 700;">${volume.remetente || 'N/A'}</span>
              </div>
              
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">Destinatário:</span> ${volume.destinatario || 'N/A'}
              </div>
              
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">Endereço:</span> ${volume.endereco || 'N/A'}
              </div>
              
              <!-- Cidade Destino - CONTAINER PRETO -->
              <div style="background: #000000; border: 2px solid #374151; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
                <span style="color: white; font-weight: 700;">Cidade/UF:</span> <span style="color: white; font-size: 20px; font-weight: 900;">${volume.cidade || 'N/A'}</span>/<span style="color: white; font-size: 20px; font-weight: 900;">${volume.uf || 'N/A'}</span>
              </div>
              
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">Peso:</span> ${volume.pesoTotal || '0 Kg'}
              </div>
              
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">Transportadora:</span> ${volume.transportadora || 'N/D'}
              </div>
              
              ${isQuimico ? `
              <div style="font-size: 14px; margin-bottom: 8px; background-color: #FEE2E2; padding: 8px; border: 2px solid #FECACA; border-radius: 6px;">
                <span style="font-weight: 700;">Código ONU:</span> ${volume.codigoONU || 'N/A'}
              </div>
              <div style="font-size: 14px; margin-bottom: 8px; background-color: #FEE2E2; padding: 8px; border: 2px solid #FECACA; border-radius: 6px;">
                <span style="font-weight: 700;">Código de Risco:</span> ${volume.codigoRisco || 'N/A'}
              </div>
              <div style="font-size: 14px; margin-bottom: 8px; background-color: #FEE2E2; padding: 8px; border: 2px solid #FECACA; border-radius: 6px;">
                <span style="font-weight: 700;">Classificação:</span> ${classificacaoText}
              </div>
              ` : ''}
            </div>
            
            <!-- Coluna do QR Code -->
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              ${volume.qrCode ? 
                `<div style="background: white; padding: 8px; border-radius: 6px;"><img src="${volume.qrCode}" alt="QR Code" style="width: 100px; height: 100px;"></div>` : 
                `<div style="width: 100px; height: 100px; border: 2px solid #000; display: flex; justify-content: center; align-items: center; font-size: 12px; background: white; border-radius: 6px;">QR: ${volume.id}</div>`
              }
              <div style="text-align: center; font-size: 12px; margin-top: 8px; font-weight: 700;">${volume.id}</div>
            </div>
          </div>
          
          ${volume.descricao ? `
            <div style="font-size: 14px; margin-top: 8px; padding-top: 8px; border-top: 2px solid #ccc;">
              <span style="font-weight: 700;">Descrição:</span> ${volume.descricao}
            </div>
          ` : ''}
          
          ${tipoEtiqueta === 'mae' ? `
            <!-- Quantidade de Volumes - CONTAINER PRETO -->
            <div style="background: #000000; border: 2px solid #374151; border-radius: 6px; padding: 12px; margin-top: 8px; text-align: center;">
              <span style="color: white; font-weight: 700;">Total de volumes:</span> <span style="color: white; font-size: 20px; font-weight: 900;">${volume.quantidade || '0'}</span>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    // Portrait Contrast layout template
    if (layoutStyle === 'portrait_contrast') {
      return `
        <div class="etiqueta" style="width: 100%; height: 100%; padding: 15px; font-family: Arial; border: 3px solid #333; position: relative; display: flex; flex-direction: column; background-color: #F9FAFB;">
          ${isQuimico ? `<div style="position: absolute; top: 10px; right: 10px; color: #DC2626; font-size: 24px;">⚠</div>` : ''}
          
          <!-- Header -->
          <div style="text-align: center; padding: 12px; background: ${tipoEtiqueta === 'mae' ? '#EF4444' : '#2563EB'}; color: white; border-radius: 6px; margin-bottom: 15px;">
            ${transportadoraLogo ? `
              <div style="display: flex; justify-content: center;">
                <img 
                  src="${transportadoraLogo}" 
                  alt="Logo Transportadora" 
                  style="width: auto; height: 32px; max-width: 150px; object-fit: contain;"
                />
              </div>
            ` : `
              <span style="font-size: 18px; font-weight: 900;">
                ${tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'ETIQUETA DE VOLUME'}
              </span>
            `}
          </div>

          <!-- QR Code Section -->
          <div style="text-align: center; margin-bottom: 15px;">
            <div style="background: white; display: inline-block; padding: 12px; border-radius: 6px;">
              ${volume.qrCode ? 
                `<img src="${volume.qrCode}" alt="QR Code" style="width: 100px; height: 100px;">` : 
                `<div style="width: 100px; height: 100px; border: 2px solid #000; display: flex; justify-content: center; align-items: center; font-size: 12px;">QR: ${volume.id}</div>`
              }
            </div>
            <div style="font-size: 14px; margin-top: 8px; font-weight: 700;">${volume.id}</div>
          </div>
          
          <!-- Nota Fiscal - CONTAINER PRETO -->
          <div style="background: #000000; border: 3px solid #374151; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 12px;">
            <div style="color: white; font-size: 12px; font-weight: 900; margin-bottom: 8px;">NOTA FISCAL</div>
            <div style="color: white; font-size: 24px; font-weight: 900;">${volume.notaFiscal || 'N/A'}</div>
          </div>
          
          <!-- Cidade Destino - CONTAINER PRETO -->
          <div style="background: #000000; border: 3px solid #374151; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 12px;">
            <div style="color: white; font-size: 12px; font-weight: 900; margin-bottom: 8px;">CIDADE DESTINO</div>
            <div style="color: white; font-size: 20px; font-weight: 900; margin-bottom: 4px;">${volume.cidade || 'N/A'}</div>
            <div style="color: white; font-size: 16px; font-weight: 700;">${volume.uf || 'N/A'}</div>
          </div>
          
          <!-- Remetente - CONTAINER PRETO -->
          <div style="background: #000000; border: 3px solid #374151; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
            <div style="color: white; font-size: 12px; font-weight: 900; margin-bottom: 8px;">REMETENTE</div>
            <div style="color: white; font-size: 16px; font-weight: 900; line-height: 1.2;">${volume.remetente || 'N/A'}</div>
          </div>

          ${tipoEtiqueta === 'mae' ? `
          <!-- Quantidade de Volumes - CONTAINER PRETO -->
          <div style="background: #000000; border: 3px solid #374151; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 12px;">
            <div style="color: white; font-size: 12px; font-weight: 900; margin-bottom: 8px;">TOTAL DE VOLUMES</div>
            <div style="color: white; font-size: 24px; font-weight: 900;">${volume.quantidade || '0'}</div>
          </div>
          ` : ''}

          <!-- Destinatário -->
          <div style="background: #EDE9FE; border: 3px solid #8B5CF6; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
            <div style="font-size: 12px; color: #5B21B6; font-weight: 700; margin-bottom: 4px;">DESTINATÁRIO</div>
            <div style="font-size: 16px; font-weight: 700; color: #1F2937; line-height: 1.2;">${volume.destinatario || 'N/A'}</div>
          </div>

          <!-- Informações Adicionais -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: #F3F4F6; padding: 8px; border-radius: 4px;">
              <span style="font-size: 12px; color: #6B7280;">Peso:</span>
              <div style="font-size: 14px; font-weight: 700; margin-top: 4px;">${volume.pesoTotal}</div>
            </div>
            <div style="background: #F3F4F6; padding: 8px; border-radius: 4px;">
              <span style="font-size: 12px; color: #6B7280;">Transp:</span>
              <div style="font-size: 12px; font-weight: 700; margin-top: 4px;">${volume.transportadora || 'N/D'}</div>
            </div>
          </div>

          ${isQuimico ? `
          <!-- Produto Químico -->
          <div style="background: #FEE2E2; border: 2px solid #EF4444; border-radius: 6px; padding: 10px; margin-top: auto;">
            <div style="text-align: center; margin-bottom: 8px;">
              <span style="font-size: 14px; font-weight: 700; color: #DC2626;">⚠ PRODUTO QUÍMICO ⚠</span>
            </div>
            <div style="text-align: center; font-size: 12px;">
              <div><span style="font-weight: 700;">ONU:</span> ${volume.codigoONU || 'N/A'}</div>
              <div><span style="font-weight: 700;">RISCO:</span> ${volume.codigoRisco || 'N/A'}</div>
              <div><span style="font-weight: 700;">CLASS:</span> ${classificacaoText}</div>
            </div>
          </div>
          ` : ''}
          
          ${volume.endereco ? `
            <div style="font-size: 12px; color: #6B7280; text-align: center; border-top: 1px solid #D1D5DB; padding-top: 8px; margin-top: auto;">
              <span style="font-weight: 600;">End:</span> ${volume.endereco}
            </div>
          ` : ''}
        </div>
      `;
    }
    
    // Portrait layout template for larger text size and vertical orientation
    if (layoutStyle === 'portrait') {
      return `
        <div class="etiqueta" style="width: 100%; height: 100%; padding: 15px; font-family: Arial; border: 3px solid #333; position: relative; display: flex; flex-direction: column;">
          ${isQuimico ? `<div style="position: absolute; top: 10px; right: 10px; color: #DC2626; font-size: 24px;">⚠</div>` : ''}
          
          <!-- Header -->
          <div style="text-align: center; padding: 12px; background: ${tipoEtiqueta === 'mae' ? '#EF4444' : '#2563EB'}; color: white; border-radius: 6px; margin-bottom: 15px;">
            ${transportadoraLogo ? `
              <div style="display: flex; justify-content: center;">
                <img 
                  src="${transportadoraLogo}" 
                  alt="Logo Transportadora" 
                  style="width: auto; height: 32px; max-width: 150px; object-fit: contain;"
                />
              </div>
            ` : `
              <span style="font-size: 18px; font-weight: 900;">
                ${tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'ETIQUETA DE VOLUME'}
              </span>
            `}
          </div>
          
          <!-- QR Code -->
          <div style="text-align: center; margin-bottom: 15px;">
            ${volume.qrCode ? 
              `<img src="${volume.qrCode}" alt="QR Code" style="width: 100px; height: 100px;">` : 
              `<div style="width: 100px; height: 100px; border: 2px solid #000; display: inline-flex; justify-content: center; align-items: center; font-size: 12px;">QR: ${volume.id}</div>`
            }
            <div style="font-size: 14px; margin-top: 8px; font-weight: 700;">${volume.id}</div>
          </div>
          
          <!-- Nota Fiscal - DESTAQUE -->
          <div style="background: #FEF3C7; border: 3px solid #F59E0B; border-radius: 8px; padding: 12px; text-align: center; margin-bottom: 12px;">
            <div style="font-size: 12px; color: #92400E;">NOTA FISCAL</div>
            <div style="font-size: 24px; font-weight: 900; color: #1F2937;">${volume.notaFiscal || 'N/A'}</div>
          </div>
          
          <!-- Cidade Destino - DESTAQUE -->
          <div style="background: #D1FAE5; border: 3px solid #10B981; border-radius: 8px; padding: 12px; text-align: center; margin-bottom: 12px;">
            <div style="font-size: 12px; color: #065F46;">CIDADE DESTINO</div>
            <div style="font-size: 20px; font-weight: 900; color: #1F2937;">${volume.cidade || 'N/A'}</div>
            <div style="font-size: 16px; font-weight: 700; color: #374151;">${volume.uf || 'N/A'}</div>
          </div>
          
          <!-- Remetente - DESTAQUE -->
          <div style="background: #DBEAFE; border: 3px solid #3B82F6; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
            <div style="font-size: 12px; color: #1E40AF; font-weight: 700;">REMETENTE</div>
            <div style="font-size: 16px; font-weight: 900; color: #1F2937; line-height: 1.2;">${volume.remetente || 'N/A'}</div>
          </div>
          
          <!-- Destinatário - DESTAQUE -->
          <div style="background: #EDE9FE; border: 3px solid #8B5CF6; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
            <div style="font-size: 12px; color: #5B21B6; font-weight: 700;">DESTINATÁRIO</div>
            <div style="font-size: 16px; font-weight: 900; color: #1F2937; line-height: 1.2;">${volume.destinatario || 'N/A'}</div>
          </div>
          
          <!-- Informações Adicionais -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
            <div style="background: #F3F4F6; padding: 8px; border-radius: 6px;">
              <span style="font-size: 12px; color: #6B7280;">Peso:</span>
              <div style="font-size: 14px; font-weight: 700;">${volume.pesoTotal || '0 Kg'}</div>
            </div>
            <div style="background: #F3F4F6; padding: 8px; border-radius: 6px;">
              <span style="font-size: 12px; color: #6B7280;">Transp:</span>
              <div style="font-size: 12px; font-weight: 700;">${volume.transportadora || 'N/D'}</div>
            </div>
          </div>
          
          ${isQuimico ? `
          <div style="background: #FEE2E2; border: 3px solid #EF4444; border-radius: 8px; padding: 12px; margin-top: auto;">
            <div style="text-align: center; margin-bottom: 8px;">
              <span style="font-size: 14px; font-weight: 900; color: #DC2626;">⚠ PRODUTO QUÍMICO ⚠</span>
            </div>
            <div style="text-align: center; font-size: 12px;">
              <div><span style="font-weight: 900;">ONU:</span> ${volume.codigoONU || 'N/A'}</div>
              <div><span style="font-weight: 900;">RISCO:</span> ${volume.codigoRisco || 'N/A'}</div>
              <div><span style="font-weight: 900;">CLASS:</span> ${classificacaoText}</div>
            </div>
          </div>
          ` : ''}
          
          ${volume.endereco ? `
            <div style="font-size: 12px; color: #6B7280; text-align: center; border-top: 1px solid #D1D5DB; padding-top: 8px; margin-top: auto;">
              <span style="font-weight: 700;">End:</span> ${volume.endereco}
            </div>
          ` : ''}
          
          ${volume.descricao ? `
            <div style="font-size: 12px; margin-top: 8px; padding-top: 8px; border-top: 2px solid #D1D5DB;">
              <span style="font-weight: 900;">Descrição:</span> ${volume.descricao}
            </div>
          ` : ''}
          
          ${tipoEtiqueta === 'mae' ? `
            <div style="background: #EDE9FE; border: 3px solid #8B5CF6; border-radius: 8px; padding: 12px; text-align: center; margin-top: 8px;">
              <div style="font-size: 12px; color: #5B21B6;">TOTAL DE VOLUMES</div>
              <div style="font-size: 24px; font-weight: 900; color: #1F2937;">${volume.quantidade || '0'}</div>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    // Enhanced readability template for larger text size
    if (layoutStyle === 'enhanced') {
      return `
        <div class="etiqueta" style="width: 100%; height: 100%; padding: 15px; font-family: Arial; border: 3px solid #333; position: relative;">
          ${quimicoIconHTML}
          <div style="font-size: 18px; font-weight: 900; text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 8px; margin-bottom: 15px;">
            ${headerHTML}
          </div>
          <div style="display: flex; margin-top: 10px;">
            <div style="flex: 2; padding-right: 15px;">
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">ID:</span> ${volume.id}
              </div>
              <div style="font-size: 14px; margin-bottom: 8px; background-color: #FEF3C7; padding: 8px; border: 2px solid #F59E0B; border-radius: 6px;">
                <span style="font-weight: 700;">NF:</span> <span style="font-size: 20px; font-weight: 900;">${volume.notaFiscal || 'N/A'}</span>
              </div>
              <div style="font-size: 14px; margin-bottom: 8px; background-color: #DBEAFE; padding: 8px; border: 2px solid #3B82F6; border-radius: 6px;">
                <span style="font-weight: 700;">Remetente:</span> <span style="font-size: 16px; font-weight: 700;">${volume.remetente || 'N/A'}</span>
              </div>
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">Destinatário:</span> ${volume.destinatario || 'N/A'}
              </div>
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">Endereço:</span> ${volume.endereco || 'N/A'}
              </div>
              <div style="font-size: 16px; margin-bottom: 8px; background-color: #D1FAE5; padding: 8px; border: 2px solid #10B981; border-radius: 6px;">
                <span style="font-weight: 700;">Cidade/UF:</span> <span style="font-size: 20px; font-weight: 900;">${volume.cidade || 'N/A'}</span>/<span style="font-size: 20px; font-weight: 900;">${volume.uf || 'N/A'}</span>
              </div>
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">Peso:</span> ${volume.pesoTotal || '0 Kg'}
              </div>
              <div style="font-size: 14px; margin-bottom: 8px;">
                <span style="font-weight: 700;">Transportadora:</span> ${volume.transportadora || 'N/D'}
              </div>
              
              ${isQuimico ? `
              <div style="font-size: 14px; margin-bottom: 8px; background-color: #FEE2E2; padding: 8px; border: 2px solid #FECACA; border-radius: 6px;">
                <span style="font-weight: 700;">Código ONU:</span> ${volume.codigoONU || 'N/A'}
              </div>
              <div style="font-size: 14px; margin-bottom: 8px; background-color: #FEE2E2; padding: 8px; border: 2px solid #FECACA; border-radius: 6px;">
                <span style="font-weight: 700;">Código de Risco:</span> ${volume.codigoRisco || 'N/A'}
              </div>
              <div style="font-size: 14px; margin-bottom: 8px; background-color: #FEE2E2; padding: 8px; border: 2px solid #FECACA; border-radius: 6px;">
                <span style="font-weight: 700;">Classificação:</span> ${classificacaoText}
              </div>
              ` : ''}
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              ${volume.qrCode ? 
                `<div style="background: white; padding: 8px; border-radius: 6px;"><img src="${volume.qrCode}" alt="QR Code" style="width: 100px; height: 100px;"></div>` : 
                `<div style="width: 100px; height: 100px; border: 2px solid #000; display: flex; justify-content: center; align-items: center; font-size: 12px; background: white; border-radius: 6px;">QR: ${volume.id}</div>`
              }
              <div style="text-align: center; font-size: 12px; margin-top: 8px; font-weight: 700;">${volume.id}</div>
            </div>
          </div>
          ${volume.descricao ? `
            <div style="font-size: 14px; margin-top: 8px; padding-top: 8px; border-top: 2px solid #ccc;">
              <span style="font-weight: 700;">Descrição:</span> ${volume.descricao}
            </div>
          ` : ''}
          ${tipoEtiqueta === 'mae' ? `
            <div style="font-size: 16px; margin-top: 8px; padding-top: 8px; border-top: 2px solid #ccc; background-color: #EDE9FE; padding: 8px; border-radius: 6px; border: 2px solid #8B5CF6;">
              <span style="font-weight: 700;">Total de volumes:</span> <span style="font-size: 20px; font-weight: 900;">${volume.quantidade || '0'}</span>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    // Default template for other layouts
    return `
      <div class="etiqueta" style="width: 100%; height: 100%; padding: 10px; font-family: Arial; border: 1px solid #ccc; position: relative;">
        ${quimicoIconHTML}
        <div style="font-size: 16px; font-weight: bold; text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
          ${headerHTML}
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
