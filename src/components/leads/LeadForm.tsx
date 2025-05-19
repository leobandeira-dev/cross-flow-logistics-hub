
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeadFormProps {
  selectedPackage: string;
  onClose: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ selectedPackage, onClose }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    mensagem: '',
    pacote: selectedPackage
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save lead to Supabase
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            empresa: formData.empresa,
            mensagem: formData.mensagem,
            pacote_interesse: formData.pacote,
            status: 'novo'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Entraremos em contato em breve.",
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
      toast({
        title: "Erro ao enviar solicitação",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Solicitar informações</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Preencha o formulário para receber mais informações sobre o pacote {selectedPackage}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input 
              id="nome" 
              name="nome" 
              placeholder="Seu nome completo" 
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="seu@email.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input 
              id="telefone" 
              name="telefone" 
              placeholder="(00) 00000-0000" 
              value={formData.telefone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="empresa">Nome da empresa</Label>
            <Input 
              id="empresa" 
              name="empresa" 
              placeholder="Nome da sua empresa" 
              value={formData.empresa}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem (opcional)</Label>
            <Textarea 
              id="mensagem" 
              name="mensagem" 
              placeholder="Conte-nos mais sobre suas necessidades..."
              value={formData.mensagem}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LeadForm;
