import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseExample() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*");

        if (error) throw error;
        setData(data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Erro ao carregar dados");
      }
    };

    fetchData();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dados do Supabase</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
