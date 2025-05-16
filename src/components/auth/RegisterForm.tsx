
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

type RegisterFormData = {
  nome: string;
  email: string;
  telefone?: string;
  password: string;
};

interface RegisterFormProps {
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setActiveTab: (tab: string) => void;
}

export const RegisterForm = ({ setError, setSuccess, setActiveTab }: RegisterFormProps) => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<RegisterFormData>();

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await signUp(data.email, data.password, data.nome, data.telefone);
      setActiveTab('login');
      setSuccess('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar o cadastro.');
    } catch (error: any) {
      setError(error?.message || 'Ocorreu um erro ao fazer cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          placeholder="Seu nome completo"
          {...register('nome', { required: true })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="seu@email.com"
          {...register('email', { required: true })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone (opcional)</Label>
        <Input
          id="telefone"
          placeholder="(00) 00000-0000"
          {...register('telefone')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Senha</Label>
        <Input
          id="register-password"
          type="password"
          {...register('password', { required: true })}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </form>
  );
};
