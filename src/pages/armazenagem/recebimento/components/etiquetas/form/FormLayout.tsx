
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotaFiscalFields from './NotaFiscalFields';
import VolumeFields from './VolumeFields';
import VolumeTypeFields from './VolumeTypeFields';
import VolumeAreaFields from './VolumeAreaFields';
import PrintConfigFields from './PrintConfigFields';
import FormActions from './FormActions';

interface FormLayoutProps {
  form: any;
  onGenerateVolumes: () => void;
  isGenerating: boolean;
}

const FormLayout: React.FC<FormLayoutProps> = ({ form, onGenerateVolumes, isGenerating }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Etiquetas</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            <NotaFiscalFields form={form} />
            <Separator />
            <VolumeFields form={form} />
            <Separator />
            <VolumeTypeFields form={form} />
            <Separator />
            <VolumeAreaFields form={form} />
            <Separator />
            <PrintConfigFields form={form} />
            <Separator />
            <FormActions onGenerateVolumes={onGenerateVolumes} isGenerating={isGenerating} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FormLayout;
