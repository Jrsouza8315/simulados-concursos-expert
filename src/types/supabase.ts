export interface Profile {
  id: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
  last_login: string;
}

export interface Questao {
  id: string;
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
  created_at: string;
}

export interface Apostila {
  id: string;
  nome: string;
  descricao: string;
  arquivo_url: string;
  arquivo_path: string;
  created_at: string;
}

export interface Simulado {
  id: string;
  user_id: string;
  titulo: string;
  questoes: string[]; // IDs das questões
  tempo_limite: number;
  created_at: string;
  completed_at: string | null;
}

export interface Configuracao {
  id: string;
  max_questoes_simulado: number;
  tempo_padrao_simulado: number;
  dias_acesso_apostilas: number;
  email_suporte: string;
  manutencao: boolean;
  updated_at: string;
}
