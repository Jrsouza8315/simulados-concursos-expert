import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { UserProfile } from "../types";
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
    password: string
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
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to initialize auth")
        );
        toast.error("Erro ao inicializar autenticação");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escutar mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      try {
        setLoading(true);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error("Error handling auth state change:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to handle auth state change")
        );
        toast.error("Erro ao atualizar estado de autenticação");
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

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
      setError(error instanceof Error ? error : new Error("Failed to sign in"));
      toast.error("Erro ao fazer login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

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
          window.location.href = "/#/admin";
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
              throw updateError;
            } else {
              console.log("Successfully updated to admin role");
              data.role = "admin";
              // Redirecionar para a página de admin após atualização
              window.location.href = "/#/admin";
            }
          }
        }

        setUserProfile({
          id: data.id,
          email: data.email,
          role: data.role as UserRole,
          subscription_active: data.subscription_active || false,
        });
      }
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch user profile")
      );
      toast.error("Erro ao carregar perfil do usuário");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert([
            {
              id: data.user.id,
              email: data.user.email || "",
              role: "user",
              subscription_active: false,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          throw profileError;
        }

        toast.success(
          "Conta criada com sucesso! Verifique seu email para confirmar o cadastro."
        );
      }

      return data;
    } catch (error) {
      console.error("Error in signUp:", error);
      setError(error instanceof Error ? error : new Error("Failed to sign up"));
      toast.error("Erro ao criar conta");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setUserProfile(null);
      setSession(null);

      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error("Error in signOut:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to sign out")
      );
      toast.error("Erro ao fazer logout");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/resetar-senha.html`,
      });

      if (error) throw error;

      toast.success("Email de recuperação de senha enviado com sucesso!");
    } catch (error) {
      console.error("Error in resetPassword:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to reset password")
      );
      toast.error("Erro ao enviar email de recuperação de senha");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        session,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
