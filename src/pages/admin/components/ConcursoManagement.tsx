import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Concurso } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const ConcursoManagement = () => {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConcursos, setFilteredConcursos] = useState<Concurso[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingConcurso, setEditingConcurso] = useState<Concurso | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newConcurso, setNewConcurso] = useState<Partial<Concurso>>({
    title: "",
    description: "",
    organization: "",
    status: "open",
    start_date: "",
    end_date: "",
  });

  const [formData, setFormData] = useState({
    titulo: "",
    organizadora: "",
    status: "aberto" as "aberto" | "em_andamento" | "encerrado",
    data_inicio: "",
    data_fim: "",
    descricao: "",
    link_edital: "",
  });

  const fetchConcursos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("concursos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConcursos(data || []);
      setFilteredConcursos(data || []);
    } catch (error) {
      console.error("Error fetching concursos:", error);
      toast.error("Erro ao carregar concursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcursos();
  }, []);

  useEffect(() => {
    const filtered = concursos.filter(
      (concurso) =>
        concurso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concurso.organizadora.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConcursos(filtered);
  }, [searchTerm, concursos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const concursoData = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingConcurso) {
        const { error } = await supabase
          .from("concursos")
          .update({
            ...concursoData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingConcurso.id);

        if (error) throw error;
        toast.success("Concurso atualizado com sucesso");
      } else {
        const { error } = await supabase
          .from("concursos")
          .insert([concursoData]);
        if (error) throw error;
        toast.success("Concurso cadastrado com sucesso");
      }

      setFormData({
        titulo: "",
        organizadora: "",
        status: "aberto",
        data_inicio: "",
        data_fim: "",
        descricao: "",
        link_edital: "",
      });
      setShowForm(false);
      setEditingConcurso(null);
      fetchConcursos();
    } catch (error) {
      console.error("Error saving concurso:", error);
      toast.error("Erro ao salvar concurso");
    }
  };

  const handleEdit = (concurso: Concurso) => {
    setEditingConcurso(concurso);
    setFormData({
      titulo: concurso.titulo,
      organizadora: concurso.organizadora,
      status: concurso.status,
      data_inicio: concurso.data_inicio,
      data_fim: concurso.data_fim,
      descricao: concurso.descricao,
      link_edital: concurso.link_edital,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este concurso?")) return;

    try {
      const { error } = await supabase.from("concursos").delete().eq("id", id);

      if (error) throw error;
      toast.success("Concurso excluído com sucesso");
      fetchConcursos();
    } catch (error) {
      console.error("Error deleting concurso:", error);
      toast.error("Erro ao excluir concurso");
    }
  };

  const handleCreateConcurso = async () => {
    try {
      const { error } = await supabase.from("concursos").insert([
        {
          ...newConcurso,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success("Concurso criado com sucesso");
      setIsDialogOpen(false);
      setNewConcurso({
        title: "",
        description: "",
        organization: "",
        status: "open",
        start_date: "",
        end_date: "",
      });
      fetchConcursos();
    } catch (error) {
      console.error("Error creating concurso:", error);
      toast.error("Erro ao criar concurso");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aberto":
        return <Badge variant="default">Aberto</Badge>;
      case "em_andamento":
        return <Badge variant="secondary">Em Andamento</Badge>;
      case "encerrado":
        return <Badge variant="destructive">Encerrado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestão de Concursos</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchConcursos}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Concurso
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Concurso</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newConcurso.title}
                        onChange={(e) =>
                          setNewConcurso({
                            ...newConcurso,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newConcurso.description}
                        onChange={(e) =>
                          setNewConcurso({
                            ...newConcurso,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="organization">Organizadora</Label>
                      <Input
                        id="organization"
                        value={newConcurso.organization}
                        onChange={(e) =>
                          setNewConcurso({
                            ...newConcurso,
                            organization: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        className="border rounded px-2 py-1"
                        value={newConcurso.status}
                        onChange={(e) =>
                          setNewConcurso({
                            ...newConcurso,
                            status: e.target.value as Concurso["status"],
                          })
                        }
                      >
                        <option value="open">Aberto</option>
                        <option value="closed">Encerrado</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="start_date">Data de Início</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={newConcurso.start_date}
                        onChange={(e) =>
                          setNewConcurso({
                            ...newConcurso,
                            start_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end_date">Data de Término</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={newConcurso.end_date}
                        onChange={(e) =>
                          setNewConcurso({
                            ...newConcurso,
                            end_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateConcurso}>Criar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título ou organizadora..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Organizadora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredConcursos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhum concurso encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredConcursos.map((concurso) => (
                    <TableRow key={concurso.id}>
                      <TableCell>{concurso.titulo}</TableCell>
                      <TableCell>{concurso.organizadora}</TableCell>
                      <TableCell>{getStatusBadge(concurso.status)}</TableCell>
                      <TableCell>
                        {new Date(concurso.data_inicio).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(concurso.data_fim).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(concurso)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(concurso.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {concurso.link_edital && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(concurso.link_edital, "_blank")
                              }
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingConcurso ? "Editar Concurso" : "Novo Concurso"}
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para{" "}
              {editingConcurso ? "editar" : "cadastrar"} um concurso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Título</label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    placeholder="Digite o título do concurso"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label>Organizadora</label>
                  <Input
                    value={formData.organizadora}
                    onChange={(e) =>
                      setFormData({ ...formData, organizadora: e.target.value })
                    }
                    placeholder="Digite a organizadora"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label>Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(
                      value: "aberto" | "em_andamento" | "encerrado"
                    ) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="encerrado">Encerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label>Data de Início</label>
                  <Input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) =>
                      setFormData({ ...formData, data_inicio: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label>Data de Fim</label>
                  <Input
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) =>
                      setFormData({ ...formData, data_fim: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label>Descrição</label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Digite a descrição do concurso"
                  required
                />
              </div>

              <div className="space-y-2">
                <label>Link do Edital</label>
                <Input
                  value={formData.link_edital}
                  onChange={(e) =>
                    setFormData({ ...formData, link_edital: e.target.value })
                  }
                  placeholder="Cole o link do edital"
                  type="url"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingConcurso(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingConcurso ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
