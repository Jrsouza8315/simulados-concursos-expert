import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Upload } from "lucide-react";

interface ApostilaFormData {
  nome: string;
  descricao: string;
  arquivo: File | null;
}

export function ApostilaUpload() {
  const [formData, setFormData] = useState<ApostilaFormData>({
    nome: "",
    descricao: "",
    arquivo: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, arquivo: file });
    } else {
      alert("Por favor, selecione um arquivo PDF válido.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.arquivo) {
      alert("Por favor, selecione um arquivo PDF.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Upload do arquivo para o Storage do Supabase
      const fileExt = formData.arquivo.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `apostilas/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("apostilas")
        .upload(filePath, formData.arquivo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Gerar URL pública do arquivo
      const {
        data: { publicUrl },
      } = supabase.storage.from("apostilas").getPublicUrl(filePath);

      // Salvar informações da apostila no banco de dados
      const { error: dbError } = await supabase.from("apostilas").insert([
        {
          nome: formData.nome,
          descricao: formData.descricao,
          arquivo_url: publicUrl,
          arquivo_path: filePath,
        },
      ]);

      if (dbError) throw dbError;

      // Limpar formulário após sucesso
      setFormData({
        nome: "",
        descricao: "",
        arquivo: null,
      });
      setUploadProgress(0);

      alert("Apostila enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar apostila:", error);
      alert("Erro ao enviar apostila. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Envio de Apostilas
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Apostila
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.descricao}
            onChange={(e) =>
              setFormData({ ...formData, descricao: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arquivo PDF
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Selecionar arquivo</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                <p className="pl-1">ou arraste e solte</p>
              </div>
              <p className="text-xs text-gray-500">PDF até 10MB</p>
            </div>
          </div>
          {formData.arquivo && (
            <p className="mt-2 text-sm text-gray-500">
              Arquivo selecionado: {formData.arquivo.name}
            </p>
          )}
        </div>

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar Apostila"}
          </button>
        </div>
      </form>
    </div>
  );
}
