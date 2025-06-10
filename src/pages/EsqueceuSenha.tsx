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
import { supabase } from "../integrations/supabase/client";

const EsqueceuSenha: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Construir a URL de redirecionamento usando hash routing
      const redirectUrl = new URL(window.location.origin);
      redirectUrl.pathname = "/simulados-concursos-expert/";
      redirectUrl.hash = "#/reset-password";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl.toString(),
      });

      if (error) throw error;

      toast.success(
        "Email enviado! Verifique sua caixa de entrada para redefinir sua senha. O link expira em 2 horas."
      );

      // Redirecionar para a página de login após 3 segundos
      setTimeout(() => {
        navigate("/acesso");
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao resetar senha:", error);
      toast.error(
        error.message || "Não foi possível enviar o email de recuperação."
      );
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
