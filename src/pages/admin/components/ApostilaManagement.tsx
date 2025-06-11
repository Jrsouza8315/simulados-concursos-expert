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
import { Apostila } from "@/types/admin";
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
  Download,
  Eye,
} from "lucide-react";

export const ApostilaManagement = () => {
  const [apostilas, setApostilas] = useState<Apostila[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApostilas, setFilteredApostilas] = useState<Apostila[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingApostila, setEditingApostila] = useState<Apostila | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    arquivo_url: "",
    active: true,
  });

  const fetchApostilas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("apostilas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApostilas(data || []);
      setFilteredApostilas(data || []);
    } catch (error) {
      console.error("Error fetching apostilas:", error);
      toast.error("Erro ao carregar apostilas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApostilas();
  }, []);

  useEffect(() => {
    const filtered = apostilas.filter(
      (apostila) =>
        apostila.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apostila.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApostilas(filtered);
  }, [searchTerm, apostilas]);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `apostilas/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("apostilas")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("apostilas")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fileInput = document.querySelector<HTMLInputElement>("#arquivo");
      let arquivo_url = formData.arquivo_url;

      if (fileInput?.files?.length) {
        arquivo_url = await handleFileUpload(fileInput.files[0]);
      }

      const apostilaData = {
        ...formData,
        arquivo_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingApostila) {
        const { error } = await supabase
          .from("apostilas")
          .update({
            ...apostilaData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingApostila.id);

        if (error) throw error;
        toast.success("Apostila atualizada com sucesso");
      } else {
        const { error } = await supabase
          .from("apostilas")
          .insert([apostilaData]);
        if (error) throw error;
        toast.success("Apostila cadastrada com sucesso");
      }

      setFormData({
        titulo: "",
        descricao: "",
        categoria: "",
        arquivo_url: "",
        active: true,
      });
      setShowForm(false);
      setEditingApostila(null);
      fetchApostilas();
    } catch (error) {
      console.error("Error saving apostila:", error);
      toast.error("Erro ao salvar apostila");
    }
  };

  const handleEdit = (apostila: Apostila) => {
    setEditingApostila(apostila);
    setFormData({
      titulo: apostila.titulo,
      descricao: apostila.descricao,
      categoria: apostila.categoria,
      arquivo_url: apostila.arquivo_url,
      active: apostila.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta apostila?")) return;

    try {
      const { error } = await supabase.from("apostilas").delete().eq("id", id);

      if (error) throw error;
      toast.success("Apostila excluída com sucesso");
      fetchApostilas();
    } catch (error) {
      console.error("Error deleting apostila:", error);
      toast.error("Erro ao excluir apostila");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestão de Apostilas</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchApostilas}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Apostila
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título ou categoria..."
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
                  <TableHead>Categoria</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Status</TableHead>
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
                ) : filteredApostilas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhuma apostila encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApostilas.map((apostila) => (
                    <TableRow key={apostila.id}>
                      <TableCell>{apostila.titulo}</TableCell>
                      <TableCell>{apostila.categoria}</TableCell>
                      <TableCell>{apostila.downloads}</TableCell>
                      <TableCell>
                        {formatFileSize(apostila.tamanho_bytes)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={apostila.active ? "default" : "secondary"}
                        >
                          {apostila.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(apostila)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(apostila.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(apostila.arquivo_url, "_blank")
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = apostila.arquivo_url;
                              link.download = apostila.titulo;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
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
              {editingApostila ? "Editar Apostila" : "Nova Apostila"}
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para{" "}
              {editingApostila ? "editar" : "cadastrar"} uma apostila
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
                    placeholder="Digite o título da apostila"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label>Categoria</label>
                  <Input
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                    placeholder="Digite a categoria"
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
                  placeholder="Digite a descrição da apostila"
                  required
                />
              </div>

              <div className="space-y-2">
                <label>Arquivo</label>
                <Input
                  id="arquivo"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        arquivo_url: URL.createObjectURL(file),
                      });
                    }
                  }}
                  disabled={uploading}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingApostila(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading
                    ? "Enviando..."
                    : editingApostila
                    ? "Atualizar"
                    : "Cadastrar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
