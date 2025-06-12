import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Users,
  BookOpen,
  BarChart3,
  FileText,
  BookOpenCheck,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../integrations/supabase/client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { AdminDashboardStats } from "../../types/admin";
import { UserManagement } from "./components/UserManagement";
import { QuestionManagement } from "./components/QuestionManagement";
import { ConcursoManagement } from "./components/ConcursoManagement";
import { ApostilaManagement } from "./components/ApostilaManagement";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/badge";

const AdminDashboard = () => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    activeSubscribers: 0,
    totalSimulados: 0,
    totalQuestions: 0,
    totalConcursos: 0,
    totalApostilas: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Verificar se o usuário é admin
    if (userProfile?.email !== "hbrcomercialssa@gmail.com") {
      console.log(
        "Usuário não autorizado tentando acessar o painel admin:",
        userProfile
      );
      navigate("/unauthorized");
      return;
    }

    // Se chegou aqui, é admin, então carrega os dados
    fetchStats();
  }, [userProfile, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Buscar estatísticas de usuários
      const { data: usersData } = await supabase
        .from("user_profiles")
        .select("*");

      // Buscar estatísticas de questões
      const { data: questionsData } = await supabase
        .from("questions")
        .select("*");

      // Buscar estatísticas de concursos
      const { data: concursosData } = await supabase
        .from("concursos")
        .select("*");

      // Buscar estatísticas de apostilas
      const { data: apostilasData } = await supabase
        .from("apostilas")
        .select("*");

      // Buscar atividades recentes
      const { data: recentActivityData } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalUsers: usersData?.length || 0,
        activeSubscribers:
          usersData?.filter((u) => u.subscription_active).length || 0,
        totalSimulados: 0, // Implementar quando houver tabela de simulados
        totalQuestions: questionsData?.length || 0,
        totalConcursos: concursosData?.length || 0,
        totalApostilas: apostilasData?.length || 0,
        recentActivity: recentActivityData || [],
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/acesso");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">
                Painel Administrativo
              </h1>
              <span className="text-sm text-muted-foreground">
                {userProfile?.email}
              </span>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="questoes">Questões</TabsTrigger>
            <TabsTrigger value="concursos">Concursos</TabsTrigger>
            <TabsTrigger value="apostilas">Apostilas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Total de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                      {stats.totalUsers}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stats.activeSubscribers} assinantes ativos
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpenCheck className="h-5 w-5" />
                    Questões e Simulados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                      {stats.totalQuestions}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stats.totalSimulados} simulados criados
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Materiais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                      {stats.totalConcursos}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stats.totalApostilas} apostilas disponíveis
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{activity.action}</Badge>
                        <span>{activity.details}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios">
            <UserManagement />
          </TabsContent>

          <TabsContent value="questoes">
            <QuestionManagement />
          </TabsContent>

          <TabsContent value="concursos">
            <ConcursoManagement />
          </TabsContent>

          <TabsContent value="apostilas">
            <ApostilaManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
