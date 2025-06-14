import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

interface SystemSettings {
  max_questoes_simulado: number;
  tempo_padrao_simulado: number;
  dias_acesso_apostilas: number;
  email_suporte: string;
  manutencao: boolean;
}

export function Settings() {
  const [settings, setSettings] = useState<SystemSettings>({
    max_questoes_simulado: 50,
    tempo_padrao_simulado: 120,
    dias_acesso_apostilas: 30,
    email_suporte: "",
    manutencao: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("*")
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase.from("configuracoes").upsert([settings]);

      if (error) throw error;

      alert("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Configurações do Sistema
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Máximo de Questões por Simulado
          </label>
          <input
            type="number"
            value={settings.max_questoes_simulado}
            onChange={(e) =>
              setSettings({
                ...settings,
                max_questoes_simulado: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="1"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempo Padrão do Simulado (minutos)
          </label>
          <input
            type="number"
            value={settings.tempo_padrao_simulado}
            onChange={(e) =>
              setSettings({
                ...settings,
                tempo_padrao_simulado: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="30"
            max="360"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dias de Acesso às Apostilas
          </label>
          <input
            type="number"
            value={settings.dias_acesso_apostilas}
            onChange={(e) =>
              setSettings({
                ...settings,
                dias_acesso_apostilas: parseInt(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="1"
            max="365"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de Suporte
          </label>
          <input
            type="email"
            value={settings.email_suporte}
            onChange={(e) =>
              setSettings({ ...settings, email_suporte: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="manutencao"
            checked={settings.manutencao}
            onChange={(e) =>
              setSettings({ ...settings, manutencao: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="manutencao"
            className="ml-2 block text-sm text-gray-700"
          >
            Modo de Manutenção
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </form>
    </div>
  );
}
