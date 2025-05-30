import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "assinante" | "visitante";
}

export interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role?: "admin" | "assinante" | "visitante"
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
