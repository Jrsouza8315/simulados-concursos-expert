import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "../contexts/AuthContext";

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  subscription_active: boolean | undefined;
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    user: User | null;
    session: Session | null;
  }>;
  signUp: (
    email: string,
    password: string,
    role?: UserRole
  ) => Promise<{
    user: User | null;
    session: Session | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
