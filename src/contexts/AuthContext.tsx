import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { AuthContextType } from "../types";

export type UserRole = "admin" | "assinante" | "visitante";

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  subscription_active?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
          window.location.replace(
            "https://jrsouza8315.github.io/simulados-concursos-expert/#/admin"
          );
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
              window.location.replace(
                "https://jrsouza8315.github.io/simulados-concursos-expert/#/admin"
              );
            }
          } else {
            // Se já for admin, redirecionar
            window.location.replace(
              "https://jrsouza8315.github.io/simulados-concursos-expert/#/admin"
            );
          }
        }

        const profile: UserProfile = {
          id: data.id,
          email: data.email,
          role: data.role as UserRole,
          subscription_active:
            data.subscription_active === null
              ? undefined
              : data.subscription_active,
        };
        console.log("Setting user profile:", profile);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
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
      }
      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
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
        await fetchUserProfile(data.user.id);
      }

      return data;
    } catch (error) {
      console.error("Error in signIn:", error);
      throw error;
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

      if (data.user) {
        const profile = {
          id: data.user.id,
          email: data.user.email || "",
          role,
          subscription_active: false,
        };

        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert([profile]);

        if (profileError) throw profileError;
      }

      return data;
    } catch (error) {
      console.error("Error in signUp:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
