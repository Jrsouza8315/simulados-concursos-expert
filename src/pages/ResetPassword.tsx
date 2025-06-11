import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        // Log da URL completa para debug
        console.log("URL completa:", window.location.href);

        // Obter o hash e remover o prefixo da rota
        const hash = window.location.hash;
        console.log("Hash original:", hash);

        // Extrair o token usando regex para maior precisão
        const tokenMatch = hash.match(/[#&?]access_token=([^&]+)/);
        const accessToken = tokenMatch ? tokenMatch[1] : null;

        console.log(
          "Token encontrado:",
          accessToken
            ? "Sim (primeiros 10 caracteres: " +
                accessToken.substring(0, 10) +
                "...)"
            : "Não"
        );

        // Se não houver token, verificar erros
        if (!accessToken) {
          // Extrair informações de erro
          const errorMatch = hash.match(/error=([^&]+)/);
          const errorCodeMatch = hash.match(/error_code=([^&]+)/);
          const errorDescriptionMatch = hash.match(/error_description=([^&]+)/);

          const error = errorMatch ? decodeURIComponent(errorMatch[1]) : null;
          const errorCode = errorCodeMatch
            ? decodeURIComponent(errorCodeMatch[1])
            : null;
          const errorDescription = errorDescriptionMatch
            ? decodeURIComponent(errorDescriptionMatch[1])
            : null;

          console.log("Informações de erro:", {
            error,
            errorCode,
            errorDescription,
            hasErrorInURL: hash.includes("error"),
          });

          if (error || errorCode || errorDescription) {
            setLinkExpired(true);
            throw new Error(
              errorDescription || "O link de recuperação é inválido ou expirou."
            );
          }

          console.log("Redirecionando - token não encontrado");
          navigate("/esqueceu-senha");
          return;
        }

        // Extrair outros parâmetros importantes
        const refreshMatch = hash.match(/refresh_token=([^&]+)/);
        const refreshToken = refreshMatch ? refreshMatch[1] : "";

        // Tentar configurar a sessão com o token
        console.log("Configurando sessão com o token...");

        // Primeiro, verificar se o token é válido
        const {
          data: { user },
          error: verifyError,
        } = await supabase.auth.getUser(accessToken);

        if (verifyError || !user) {
          console.error("Erro ao verificar token:", verifyError);
          setLinkExpired(true);
          throw new Error(
            "O link de recuperação expirou. Por favor, solicite um novo link."
          );
        }

        // Se o token é válido, configurar a sessão
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error("Erro ao configurar sessão:", {
            message: sessionError.message,
            status: sessionError?.status,
            details: sessionError,
          });
          throw sessionError;
        }

        if (!data.session) {
          console.error("Sessão não criada após setSession");
          throw new Error("Não foi possível iniciar a sessão de recuperação");
        }

        console.log("Sessão configurada com sucesso:", {
          user: data.session?.user?.email,
          expiresAt: data.session?.expires_at,
        });

        // Verificar se o perfil do usuário existe
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        // Se não existir perfil, criar um novo
        if (!profile && !profileError) {
          const { error: createProfileError } = await supabase
            .from("user_profiles")
            .insert([
              {
                id: data.session.user.id,
                email: data.session.user.email,
                role: "visitante",
                subscription_active: false,
                created_at: new Date().toISOString(),
              },
            ]);

          if (createProfileError) {
            console.error("Erro ao criar perfil:", createProfileError);
          }
        }

        setInitializing(false);
      } catch (error: any) {
        console.error("Erro na verificação do token:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });

        toast.error(error.message || "Link de recuperação inválido.");
        setInitializing(false);
        setLinkExpired(true);
      }
    };

    checkRecoveryToken();
  }, [navigate]);

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

      // Primeiro verificar se ainda temos uma sessão válida
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "Sessão expirada. Por favor, solicite um novo link de recuperação."
        );
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      // Após atualizar a senha, fazer logout para forçar um novo login
      await supabase.auth.signOut();

      toast.success(
        "Senha atualizada com sucesso! Por favor, faça login com sua nova senha."
      );

      // Redirecionar para a página de login após 2 segundos
      setTimeout(() => {
        navigate("/acesso");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      setError(error.message);
      toast.error(error.message || "Erro ao atualizar a senha.");

      if (error.message.includes("expired")) {
        setLinkExpired(true);
      }
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
