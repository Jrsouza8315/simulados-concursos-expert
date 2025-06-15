import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface StatisticsData {
  questoesPorAssunto: { assunto: string; total: number }[];
  questoesPorNivel: { nivel: string; total: number }[];
  concursosPorMes: { mes: string; total: number }[];
  usuariosAtivos: number;
  totalQuestoes: number;
  totalConcursos: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function Statistics() {
  const [stats, setStats] = useState<StatisticsData>({
    questoesPorAssunto: [],
    questoesPorNivel: [],
    concursosPorMes: [],
    usuariosAtivos: 0,
    totalQuestoes: 0,
    totalConcursos: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // Buscar questões por assunto
      const questoesPorAssunto = await supabase
        .from("questions")
        .select("assunto, count(*) as total")
        .order("total", { ascending: false });

      // Buscar questões por nível
      const questoesPorNivel = await supabase
        .from("questions")
        .select("nivel, count(*) as total")
        .order("total", { ascending: false });

      // Buscar concursos por mês
      const concursosPorMes = await supabase
        .from("concursos")
        .select("created_at, count(*) as total")
        .order("created_at", { ascending: false });

      // Buscar usuários ativos (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: usuariosAtivos } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_login", thirtyDaysAgo.toISOString());

      // Buscar totais
      const { count: totalQuestoes } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true });

      const { count: totalConcursos } = await supabase
        .from("concursos")
        .select("*", { count: "exact", head: true });

      setStats({
        questoesPorAssunto:
          (questoesPorAssunto?.data as unknown as {
            assunto: string;
            total: number;
          }[]) || [],
        questoesPorNivel:
          (questoesPorNivel?.data as unknown as {
            nivel: string;
            total: number;
          }[]) || [],
        concursosPorMes:
          (concursosPorMes?.data as unknown as {
            mes: string;
            total: number;
          }[]) || [],
        usuariosAtivos: usuariosAtivos || 0,
        totalQuestoes: totalQuestoes || 0,
        totalConcursos: totalConcursos || 0,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Estatísticas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Total de Questões
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalQuestoes}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Total de Concursos
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalConcursos}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Usuários Ativos
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.usuariosAtivos}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Questões por Assunto
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.questoesPorAssunto}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assunto" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Questões por Nível
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.questoesPorNivel}
                  dataKey="total"
                  nameKey="nivel"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.questoesPorNivel.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Concursos por Mês
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.concursosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
