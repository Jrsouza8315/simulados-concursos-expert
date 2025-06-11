export interface Question {
  id: string;
  enunciado: string;
  alternativas: string[];
  resposta_correta: number;
  materia: string;
  nivel: "facil" | "medio" | "dificil";
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface Concurso {
  id: string;
  titulo: string;
  organizadora: string;
  status: "aberto" | "em_andamento" | "encerrado";
  data_inicio: string;
  data_fim: string;
  descricao: string;
  link_edital: string;
  created_at: string;
  updated_at: string;
}

export interface Apostila {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  arquivo_url: string;
  tamanho_bytes: number;
  downloads: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Simulado {
  id: string;
  titulo: string;
  descricao: string;
  tempo_minutos: number;
  questoes: string[]; // Array de IDs das questões
  nivel: "facil" | "medio" | "dificil";
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeSubscribers: number;
  totalSimulados: number;
  totalQuestions: number;
  totalConcursos: number;
  totalApostilas: number;
  recentActivity: {
    type:
      | "user_signup"
      | "new_question"
      | "new_simulado"
      | "new_concurso"
      | "new_apostila";
    description: string;
    timestamp: string;
  }[];
}
