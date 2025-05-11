
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Validação de formulários
const loginSchema = z.object({
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

const registerSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Digite um e-mail válido' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const AuthPage = () => {
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usar o parâmetro de URL para definir a tab ativa
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const registerParam = params.get('register');
    const resetParam = params.get('reset');
    
    if (registerParam === 'true') {
      setActiveTab('register');
    } else if (resetParam === 'true') {
      setActiveTab('reset');
    }
  }, [location]);

  // Redirecionar se o usuário já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Configuração dos formulários
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  // Funções de submissão
  const handleLogin = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        throw new Error(error.message);
      }
      // Login bem-sucedido, redirecionamento é feito pelo useEffect
    } catch (error: any) {
      toast({
        title: "Falha no login",
        description: error.message || "Ocorreu um erro ao fazer login. Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUp(values.email, values.password);
      if (error) {
        throw new Error(error.message);
      }
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu e-mail para confirmar seu cadastro.",
      });
      setActiveTab("login");
    } catch (error: any) {
      toast({
        title: "Falha no cadastro",
        description: error.message || "Ocorreu um erro ao criar sua conta.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      // Aqui implementaremos a lógica de reset de senha com Supabase
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setActiveTab("login");
    } catch (error: any) {
      toast({
        title: "Falha no envio",
        description: error.message || "Ocorreu um erro ao enviar o e-mail de recuperação.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Lado esquerdo - Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-cross-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cross-blue to-cross-blueDark opacity-90"></div>
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center">
              <img src="/placeholder.svg" alt="CROSS Logo" className="h-10 w-10 mr-2" />
              <h1 className="text-2xl font-heading text-white">CROSS</h1>
            </div>
          </div>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-heading text-white mb-6">Sistema completo para gestão logística</h2>
            <p className="text-white/90 mb-8 text-lg">
              Controle total da sua operação em uma única plataforma. Otimize processos, reduza erros e tome decisões mais inteligentes com base em dados em tempo real.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <BarChart className="text-white h-5 w-5" />
                </div>
                <p className="text-white">Dashboards de performance em tempo real</p>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <Truck className="text-white h-5 w-5" />
                </div>
                <p className="text-white">Gestão integrada de coletas e entregas</p>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-4">
                  <Package className="text-white h-5 w-5" />
                </div>
                <p className="text-white">Controle de armazenagem otimizado</p>
              </div>
            </div>
          </div>
          
          <div className="text-white/80 text-sm">
            &copy; {new Date().getFullYear()} CROSS Sistemas de Logística.
          </div>
        </div>
      </div>
      
      {/* Lado direito - Formulários */}
      <div className="flex items-center justify-center p-6 w-full lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Botão para voltar à landing page */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="text-cross-gray"
            >
              Voltar para a página inicial
            </Button>
          </div>
          
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-heading text-center">Bem-vindo ao CROSS</CardTitle>
              <CardDescription className="text-center">
                {activeTab === 'login' && "Faça login para acessar sua conta"}
                {activeTab === 'register' && "Crie uma nova conta para começar"}
                {activeTab === 'reset' && "Recupere o acesso à sua conta"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Cadastro</TabsTrigger>
                </TabsList>
                
                {/* Tab de Login */}
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="text-right">
                        <Button 
                          type="button" 
                          variant="link" 
                          onClick={() => setActiveTab('reset')}
                          className="p-0 h-auto text-cross-blue"
                        >
                          Esqueceu a senha?
                        </Button>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-cross-blue hover:bg-cross-blueDark"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* Tab de Cadastro */}
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-cross-blue hover:bg-cross-blueDark"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Criando conta..." : "Criar conta"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                {/* Tab de Recuperação de Senha */}
                <TabsContent value="reset">
                  <div className="mb-6 text-center">
                    <div className="inline-block p-3 bg-blue-100 text-cross-blue rounded-full mb-4">
                      <Mail className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Recuperar senha</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Enviaremos um link para redefinir sua senha no e-mail informado
                    </p>
                  </div>
                  
                  <Form {...resetPasswordForm}>
                    <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                      <FormField
                        control={resetPasswordForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-cross-blue hover:bg-cross-blueDark"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="link" 
                        onClick={() => setActiveTab('login')}
                        className="w-full"
                      >
                        Voltar para o login
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <div className="text-center w-full text-sm text-gray-500">
                {activeTab === 'login' ? (
                  <p>
                    Não tem uma conta?{" "}
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab('register')}
                      className="p-0 h-auto text-cross-blue"
                    >
                      Criar conta
                    </Button>
                  </p>
                ) : activeTab === 'register' ? (
                  <p>
                    Já tem uma conta?{" "}
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab('login')}
                      className="p-0 h-auto text-cross-blue"
                    >
                      Fazer login
                    </Button>
                  </p>
                ) : null}
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Ao acessar o sistema, você concorda com nossos{" "}
              <a href="#" className="text-cross-blue hover:underline">Termos de Serviço</a> e{" "}
              <a href="#" className="text-cross-blue hover:underline">Política de Privacidade</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
