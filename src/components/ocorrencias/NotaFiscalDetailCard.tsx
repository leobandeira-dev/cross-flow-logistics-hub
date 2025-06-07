import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { FileText, Truck, Map, Package, FileDown, Eye, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NotaFiscalDetailCardProps {
  notaFiscalData: any;
  xmlContent?: string | null;
  onViewDanfe?: () => void;
  onViewXml?: () => void;
  onDownload?: () => void;
}

const NotaFiscalDetailCard: React.FC<NotaFiscalDetailCardProps> = ({
  notaFiscalData,
  xmlContent,
  onViewDanfe,
  onViewXml,
  onDownload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Detalhes da Nota Fiscal
        </CardTitle>
        <CardDescription>
          Informações detalhadas do documento fiscal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Informações Gerais</TabsTrigger>
            <TabsTrigger value="transport">Transporte</TabsTrigger>
            <TabsTrigger value="delivery">Entrega</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Número NF</Label>
                <p className="text-sm font-medium">{notaFiscalData.numero}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Série</Label>
                <p className="text-sm font-medium">{notaFiscalData.serie}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Chave de Acesso</Label>
                <p className="text-sm font-medium">{notaFiscalData.chaveAcesso}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Data de Emissão</Label>
                <p className="text-sm font-medium">{notaFiscalData.dataEmissao}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm text-muted-foreground">Emitente</Label>
              <p className="text-sm font-medium">{notaFiscalData.emitente?.nome}</p>
              <p className="text-xs text-muted-foreground">{notaFiscalData.emitente?.cnpj}</p>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Destinatário</Label>
              <p className="text-sm font-medium">{notaFiscalData.destinatario?.nome}</p>
              <p className="text-xs text-muted-foreground">{notaFiscalData.destinatario?.cnpj}</p>
            </div>
          </TabsContent>

          <TabsContent value="transport" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Transportadora</Label>
                <p className="text-sm font-medium">{notaFiscalData.transportadora?.nome}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">CNPJ</Label>
                <p className="text-sm font-medium">{notaFiscalData.transportadora?.cnpj}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Placa do Veículo</Label>
                <p className="text-sm font-medium">{notaFiscalData.placaVeiculo}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">UF</Label>
                <p className="text-sm font-medium">{notaFiscalData.ufVeiculo}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Volumes</Label>
              <div className="flex items-center gap-4 mt-1">
                <div>
                  <p className="text-sm font-medium">{notaFiscalData.quantidadeVolumes}</p>
                  <p className="text-xs text-muted-foreground">Quantidade</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{notaFiscalData.especieVolumes}</p>
                  <p className="text-xs text-muted-foreground">Espécie</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{notaFiscalData.pesoLiquido} kg</p>
                  <p className="text-xs text-muted-foreground">Peso Líquido</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{notaFiscalData.pesoBruto} kg</p>
                  <p className="text-xs text-muted-foreground">Peso Bruto</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Endereço de Entrega</Label>
              <p className="text-sm font-medium">
                {notaFiscalData.enderecoEntrega?.logradouro}, {notaFiscalData.enderecoEntrega?.numero}
              </p>
              <p className="text-xs text-muted-foreground">
                {notaFiscalData.enderecoEntrega?.bairro} - {notaFiscalData.enderecoEntrega?.cidade}/{notaFiscalData.enderecoEntrega?.uf}
              </p>
              <p className="text-xs text-muted-foreground">
                CEP: {notaFiscalData.enderecoEntrega?.cep}
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Data Prevista</Label>
                <p className="text-sm font-medium">{notaFiscalData.dataPrevistaEntrega}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Janela de Horário</Label>
                <p className="text-sm font-medium">{notaFiscalData.janelaHorario}</p>
              </div>
            </div>
            
            {notaFiscalData.observacoesEntrega && (
              <div>
                <Label className="text-sm text-muted-foreground">Observações</Label>
                <p className="text-sm">{notaFiscalData.observacoesEntrega}</p>
              </div>
            )}
            
            {notaFiscalData.responsavelEntrega && (
              <div>
                <Label className="text-sm text-muted-foreground">Responsável pela Entrega</Label>
                <p className="text-sm font-medium">{notaFiscalData.responsavelEntrega}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {(onViewDanfe || onViewXml || onDownload) && (
        <CardFooter className="border-t pt-4 flex justify-end space-x-2">
          {onViewDanfe && (
            <Button variant="outline" size="sm" onClick={onViewDanfe}>
              <Eye className="h-4 w-4 mr-1" />
              Ver DANFE
            </Button>
          )}
          {onViewXml && xmlContent && (
            <Button variant="outline" size="sm" onClick={onViewXml}>
              <FileText className="h-4 w-4 mr-1" />
              Ver XML
            </Button>
          )}
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <FileDown className="h-4 w-4 mr-1" />
              Download
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default NotaFiscalDetailCard;
