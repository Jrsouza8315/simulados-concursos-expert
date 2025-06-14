import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Editor } from "@tinymce/tinymce-react";

interface QuestionFormData {
  enunciado: string;
  assunto: string;
  cargo: string;
  banca: string;
  ano: string;
  orgao: string;
  nivel: "Fundamental" | "Médio" | "Superior";
  alternativas: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  resposta_correta: "a" | "b" | "c" | "d" | "e";
  comentario: string;
}

export function QuestionForm() {
  const [formData, setFormData] = useState<QuestionFormData>({
    enunciado: "",
    assunto: "",
    cargo: "",
    banca: "",
    ano: "",
    orgao: "",
    nivel: "Superior",
    alternativas: {
      a: "",
      b: "",
      c: "",
      d: "",
      e: "",
    },
    resposta_correta: "a",
    comentario: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("questoes").insert([formData]);

      if (error) throw error;

      // Limpar formulário após sucesso
      setFormData({
        enunciado: "",
        assunto: "",
        cargo: "",
        banca: "",
        ano: "",
        orgao: "",
        nivel: "Superior",
        alternativas: {
          a: "",
          b: "",
          c: "",
          d: "",
          e: "",
        },
        resposta_correta: "a",
        comentario: "",
      });

      alert("Questão cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar questão:", error);
      alert("Erro ao cadastrar questão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Cadastro de Questões
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enunciado
          </label>
          <Editor
            apiKey="YOUR_TINYMCE_API_KEY"
            value={formData.enunciado}
            onEditorChange={(content) =>
              setFormData({ ...formData, enunciado: content })
            }
            init={{
              height: 300,
              menubar: false,
              plugins: ["math", "lists", "link"],
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | math | link",
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assunto/Disciplina
            </label>
            <input
              type="text"
              value={formData.assunto}
              onChange={(e) =>
                setFormData({ ...formData, assunto: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo
            </label>
            <input
              type="text"
              value={formData.cargo}
              onChange={(e) =>
                setFormData({ ...formData, cargo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banca
            </label>
            <input
              type="text"
              value={formData.banca}
              onChange={(e) =>
                setFormData({ ...formData, banca: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <input
              type="text"
              value={formData.ano}
              onChange={(e) =>
                setFormData({ ...formData, ano: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Órgão
            </label>
            <input
              type="text"
              value={formData.orgao}
              onChange={(e) =>
                setFormData({ ...formData, orgao: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nível
            </label>
            <select
              value={formData.nivel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nivel: e.target.value as "Fundamental" | "Médio" | "Superior",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="Fundamental">Fundamental</option>
              <option value="Médio">Médio</option>
              <option value="Superior">Superior</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Alternativas</h3>
          {(["a", "b", "c", "d", "e"] as const).map((letra) => (
            <div key={letra} className="flex items-center space-x-4">
              <input
                type="radio"
                name="resposta_correta"
                value={letra}
                checked={formData.resposta_correta === letra}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resposta_correta: e.target.value as
                      | "a"
                      | "b"
                      | "c"
                      | "d"
                      | "e",
                  })
                }
                className="h-4 w-4 text-blue-600"
              />
              <input
                type="text"
                value={formData.alternativas[letra]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alternativas: {
                      ...formData.alternativas,
                      [letra]: e.target.value,
                    },
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder={`Alternativa ${letra.toUpperCase()}`}
                required
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentário Explicativo
          </label>
          <Editor
            apiKey="YOUR_TINYMCE_API_KEY"
            value={formData.comentario}
            onEditorChange={(content) =>
              setFormData({ ...formData, comentario: content })
            }
            init={{
              height: 200,
              menubar: false,
              plugins: ["math", "lists", "link"],
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | math | link",
            }}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Salvar Questão"}
          </button>
        </div>
      </form>
    </div>
  );
}
