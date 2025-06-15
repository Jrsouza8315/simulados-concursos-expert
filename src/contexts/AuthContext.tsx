import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "../types";
import { getFullUrl } from "../utils/url";
import { toast } from "sonner";

export type UserRole = "admin" | "assinante" | "visitante";

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user profile immediately after sign in
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          throw profileError;
        }

        // Ensure profile role is of type UserRole
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email,
          role: profile.role as UserRole,
          subscription_active: profile.subscription_active || false,
        };

        setUserProfile(userProfile);

        // Check if user is admin and redirect accordingly
        if (userProfile.role === "admin") {
          console.log("Admin login detected, redirecionando...");
          window.location.href = "/#/admin";
          return data;
        }

        // Redirect regular users to dashboard
        window.location.href = "/#/dashboard";
      }

      return data;
    } catch (error) {
      console.error("Error in signIn:", error);
      throw error;
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for ID:", userId);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);

        // Se o usuário for o admin e o perfil não existir, criar um novo
        const session = await supabase.auth.getSession();
        const userEmail = session.data.session?.user?.email;

        if (userEmail === "hbrcomercialssa@gmail.com") {
          console.log("Creating admin profile...");
          const { data: newProfile, error: createError } = await supabase
            .from("user_profiles")
            .insert([
              {
                id: userId,
                email: userEmail,
                role: "admin" as UserRole,
                subscription_active: true,
                created_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (createError) {
            console.error("Error creating admin profile:", createError);
            throw createError;
          }

          console.log("Admin profile created successfully:", newProfile);
          setUserProfile({
            id: newProfile.id,
            email: newProfile.email,
            role: "admin" as UserRole,
            subscription_active: true,
          });

          // Redirecionar para a página de admin
          window.location.href =
            "https://jrsouza8315.github.io/simulados-concursos-expert/admin.html";
          return;
        }

        throw error;
      }

      if (data) {
        console.log("User profile loaded:", data);
        // Verificar se é o email do admin
        if (data.email === "hbrcomercialssa@gmail.com") {
          console.log("Admin email detected, ensuring admin role");
          // Atualizar para admin se ainda não for
          if (data.role !== "admin") {
            console.log("Updating user role to admin");
            const { error: updateError } = await supabase
              .from("user_profiles")
              .update({ role: "admin" })
              .eq("id", userId);

            if (updateError) {
              console.error("Error updating admin role:", updateError);
            } else {
              console.log("Successfully updated to admin role");
              data.role = "admin";
              // Redirecionar para a página de admin após atualização
              window.location.href =
                "https://jrsouza8315.github.io/simulados-concursos-expert/admin.html";
            }
          } else {
            // Se já for admin, redirecionar
            window.location.href =
              "https://jrsouza8315.github.io/simulados-concursos-expert/admin.html";
          }
        }

        const profile: UserProfile = {
          id: data.id,
          email: data.email,
          role: data.role as UserRole,
          subscription_active: data.subscription_active || false,
        };
        console.log("Setting user profile:", profile);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      toast.error("Erro ao carregar perfil do usuário");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: UserRole = "visitante"
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.user.email) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert({
            id: data.user.id,
            email: data.user.email,
            role,
            subscription_active: false,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          throw profileError;
        }
      }

      return data;
    } catch (error) {
      console.error("Error in signUp:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserProfile(null);
      setSession(null);
    } catch (error) {
      console.error("Error in signOut:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error("Error in resetPassword:", error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
