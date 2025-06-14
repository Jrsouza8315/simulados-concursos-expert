import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

const EsqueceuSenha: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // URL fixa do GitHub Pages
      const redirectUrl =
        "https://jrsouza8315.github.io/simulados-concursos-expert/#/reset-password";

      console.log("URL de redirecionamento:", redirectUrl);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error("Erro detalhado:", {
          message: error.message,
          status: error?.status,
          details: error,
        });
        throw error;
      }

      console.log("Resposta do Supabase:", {
        success: !!data,
        data: data,
      });

      toast.success(
        "Email enviado! Verifique sua caixa de entrada para redefinir sua senha. O link expira em 24 horas."
      );

      // Redirecionar para a página de login após 3 segundos
      setTimeout(() => {
        navigate("/acesso");
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao resetar senha:", error);

      // Melhorar a mensagem de erro para o usuário
      let errorMessage = "Não foi possível enviar o email de recuperação.";
      if (error.message?.includes("rate limit")) {
        errorMessage =
          "Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente.";
      } else if (error.message?.includes("not found")) {
        errorMessage =
          "Email não encontrado. Verifique se digitou corretamente.";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Recuperar Senha</CardTitle>
              <CardDescription>
                Digite seu email para receber as instruções de recuperação de
                senha. O link enviado será válido por 2 horas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-background"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar instruções"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link
                to="/acesso"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Voltar para o login
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EsqueceuSenha;
