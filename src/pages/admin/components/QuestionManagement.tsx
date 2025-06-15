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
import { Question } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, RefreshCw, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const QuestionManagement = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [formData, setFormData] = useState({
    enunciado: "",
    alternativas: ["", "", "", "", ""],
    resposta_correta: 0,
    materia: "",
    nivel: "facil" as "facil" | "medio" | "dificil",
  });

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
      setFilteredQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Erro ao carregar questões");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const filtered = questions.filter(
      (question) =>
        question.enunciado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.materia.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
  }, [searchTerm, questions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const questionData = {
        ...formData,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingQuestion) {
        const { error } = await supabase
          .from("questions")
          .update({
            ...questionData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingQuestion.id);

        if (error) throw error;
        toast.success("Questão atualizada com sucesso");
      } else {
        const { error } = await supabase
          .from("questions")
          .insert([questionData]);
        if (error) throw error;
        toast.success("Questão cadastrada com sucesso");
      }

      setFormData({
        enunciado: "",
        alternativas: ["", "", "", "", ""],
        resposta_correta: 0,
        materia: "",
        nivel: "facil",
      });
      setShowForm(false);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Erro ao salvar questão");
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      enunciado: question.enunciado || "",
      alternativas: question.alternativas || ["", "", "", "", ""],
      resposta_correta: question.resposta_correta ?? 0,
      materia: question.materia || "",
      nivel: question.nivel,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) return;

    try {
      const { error } = await supabase.from("questions").delete().eq("id", id);

      if (error) throw error;
      toast.success("Questão excluída com sucesso");
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Erro ao excluir questão");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Questões</CardTitle>
          <CardDescription>
            Adicione, edite ou remova questões do banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Buscar questões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchQuestions()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Questão
            </Button>
          </div>

          {showForm && (
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? "Editar Questão" : "Nova Questão"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="enunciado">Enunciado</Label>
                    <Textarea
                      id="enunciado"
                      value={formData.enunciado}
                      onChange={(e) =>
                        setFormData({ ...formData, enunciado: e.target.value })
                      }
                      required
                    />
                  </div>

                  {formData.alternativas.map((alternativa, index) => (
                    <div key={index}>
                      <Label htmlFor={`alternativa-${index}`}>
                        Alternativa {index + 1}
                      </Label>
                      <Input
                        id={`alternativa-${index}`}
                        value={alternativa}
                        onChange={(e) => {
                          const novasAlternativas = [...formData.alternativas];
                          novasAlternativas[index] = e.target.value;
                          setFormData({
                            ...formData,
                            alternativas: novasAlternativas,
                          });
                        }}
                        required
                      />
                    </div>
                  ))}

                  <div>
                    <Label htmlFor="resposta_correta">Resposta Correta</Label>
                    <Select
                      value={formData.resposta_correta.toString()}
                      onValueChange={(value: string) =>
                        setFormData({
                          ...formData,
                          resposta_correta: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a resposta correta" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.alternativas.map((_, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            Alternativa {index + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="materia">Matéria</Label>
                    <Input
                      id="materia"
                      value={formData.materia}
                      onChange={(e) =>
                        setFormData({ ...formData, materia: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nivel">Nível</Label>
                    <Select
                      value={formData.nivel}
                      onValueChange={(value: "facil" | "medio" | "dificil") =>
                        setFormData({
                          ...formData,
                          nivel: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facil">Fácil</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="dificil">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
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
                      {editingQuestion ? "Atualizar" : "Cadastrar"}
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
                  <TableHead>Enunciado</TableHead>
                  <TableHead>Matéria</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.enunciado}</TableCell>
                    <TableCell>{question.materia}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          question.nivel === "facil"
                            ? "default"
                            : question.nivel === "medio"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {question.nivel === "facil"
                          ? "Fácil"
                          : question.nivel === "medio"
                          ? "Médio"
                          : "Difícil"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
