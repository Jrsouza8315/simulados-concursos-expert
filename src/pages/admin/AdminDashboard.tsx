import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  FileText,
  BookOpenCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AdminDashboardStats } from "@/types/admin";
import { UserManagement } from "./components/UserManagement";
import { QuestionManagement } from "./components/QuestionManagement";
import { ConcursoManagement } from "./components/ConcursoManagement";
import { ApostilaManagement } from "./components/ApostilaManagement";

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    activeSubscribers: 0,
    totalSimulados: 0,
    totalQuestions: 0,
    totalConcursos: 0,
    totalApostilas: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  // Estados para o formulário de questões
  const [questao, setQuestao] = useState({
    enunciado: "",
    alternativas: ["", "", "", "", ""],
    resposta_correta: 0,
    materia: "",
    nivel: "facil",
  });

  useEffect(() => {
    fetchStats();
  }, []);

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

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (!error) {
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleSalvarQuestao = () => {
    // Implementar lógica de salvamento
    toast({
      title: "Questão salva com sucesso!",
      description: "A questão foi adicionada ao banco de dados.",
    });
  };

  const handleAlterarPermissao = (userId: number, novaRole: string) => {
    // Implementar lógica de alteração de permissão
    toast({
      title: "Permissão alterada",
      description: `Permissão do usuário alterada para ${novaRole}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-20 px-4 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground mt-2">
            Bem-vindo, {userProfile?.email}
          </p>
        </div>

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
                  {stats.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
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
