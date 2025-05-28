
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface VolumeAreaFieldsProps {
  form: any;
}

const VolumeAreaFields: React.FC<VolumeAreaFieldsProps> = ({ form }) => {
  const areas = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <MapPin size={20} className="text-blue-600" />
        <h3 className="text-lg font-medium">Área de Destino</h3>
      </div>
      
      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Área</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área de destino" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    <div className="flex items-center">
                      <MapPin size={16} className="text-blue-500 mr-2" />
                      <span className="font-medium">Área {area}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};

export default VolumeAreaFields;
