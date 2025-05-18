
import React, { useState } from 'react';
import { NotaFiscalVolume, VolumeItem, generateVolumeId, calcularVolume, calcularPesoCubado, calcularTotaisNota, formatarNumero } from '../../utils/volumeCalculations';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, Plus, PackageOpen } from 'lucide-react';

interface NotaFiscalCardProps {
  index: number;
  nf: NotaFiscalVolume;
  onRemove: () => void;
  onUpdateNumeroNF: (numeroNF: string) => void;
  onUpdateRemetente: (remetente: string) => void;
  onUpdateDestinatario: (destinatario: string) => void;
  onUpdateValorTotal: (valorTotal: string) => void;
  onUpdateVolumes: (volumes: VolumeItem[]) => void;
  isReadOnly?: boolean;
}

const NotaFiscalCard: React.FC<NotaFiscalCardProps> = ({
  index,
  nf,
  onRemove,
  onUpdateNumeroNF,
  onUpdateRemetente,
  onUpdateDestinatario,
  onUpdateValorTotal,
  onUpdateVolumes,
  isReadOnly = false
}) => {
  const [newVolume, setNewVolume] = useState<Partial<VolumeItem>>({
    altura: 0,
    largura: 0,
    comprimento: 0,
    peso: 0,
    quantidade: 1
  });

  const handleVolumeChange = (field: keyof VolumeItem, value: string) => {
    setNewVolume(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleAddVolume = () => {
    if (newVolume.altura && newVolume.largura && newVolume.comprimento && newVolume.peso) {
      const volume: VolumeItem = {
        id: generateVolumeId(),
        altura: newVolume.altura || 0,
        largura: newVolume.largura || 0,
        comprimento: newVolume.comprimento || 0,
        peso: newVolume.peso || 0,
        quantidade: newVolume.quantidade || 1
      };
      
      onUpdateVolumes([...nf.volumes, volume]);
      
      // Reset form
      setNewVolume({
        altura: 0,
        largura: 0,
        comprimento: 0,
        peso: 0,
        quantidade: 1
      });
    }
  };

  const handleRemoveVolume = (volumeId: string) => {
    const updatedVolumes = nf.volumes.filter(v => v.id !== volumeId);
    onUpdateVolumes(updatedVolumes);
  };

  const handleUpdateVolume = (volumeId: string, field: keyof VolumeItem, value: string) => {
    const updatedVolumes = nf.volumes.map(v => {
      if (v.id === volumeId) {
        return {
          ...v,
          [field]: parseFloat(value) || 0
        };
      }
      return v;
    });
    
    onUpdateVolumes(updatedVolumes);
  };

  const totais = calcularTotaisNota(nf.volumes);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Nº Nota Fiscal</label>
                <Input
                  value={nf.numeroNF}
                  onChange={(e) => onUpdateNumeroNF(e.target.value)}
                  className="mt-1"
                  placeholder="Número da NF"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Remetente</label>
                <Input
                  value={nf.remetente}
                  onChange={(e) => onUpdateRemetente(e.target.value)}
                  className="mt-1"
                  placeholder="Remetente"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Destinatário</label>
                <Input
                  value={nf.destinatario}
                  onChange={(e) => onUpdateDestinatario(e.target.value)}
                  className="mt-1"
                  placeholder="Destinatário"
                  disabled={isReadOnly}
                />
              </div>
            </div>
            <div className="mt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Valor Total (R$)</label>
                  <Input
                    value={nf.valorTotal.toString()}
                    onChange={(e) => onUpdateValorTotal(e.target.value)}
                    className="mt-1"
                    placeholder="Valor total"
                    type="number"
                    disabled={isReadOnly}
                  />
                </div>
                {nf.dataEmissao && (
                  <div>
                    <label className="text-xs text-muted-foreground">Data de Emissão</label>
                    <Input
                      value={new Date(nf.dataEmissao).toLocaleDateString()}
                      className="mt-1"
                      readOnly
                    />
                  </div>
                )}
                {nf.chaveNF && (
                  <div>
                    <label className="text-xs text-muted-foreground">Chave NF</label>
                    <Input
                      value={nf.chaveNF}
                      className="mt-1"
                      readOnly
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={onRemove} disabled={isReadOnly}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <PackageOpen className="h-4 w-4 mr-1 text-cross-blue" /> Volumes
        </h4>
        
        {/* Volumes list */}
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          {nf.volumes.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Nenhum volume adicionado</p>
          ) : (
            <div className="mb-3">
              <div className="grid grid-cols-8 gap-2 text-xs font-medium text-gray-500 mb-2">
                <div className="col-span-1">Seq</div>
                <div className="col-span-1">Alt. (cm)</div>
                <div className="col-span-1">Larg. (cm)</div>
                <div className="col-span-1">Comp. (cm)</div>
                <div className="col-span-1">Peso (kg)</div>
                <div className="col-span-1">Qtde</div>
                <div className="col-span-1">Vol. (m³)</div>
                <div className="col-span-1"></div>
              </div>
              
              {nf.volumes.map((volume, idx) => (
                <div key={volume.id} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="col-span-1">
                    <Input
                      value={idx + 1}
                      readOnly
                      className="h-8 text-xs text-center"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={volume.altura}
                      onChange={(e) => handleUpdateVolume(volume.id, 'altura', e.target.value)}
                      className="h-8 text-xs"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={volume.largura}
                      onChange={(e) => handleUpdateVolume(volume.id, 'largura', e.target.value)}
                      className="h-8 text-xs"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={volume.comprimento}
                      onChange={(e) => handleUpdateVolume(volume.id, 'comprimento', e.target.value)}
                      className="h-8 text-xs"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={volume.peso}
                      onChange={(e) => handleUpdateVolume(volume.id, 'peso', e.target.value)}
                      className="h-8 text-xs"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={volume.quantidade}
                      onChange={(e) => handleUpdateVolume(volume.id, 'quantidade', e.target.value)}
                      className="h-8 text-xs"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={formatarNumero(calcularVolume(volume))}
                      readOnly
                      className="h-8 text-xs text-right"
                    />
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveVolume(volume.id)} 
                      className="h-8 px-2" 
                      disabled={isReadOnly}
                    >
                      <Trash className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Totals */}
              <div className="grid grid-cols-8 gap-2 mt-4 pt-2 border-t border-gray-200">
                <div className="col-span-5 text-right pr-2 text-sm font-medium">Totais:</div>
                <div className="col-span-1 text-center">
                  <span className="text-sm font-semibold">{totais.qtdVolumes}</span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-sm font-semibold">{formatarNumero(totais.volumeTotal)}</span>
                </div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="grid grid-cols-5 gap-2 mt-4 text-sm">
                <div className="col-span-2 flex flex-col">
                  <span className="font-medium">Peso Real: <span className="font-semibold">{formatarNumero(totais.pesoTotal)} kg</span></span>
                </div>
                <div className="col-span-3 flex flex-col">
                  <span className="font-medium">Peso Cubado: <span className="font-semibold">{formatarNumero(totais.pesoCubadoTotal)} kg</span></span>
                  <span className="text-xs text-muted-foreground">(Cálculo: {formatarNumero(totais.volumeTotal)} m³ × 300)</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Add volume form */}
        {!isReadOnly && (
          <div className="grid grid-cols-8 gap-2">
            <div className="col-span-1">
              <label className="text-xs text-muted-foreground">Alt. (cm)</label>
              <Input
                value={newVolume.altura || ''}
                onChange={(e) => handleVolumeChange('altura', e.target.value)}
                className="h-8 text-xs"
                placeholder="0"
                type="number"
              />
            </div>
            <div className="col-span-1">
              <label className="text-xs text-muted-foreground">Larg. (cm)</label>
              <Input
                value={newVolume.largura || ''}
                onChange={(e) => handleVolumeChange('largura', e.target.value)}
                className="h-8 text-xs"
                placeholder="0"
                type="number"
              />
            </div>
            <div className="col-span-1">
              <label className="text-xs text-muted-foreground">Comp. (cm)</label>
              <Input
                value={newVolume.comprimento || ''}
                onChange={(e) => handleVolumeChange('comprimento', e.target.value)}
                className="h-8 text-xs"
                placeholder="0"
                type="number"
              />
            </div>
            <div className="col-span-1">
              <label className="text-xs text-muted-foreground">Peso (kg)</label>
              <Input
                value={newVolume.peso || ''}
                onChange={(e) => handleVolumeChange('peso', e.target.value)}
                className="h-8 text-xs"
                placeholder="0"
                type="number"
              />
            </div>
            <div className="col-span-1">
              <label className="text-xs text-muted-foreground">Qtde</label>
              <Input
                value={newVolume.quantidade || 1}
                onChange={(e) => handleVolumeChange('quantidade', e.target.value)}
                className="h-8 text-xs"
                placeholder="1"
                type="number"
                min="1"
              />
            </div>
            <div className="col-span-3 flex items-end">
              <Button 
                onClick={handleAddVolume}
                className="h-8"
                disabled={!newVolume.altura || !newVolume.largura || !newVolume.comprimento || !newVolume.peso}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Volume
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotaFiscalCard;
