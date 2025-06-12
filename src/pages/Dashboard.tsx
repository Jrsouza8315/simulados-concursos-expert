import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { BookOpen, FileText, Trophy } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Olá, {userProfile?.email}</h1>
            <p className="text-muted-foreground">
              Bem-vindo à sua área de estudos
            </p>
          </div>
          <Button onClick={() => navigate("/simulados")}>Fazer Simulado</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Meu Progresso
              </CardTitle>
              <CardDescription>
                Acompanhe seu desempenho nos simulados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">
                    Simulados realizados
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">0%</p>
                  <p className="text-sm text-muted-foreground">
                    Média de acertos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Últimos Simulados
              </CardTitle>
              <CardDescription>Seus simulados mais recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Você ainda não realizou nenhum simulado
                </p>
                <Button
                  variant="link"
                  onClick={() => navigate("/simulados")}
                  className="mt-2"
                >
                  Começar agora
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Material de Estudo
              </CardTitle>
              <CardDescription>
                Apostilas e materiais disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">
                    Apostilas disponíveis
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/apostilas")}
                >
                  Ver Material
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Próximos Concursos</CardTitle>
            <CardDescription>Concursos com inscrições abertas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum concurso disponível no momento
              </p>
              <Button
                variant="link"
                onClick={() => navigate("/concursos")}
                className="mt-2"
              >
                Ver todos os concursos
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
