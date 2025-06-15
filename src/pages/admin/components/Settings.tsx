import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AdminProfile {
  id: string;
  email: string;
  role: string;
  subscription_active: boolean | null;
}

export default function Settings() {
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("role", "admin");

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching admin profiles:", error);
      toast.error("Erro ao carregar perfis de admin");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Perfis de Administrador</h2>
      {profiles.map((profile) => (
        <div key={profile.id} className="flex items-center space-x-4">
          <span className="w-1/3">{profile.email}</span>
          <span className="w-1/3">{profile.role}</span>
          <span className="w-1/3">
            {profile.subscription_active ? "Ativo" : "Inativo"}
          </span>
        </div>
      ))}
    </div>
  );
}
