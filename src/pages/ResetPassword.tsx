import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";
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
import { supabase } from "../integrations/supabase/client";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const [linkExpired, setLinkExpired] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password requirements state
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Check password requirements
  const checkPasswordRequirements = (pass: string) => {
    setRequirements({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    });
  };

  useEffect(() => {
    checkPasswordRequirements(password);
  }, [password]);

  useEffect(() => {
    const checkRecoveryToken = async () => {
      try {
        // Verificar se há erro na URL
        const hash = window.location.hash;

        // Se não houver hash ou se for apenas #/reset-password, redirecionar
        if (!hash || hash === "#/reset-password") {
          navigate("/esqueceu-senha");
          return;
        }

        const params = new URLSearchParams(hash.replace("#", ""));

        // Se não houver parâmetros na URL, redirecionar
        if (params.toString() === "/reset-password") {
          navigate("/esqueceu-senha");
          return;
        }

        const error = params.get("error");
        const errorDescription = params.get("error_description");

        if (error) {
          if (
            error === "access_denied" &&
            params.get("error_code") === "otp_expired"
          ) {
            setLinkExpired(true);
            throw new Error(
              "O link de recuperação expirou. Por favor, solicite um novo link."
            );
          }
          throw new Error(errorDescription || "Link de recuperação inválido");
        }

        // Se não há erro, tenta obter o token de acesso
        const accessToken = params.get("access_token");
        if (!accessToken) {
          navigate("/esqueceu-senha");
          return;
        }

        // Set the access token in Supabase
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: "",
        });

        if (sessionError || !session) {
          throw new Error("Sessão inválida ou expirada");
        }

        setInitializing(false);
      } catch (error: any) {
        console.error("Erro na verificação:", error);
        toast({
          title: "Erro",
          description: error.message || "Link de recuperação inválido.",
          variant: "destructive",
        });
        setInitializing(false);
        setLinkExpired(true);
      }
    };

    checkRecoveryToken();
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all requirements
    const allRequirementsMet = Object.values(requirements).every(
      (requirement) => requirement
    );

    if (!allRequirementsMet) {
      setError("Por favor, atenda a todos os requisitos de senha");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso!",
      });

      // Redirecionar para a página de login após 2 segundos
      setTimeout(() => {
        navigate("/acesso");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      setError(error.message);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar a senha.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (linkExpired) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle className="text-center">Link Expirado</CardTitle>
            <CardDescription className="text-center">
              O link de recuperação de senha expirou ou é inválido.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Por favor, solicite um novo link de recuperação de senha.
            </p>
            <Link to="/esqueceu-senha">
              <Button className="w-full">Solicitar Novo Link</Button>
            </Link>
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
    );
  }

  if (initializing) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p>Verificando link de recuperação...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-500" />
      )}
      <span className={met ? "text-green-700" : "text-red-700"}>{text}</span>
    </div>
  );

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Redefinir Senha</CardTitle>
          <CardDescription>
            Crie uma nova senha segura para sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                required
                disabled={loading}
              />
              <div className="mt-2 space-y-2">
                <RequirementItem
                  met={requirements.length}
                  text="Mínimo de 8 caracteres"
                />
                <RequirementItem
                  met={requirements.uppercase}
                  text="Pelo menos uma letra maiúscula"
                />
                <RequirementItem
                  met={requirements.lowercase}
                  text="Pelo menos uma letra minúscula"
                />
                <RequirementItem
                  met={requirements.number}
                  text="Pelo menos um número"
                />
                <RequirementItem
                  met={requirements.special}
                  text="Pelo menos um caractere especial"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !Object.values(requirements).every((r) => r)}
            >
              {loading ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
