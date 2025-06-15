import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { supabase } from "../../../integrations/supabase/client";
import { UserRole } from "../../../contexts/AuthContext";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  subscription_active: boolean;
  created_at: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Garantir que os dados correspondem ao tipo UserProfile
      const typedData = data?.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        subscription_active: user.subscription_active || false,
        created_at: user.created_at || new Date().toISOString(),
      }));

      setUsers(typedData || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Papel do usuário atualizado com sucesso");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Erro ao atualizar papel do usuário");
    }
  };

  const toggleSubscription = async (userId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ subscription_active: active })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Status da assinatura atualizado com sucesso");
      fetchUsers();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Erro ao atualizar status da assinatura");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        <Button onClick={fetchUsers} disabled={loading}>
          Atualizar Lista
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status da Assinatura</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "admin"
                        ? "default"
                        : user.role === "assinante"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.subscription_active ? "default" : "destructive"
                    }
                  >
                    {user.subscription_active ? "Ativa" : "Inativa"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded px-2 py-1"
                      value={user.role}
                      onChange={(e) =>
                        updateUserRole(user.id, e.target.value as UserRole)
                      }
                    >
                      <option value="visitante">Visitante</option>
                      <option value="assinante">Assinante</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      variant={
                        user.subscription_active ? "destructive" : "default"
                      }
                      size="sm"
                      onClick={() =>
                        toggleSubscription(user.id, !user.subscription_active)
                      }
                    >
                      {user.subscription_active
                        ? "Desativar Assinatura"
                        : "Ativar Assinatura"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
