import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface QuestionFormData {
  enunciado: string;
  alternativas: string[];
  resposta_correta: number;
  materia: string;
  nivel: "facil" | "medio" | "dificil";
  active?: boolean;
}

export default function QuestionForm() {
  const [formData, setFormData] = useState<QuestionFormData>({
    enunciado: "",
    alternativas: ["", "", "", "", ""],
    resposta_correta: 0,
    materia: "",
    nivel: "medio",
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("questions").insert([formData]);

      if (error) {
        throw error;
      }

      toast.success("Questão adicionada com sucesso!");
      setFormData({
        enunciado: "",
        alternativas: ["", "", "", "", ""],
        resposta_correta: 0,
        materia: "",
        nivel: "medio",
        active: true,
      });
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error("Erro ao adicionar questão");
    }
  };

  const handleAlternativeChange = (index: number, value: string) => {
    const newAlternatives = [...formData.alternativas];
    newAlternatives[index] = value;
    setFormData({ ...formData, alternativas: newAlternatives });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Enunciado
        </label>
        <textarea
          value={formData.enunciado}
          onChange={(e) =>
            setFormData({ ...formData, enunciado: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Alternativas
        </label>
        {formData.alternativas.map((alt, index) => (
          <div key={index} className="mt-2">
            <input
              type="text"
              value={alt}
              onChange={(e) => handleAlternativeChange(index, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={`Alternativa ${index + 1}`}
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Resposta Correta
        </label>
        <select
          value={formData.resposta_correta}
          onChange={(e) =>
            setFormData({
              ...formData,
              resposta_correta: parseInt(e.target.value),
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          {formData.alternativas.map((_, index) => (
            <option key={index} value={index}>
              Alternativa {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Matéria
        </label>
        <input
          type="text"
          value={formData.materia}
          onChange={(e) =>
            setFormData({ ...formData, materia: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nível</label>
        <select
          value={formData.nivel}
          onChange={(e) =>
            setFormData({
              ...formData,
              nivel: e.target.value as "facil" | "medio" | "dificil",
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="facil">Fácil</option>
          <option value="medio">Médio</option>
          <option value="dificil">Difícil</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Adicionar Questão
      </button>
    </form>
  );
}
