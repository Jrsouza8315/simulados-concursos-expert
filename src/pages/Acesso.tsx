
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Facebook, UserCheck, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Esquema de validação para o login
const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  senha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

// Esquema de validação para o cadastro
const cadastroSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  senha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  confirmarSenha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

const Acesso = () => {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaCadastro, setMostrarSenhaCadastro] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [tabAtiva, setTabAtiva] = useState("login");

  // Form de login
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  // Form de cadastro
  const cadastroForm = useForm({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      // TODO: Integrar com backend de autenticação
      console.log("Login:", values);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const onCadastroSubmit = async (values: z.infer<typeof cadastroSchema>) => {
    try {
      // TODO: Integrar com backend de cadastro
      console.log("Cadastro:", values);
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      setTabAtiva("login");
    } catch (error) {
      toast.error('Erro ao realizar cadastro. Tente novamente.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        <div className="max-w-md mx-auto mt-16 mb-12 p-6 bg-white rounded-xl shadow-lg">
          <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                  <p className="text-gray-500">Acesse sua conta para continuar</p>
                </div>

                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="seu@email.com" 
                              type="email" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="••••••••" 
                                type={mostrarSenha ? "text" : "password"} 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-0 top-0 h-full px-3"
                              >
                                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <div className="flex justify-end">
                            <a 
                              href="#" 
                              className="text-sm text-primary hover:underline"
                            >
                              Esqueceu a senha?
                            </a>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                    >
                      Entrar
                    </Button>
                  </form>
                </Form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou continue com</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <Facebook size={20} />
                    Facebook
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <Mail size={20} />
                    Google
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cadastro">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">Crie sua conta</h1>
                  <p className="text-gray-500">Comece sua jornada de estudos hoje</p>
                </div>

                <Form {...cadastroForm}>
                  <form onSubmit={cadastroForm.handleSubmit(onCadastroSubmit)} className="space-y-4">
                    <FormField
                      control={cadastroForm.control}
                      name="nome"
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
                      control={cadastroForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={cadastroForm.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="••••••••" 
                                type={mostrarSenhaCadastro ? "text" : "password"} 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setMostrarSenhaCadastro(!mostrarSenhaCadastro)}
                                className="absolute right-0 top-0 h-full px-3"
                              >
                                {mostrarSenhaCadastro ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={cadastroForm.control}
                      name="confirmarSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="••••••••" 
                                type={mostrarConfirmarSenha ? "text" : "password"} 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                className="absolute right-0 top-0 h-full px-3"
                              >
                                {mostrarConfirmarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                    >
                      Cadastrar
                    </Button>
                  </form>
                </Form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou cadastre-se com</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <Facebook size={20} />
                    Facebook
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <Mail size={20} />
                    Google
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Acesso;
