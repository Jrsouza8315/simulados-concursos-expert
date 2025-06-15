import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <FileQuestion className="h-24 w-24 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">Página Não Encontrada</h1>
        <p className="text-lg text-muted-foreground">
          A página que você está procurando não existe.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate("/")}>Voltar para o Início</Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
