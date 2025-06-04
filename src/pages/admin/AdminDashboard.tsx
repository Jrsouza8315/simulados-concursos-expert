import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart3, Settings, Plus } from "lucide-react";
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

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalSimulados: 0,
    totalQuestions: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

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
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: usersData } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setStats({
        totalUsers: usersData?.length || 0,
        activeSubscribers:
          usersData?.filter((u) => u.subscription_active).length || 0,
        totalSimulados: 15, // Mock data
        totalQuestions: 1250, // Mock data
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (!error) {
        fetchUsers();
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
    <div className="min-h-screen bg-branco-cinza">
      <Header />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-azul-escuro">
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {userProfile?.email}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="questoes">Cadastro de Questões</TabsTrigger>
              <TabsTrigger value="usuarios">Gestão de Usuários</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total de Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assinantes Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.activeSubscribers}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Simulados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-laranja-avermelhado">
                      {stats.totalSimulados}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Questões</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-azul-claro-metalico">
                      {stats.totalQuestions}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="questoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cadastrar Nova Questão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label>Enunciado</label>
                    <Textarea
                      value={questao.enunciado}
                      onChange={(e) =>
                        setQuestao({ ...questao, enunciado: e.target.value })
                      }
                      placeholder="Digite o enunciado da questão"
                    />
                  </div>

                  <div className="space-y-4">
                    <label>Alternativas</label>
                    {questao.alternativas.map((alt, index) => (
                      <Input
                        key={index}
                        value={alt}
                        onChange={(e) => {
                          const novasAlternativas = [...questao.alternativas];
                          novasAlternativas[index] = e.target.value;
                          setQuestao({
                            ...questao,
                            alternativas: novasAlternativas,
                          });
                        }}
                        placeholder={`Alternativa ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label>Resposta Correta</label>
                      <Select
                        value={questao.resposta_correta.toString()}
                        onValueChange={(value) =>
                          setQuestao({
                            ...questao,
                            resposta_correta: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a resposta correta" />
                        </SelectTrigger>
                        <SelectContent>
                          {questao.alternativas.map((_, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              Alternativa {index + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label>Nível</label>
                      <Select
                        value={questao.nivel}
                        onValueChange={(value) =>
                          setQuestao({ ...questao, nivel: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facil">Fácil</SelectItem>
                          <SelectItem value="medio">Médio</SelectItem>
                          <SelectItem value="dificil">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleSalvarQuestao} className="w-full">
                    Salvar Questão
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usuarios" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Permissão</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Pagamento</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>
                            <Select
                              value={usuario.role}
                              onValueChange={(value) =>
                                handleAlterarPermissao(usuario.id, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="visitante">
                                  Visitante
                                </SelectItem>
                                <SelectItem value="assinante">
                                  Assinante
                                </SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                usuario.subscription_active
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {usuario.subscription_active
                                ? "Ativo"
                                : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {usuario.created_at.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos Pendentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Adicione dados de pagamentos pendentes aqui */}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Últimas Transações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Adicione dados de transações aqui */}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
