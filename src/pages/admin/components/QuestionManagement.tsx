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
import { Plus, Search, RefreshCw, Edit, Trash2 } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    title: "",
    content: "",
    answer: "",
    explanation: "",
    category: "",
    difficulty: "easy",
  });

  const [formData, setFormData] = useState({
    enunciado: "",
    alternativas: ["", "", "", "", ""],
    resposta_correta: 0,
    materia: "",
    nivel: "facil" as "facil" | "medio" | "dificil",
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
      enunciado: question.enunciado,
      alternativas: question.alternativas,
      resposta_correta: question.resposta_correta,
      materia: question.materia,
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

  const handleCreateQuestion = async () => {
    try {
      const { error } = await supabase.from("questions").insert([
        {
          ...newQuestion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success("Questão criada com sucesso");
      setIsDialogOpen(false);
      setNewQuestion({
        title: "",
        content: "",
        answer: "",
        explanation: "",
        category: "",
        difficulty: "easy",
      });
      fetchQuestions();
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error("Erro ao criar questão");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestão de Questões</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchQuestions}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Questão
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Questão</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newQuestion.title}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="content">Enunciado</Label>
                      <Textarea
                        id="content"
                        value={newQuestion.content}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            content: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="answer">Resposta</Label>
                      <Input
                        id="answer"
                        value={newQuestion.answer}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            answer: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="explanation">Explicação</Label>
                      <Textarea
                        id="explanation"
                        value={newQuestion.explanation}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            explanation: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        value={newQuestion.category}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            category: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="difficulty">Dificuldade</Label>
                      <select
                        id="difficulty"
                        className="border rounded px-2 py-1"
                        value={newQuestion.difficulty}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            difficulty: e.target
                              .value as Question["difficulty"],
                          })
                        }
                      >
                        <option value="easy">Fácil</option>
                        <option value="medium">Média</option>
                        <option value="hard">Difícil</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateQuestion}>Criar</Button>
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
              placeholder="Buscar por enunciado ou matéria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enunciado</TableHead>
                  <TableHead>Matéria</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhuma questão encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-md truncate">
                        {question.enunciado}
                      </TableCell>
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
                          {question.nivel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={question.active ? "default" : "secondary"}
                        >
                          {question.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
              {editingQuestion ? "Editar Questão" : "Nova Questão"}
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para{" "}
              {editingQuestion ? "editar" : "cadastrar"} uma questão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label>Enunciado</label>
                <Textarea
                  value={formData.enunciado}
                  onChange={(e) =>
                    setFormData({ ...formData, enunciado: e.target.value })
                  }
                  placeholder="Digite o enunciado da questão"
                  required
                />
              </div>

              <div className="space-y-4">
                <label>Alternativas</label>
                {formData.alternativas.map((alt, index) => (
                  <Input
                    key={index}
                    value={alt}
                    onChange={(e) => {
                      const novasAlternativas = [...formData.alternativas];
                      novasAlternativas[index] = e.target.value;
                      setFormData({
                        ...formData,
                        alternativas: novasAlternativas,
                      });
                    }}
                    placeholder={`Alternativa ${index + 1}`}
                    required
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label>Resposta Correta</label>
                  <Select
                    value={formData.resposta_correta.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        resposta_correta: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
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

                <div className="space-y-2">
                  <label>Matéria</label>
                  <Input
                    value={formData.materia}
                    onChange={(e) =>
                      setFormData({ ...formData, materia: e.target.value })
                    }
                    placeholder="Digite a matéria"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label>Nível</label>
                  <Select
                    value={formData.nivel}
                    onValueChange={(value: "facil" | "medio" | "dificil") =>
                      setFormData({ ...formData, nivel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingQuestion(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingQuestion ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
