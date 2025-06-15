import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SimuladoFormData {
  titulo: string;
  organizadora: string;
  status: "aberto" | "em_andamento" | "encerrado";
  data_inicio: string;
  data_fim: string;
  descricao?: string;
  link_edital?: string;
}

export default function SimuladoForm() {
  const [formData, setFormData] = useState<SimuladoFormData>({
    titulo: "",
    organizadora: "",
    status: "aberto",
    data_inicio: "",
    data_fim: "",
    descricao: "",
    link_edital: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("concursos").insert([
        {
          ...formData,
          descricao: formData.descricao || null,
          link_edital: formData.link_edital || null,
        },
      ]);
      if (error) throw error;
      toast.success("Simulado criado com sucesso!");
      setFormData({
        titulo: "",
        organizadora: "",
        status: "aberto",
        data_inicio: "",
        data_fim: "",
        descricao: "",
        link_edital: "",
      });
    } catch (error) {
      console.error("Error creating simulado:", error);
      toast.error("Erro ao criar simulado");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Organizadora
        </label>
        <input
          type="text"
          value={formData.organizadora}
          onChange={(e) =>
            setFormData({ ...formData, organizadora: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as SimuladoFormData["status"],
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="aberto">Aberto</option>
          <option value="em_andamento">Em andamento</option>
          <option value="encerrado">Encerrado</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Início
        </label>
        <input
          type="date"
          value={formData.data_inicio}
          onChange={(e) =>
            setFormData({ ...formData, data_inicio: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Fim
        </label>
        <input
          type="date"
          value={formData.data_fim}
          onChange={(e) =>
            setFormData({ ...formData, data_fim: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Link do Edital
        </label>
        <input
          type="url"
          value={formData.link_edital}
          onChange={(e) =>
            setFormData({ ...formData, link_edital: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Criar Simulado
      </button>
    </form>
  );
}
