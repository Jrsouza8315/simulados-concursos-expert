import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, BookOpen, Users, Clipboard } from "lucide-react";

interface DashboardStats {
  totalQuestions: number;
  totalSimulados: number;
  totalUsers: number;
  totalApostilas: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuestions: 0,
    totalSimulados: 0,
    totalUsers: 0,
    totalApostilas: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: questions } = await supabase
          .from("questions")
          .select("*");

        const { data: simulados } = await supabase
          .from("concursos")
          .select("*");

        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("*");

        const { data: apostilas } = await supabase
          .from("apostilas")
          .select("*");

        setStats({
          totalQuestions: questions?.length || 0,
          totalSimulados: simulados?.length || 0,
          totalUsers: profiles?.length || 0,
          totalApostilas: apostilas?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total de Questões</p>
            <p className="text-2xl font-bold">{stats.totalQuestions}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total de Simulados</p>
            <p className="text-2xl font-bold">{stats.totalSimulados}</p>
          </div>
          <Clipboard className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total de Usuários</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <Users className="h-8 w-8 text-purple-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total de Apostilas</p>
            <p className="text-2xl font-bold">{stats.totalApostilas}</p>
          </div>
          <BookOpen className="h-8 w-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
}
