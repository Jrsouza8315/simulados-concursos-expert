import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">
            Bem-vindo ao Simulados Concursos Expert
          </h1>
          <p className="text-lg text-muted-foreground">
            A melhor plataforma para sua preparação em concursos públicos.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/acesso")}>Começar Agora</Button>
            <Button variant="outline" onClick={() => navigate("/simulados")}>
              Ver Simulados
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Simulados Personalizados</h2>
            <p className="text-muted-foreground">
              Crie simulados adaptados ao seu nível e área de interesse.
            </p>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Material Atualizado</h2>
            <p className="text-muted-foreground">
              Conteúdo sempre atualizado com as últimas tendências dos
              concursos.
            </p>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Suporte Especializado</h2>
            <p className="text-muted-foreground">
              Equipe de professores prontos para ajudar em suas dúvidas.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
