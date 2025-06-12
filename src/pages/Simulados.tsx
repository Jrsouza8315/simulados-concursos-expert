import React, { useState, useEffect } from "react";
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
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "../types/admin";
import { Badge } from "../components/ui/badge";

const Simulados = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Erro ao carregar questões");
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulado = () => {
    if (!userProfile) {
      toast.error("Faça login para acessar os simulados");
      navigate("/acesso");
      return;
    }

    if (userProfile.role === "visitante") {
      toast.error("Assine para acessar os simulados");
      navigate("/planos");
      return;
    }

    // TODO: Implementar lógica de simulado
    toast.info("Em desenvolvimento");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Simulados</h1>
            <p className="text-muted-foreground">
              Pratique com questões de concursos anteriores
            </p>
          </div>
          <Button onClick={handleStartSimulado}>Iniciar Simulado</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulado Personalizado</CardTitle>
              <CardDescription>
                Crie um simulado com questões específicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Selecione as matérias e o nível de dificuldade
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleStartSimulado}
                >
                  Criar Simulado
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simulado Rápido</CardTitle>
              <CardDescription>
                Simulado com 10 questões aleatórias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ideal para uma prática rápida
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleStartSimulado}
                >
                  Iniciar Rápido
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simulado Completo</CardTitle>
              <CardDescription>
                Simulado com 60 questões variadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Simule uma prova completa
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleStartSimulado}
                >
                  Iniciar Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Banco de Questões</CardTitle>
            <CardDescription>
              {questions.length} questões disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground">
                  Carregando questões...
                </p>
              ) : questions.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Nenhuma questão disponível
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from(new Set(questions.map((q) => q.category))).map(
                    (category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <span>{category}</span>
                        <Badge variant="secondary">
                          {
                            questions.filter((q) => q.category === category)
                              .length
                          }
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Simulados;
