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
import { Plus, RefreshCw, Edit, Trash2, Link as LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const ConcursoManagement = () => {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [selectedConcurso, setSelectedConcurso] = useState<Concurso | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConcursos, setFilteredConcursos] = useState<Concurso[]>([]);
  const [showForm, setShowForm] = useState(false);

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

      if (selectedConcurso) {
        const { error } = await supabase
          .from("concursos")
          .update({
            ...concursoData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedConcurso.id);

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
      setSelectedConcurso(null);
      fetchConcursos();
    } catch (error) {
      console.error("Error saving concurso:", error);
      toast.error("Erro ao salvar concurso");
    }
  };

  const handleEdit = (concurso: Concurso) => {
    setSelectedConcurso(concurso);
    setFormData({
      titulo: concurso.titulo || "",
      organizadora: concurso.organizadora || "",
      status: concurso.status,
      data_inicio: concurso.data_inicio || "",
      data_fim: concurso.data_fim || "",
      descricao: concurso.descricao || "",
      link_edital: concurso.link_edital || "",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aberto":
        return <Badge variant="default">Aberto</Badge>;
      case "em_andamento":
        return <Badge variant="secondary">Em Andamento</Badge>;
      case "encerrado":
        return <Badge variant="destructive">Encerrado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleOpenEdital = (link: string | null) => {
    if (typeof link === "string" && link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Concursos</CardTitle>
          <CardDescription>
            Adicione, edite ou remova concursos do banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Buscar concursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchConcursos()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Concurso
            </Button>
          </div>

          {showForm && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedConcurso ? "Editar Concurso" : "Novo Concurso"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) =>
                        setFormData({ ...formData, titulo: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="organizadora">Organizadora</Label>
                    <Input
                      id="organizadora"
                      value={formData.organizadora}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organizadora: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as
                            | "aberto"
                            | "em_andamento"
                            | "encerrado",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="em_andamento">
                          Em Andamento
                        </SelectItem>
                        <SelectItem value="encerrado">Encerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="data_inicio">Data de Início</Label>
                    <Input
                      id="data_inicio"
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          data_inicio: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="data_fim">Data de Término</Label>
                    <Input
                      id="data_fim"
                      type="date"
                      value={formData.data_fim}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          data_fim: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={formData.descricao}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descricao: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="link_edital">Link do Edital</Label>
                    <Input
                      id="link_edital"
                      type="url"
                      value={formData.link_edital}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          link_edital: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {selectedConcurso ? "Atualizar" : "Cadastrar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Organizadora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Data de Término</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConcursos.map((concurso) => (
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
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(concurso)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(concurso.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {concurso.link_edital && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleOpenEdital(concurso.link_edital)
                            }
                          >
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
