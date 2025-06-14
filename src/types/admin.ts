import { Database } from "@/integrations/supabase/types";

export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type QuestionInsert =
  Database["public"]["Tables"]["questions"]["Insert"];
export type QuestionUpdate =
  Database["public"]["Tables"]["questions"]["Update"];

export type Concurso = Database["public"]["Tables"]["concursos"]["Row"];
export type ConcursoInsert =
  Database["public"]["Tables"]["concursos"]["Insert"];
export type ConcursoUpdate =
  Database["public"]["Tables"]["concursos"]["Update"];

export type Apostila = Database["public"]["Tables"]["apostilas"]["Row"];
export type ApostilaInsert =
  Database["public"]["Tables"]["apostilas"]["Insert"];
export type ApostilaUpdate =
  Database["public"]["Tables"]["apostilas"]["Update"];

export type ActivityLog = Database["public"]["Tables"]["activity_log"]["Row"];
export type ActivityLogInsert =
  Database["public"]["Tables"]["activity_log"]["Insert"];
export type ActivityLogUpdate =
  Database["public"]["Tables"]["activity_log"]["Update"];

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

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type UserProfileInsert =
  Database["public"]["Tables"]["user_profiles"]["Insert"];
export type UserProfileUpdate =
  Database["public"]["Tables"]["user_profiles"]["Update"];

export interface AdminDashboardStats {
  totalUsers: number;
  activeSubscribers: number;
  totalSimulados: number;
  totalQuestions: number;
  totalConcursos: number;
  totalApostilas: number;
  recentActivity: ActivityLog[];
}
