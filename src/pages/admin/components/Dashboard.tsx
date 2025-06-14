import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { FileText, BookOpen, Users, ClipboardList } from "lucide-react";

interface DashboardStats {
  totalQuestions: number;
  totalApostilas: number;
  totalSimulados: number;
  activeUsers: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuestions: 0,
    totalApostilas: 0,
    totalSimulados: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Buscar total de questões
      const { count: questionsCount } = await supabase
        .from("questoes")
        .select("*", { count: "exact", head: true });

      // Buscar total de apostilas
      const { count: apostilasCount } = await supabase
        .from("apostilas")
        .select("*", { count: "exact", head: true });

      // Buscar total de simulados
      const { count: simuladosCount } = await supabase
        .from("simulados")
        .select("*", { count: "exact", head: true });

      // Buscar usuários ativos (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_login", thirtyDaysAgo.toISOString());

      setStats({
        totalQuestions: questionsCount || 0,
        totalApostilas: apostilasCount || 0,
        totalSimulados: simuladosCount || 0,
        activeUsers: usersCount || 0,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
  }: {
    title: string;
    value: number;
    icon: any;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Questões"
          value={stats.totalQuestions}
          icon={FileText}
        />
        <StatCard
          title="Apostilas Disponíveis"
          value={stats.totalApostilas}
          icon={BookOpen}
        />
        <StatCard
          title="Simulados Gerados"
          value={stats.totalSimulados}
          icon={ClipboardList}
        />
        <StatCard
          title="Usuários Ativos"
          value={stats.activeUsers}
          icon={Users}
        />
      </div>
    </div>
  );
}
