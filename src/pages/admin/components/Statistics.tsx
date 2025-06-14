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
  simuladosPorMes: { mes: string; total: number }[];
  usuariosAtivos: number;
  totalQuestoes: number;
  totalSimulados: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function Statistics() {
  const [stats, setStats] = useState<StatisticsData>({
    questoesPorAssunto: [],
    questoesPorNivel: [],
    simuladosPorMes: [],
    usuariosAtivos: 0,
    totalQuestoes: 0,
    totalSimulados: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      // Buscar questões por assunto
      const { data: questoesPorAssunto } = await supabase
        .from("questoes")
        .select("assunto")
        .then(({ data }) => {
          const counts = data?.reduce(
            (acc: { [key: string]: number }, curr) => {
              acc[curr.assunto] = (acc[curr.assunto] || 0) + 1;
              return acc;
            },
            {}
          );
          return Object.entries(counts || {}).map(([assunto, total]) => ({
            assunto,
            total,
          }));
        });

      // Buscar questões por nível
      const { data: questoesPorNivel } = await supabase
        .from("questoes")
        .select("nivel")
        .then(({ data }) => {
          const counts = data?.reduce(
            (acc: { [key: string]: number }, curr) => {
              acc[curr.nivel] = (acc[curr.nivel] || 0) + 1;
              return acc;
            },
            {}
          );
          return Object.entries(counts || {}).map(([nivel, total]) => ({
            nivel,
            total,
          }));
        });

      // Buscar simulados por mês
      const { data: simuladosPorMes } = await supabase
        .from("simulados")
        .select("created_at")
        .then(({ data }) => {
          const counts = data?.reduce(
            (acc: { [key: string]: number }, curr) => {
              const mes = new Date(curr.created_at).toLocaleString("pt-BR", {
                month: "long",
              });
              acc[mes] = (acc[mes] || 0) + 1;
              return acc;
            },
            {}
          );
          return Object.entries(counts || {}).map(([mes, total]) => ({
            mes,
            total,
          }));
        });

      // Buscar usuários ativos (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: usuariosAtivos } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("last_login", thirtyDaysAgo.toISOString());

      // Buscar totais
      const { count: totalQuestoes } = await supabase
        .from("questoes")
        .select("*", { count: "exact", head: true });

      const { count: totalSimulados } = await supabase
        .from("simulados")
        .select("*", { count: "exact", head: true });

      setStats({
        questoesPorAssunto: questoesPorAssunto || [],
        questoesPorNivel: questoesPorNivel || [],
        simuladosPorMes: simuladosPorMes || [],
        usuariosAtivos: usuariosAtivos || 0,
        totalQuestoes: totalQuestoes || 0,
        totalSimulados: totalSimulados || 0,
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
            Total de Simulados
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalSimulados}
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
                  {stats.questoesPorNivel.map((entry, index) => (
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
            Simulados por Mês
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.simuladosPorMes}>
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
