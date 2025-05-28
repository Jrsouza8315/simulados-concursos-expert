
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, BarChart3, Settings, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { mockSupabase } from '@/lib/mockSupabase';

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalSimulados: 0,
    totalQuestions: 0
  });
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: usersData } = await mockSupabase
        .from('user_profiles')
        .select('*');

      setStats({
        totalUsers: usersData?.length || 0,
        activeSubscribers: usersData?.filter(u => u.subscription_active).length || 0,
        totalSimulados: 15, // Mock data
        totalQuestions: 1250 // Mock data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await mockSupabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await mockSupabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (!error) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-azul-escuro">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-azul-medio">{stats.activeSubscribers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Simulados</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-laranja-avermelhado">{stats.totalSimulados}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questões</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-azul-claro-metalico">{stats.totalQuestions}</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button className="bg-azul-escuro hover:bg-azul-medio h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Novo Simulado
            </Button>
            <Button variant="outline" className="h-20 flex-col border-azul-medio text-azul-medio hover:bg-azul-claro-metalico hover:bg-opacity-10">
              <BookOpen className="h-6 w-6 mb-2" />
              Gerenciar Questões
            </Button>
            <Button variant="outline" className="h-20 flex-col border-laranja-avermelhado text-laranja-avermelhado hover:bg-laranja-avermelhado hover:bg-opacity-10">
              <BarChart3 className="h-6 w-6 mb-2" />
              Relatórios
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              Configurações
            </Button>
          </div>

          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Função: <span className="capitalize">{user.role}</span>
                        {user.subscription_active && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Assinante Ativo
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="border rounded px-3 py-1 text-sm"
                      >
                        <option value="visitante">Visitante</option>
                        <option value="assinante">Assinante</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
