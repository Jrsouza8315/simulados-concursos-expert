export interface Question {
  id: string;
  title: string;
  content: string;
  answer: string;
  explanation: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  created_at: string;
  updated_at: string;
}

export interface Concurso {
  id: string;
  title: string;
  description: string;
  organization: string;
  status: "open" | "closed";
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Apostila {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export interface Simulado {
  id: string;
  user_id: string;
  title: string;
  description: string;
  questions: Question[];
  duration: number;
  created_at: string;
  updated_at: string;
  status: "draft" | "in_progress" | "completed";
  score?: number;
}

export interface SimuladoResponse {
  id: string;
  simulado_id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "assinante" | "visitante";
  subscription_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  name?: string;
  avatar_url?: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeSubscribers: number;
  totalSimulados: number;
  totalQuestions: number;
  totalConcursos: number;
  totalApostilas: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: string;
  created_at: string;
}
