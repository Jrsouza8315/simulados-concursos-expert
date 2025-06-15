import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <ShieldAlert className="h-24 w-24 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold">Acesso Não Autorizado</h1>
        <p className="text-lg text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate("/")}>Voltar para o Início</Button>
          <Button variant="outline" onClick={() => navigate("/acesso")}>
            Fazer Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
