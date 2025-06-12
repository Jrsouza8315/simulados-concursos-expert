import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { AuthContextType, UserProfile } from "../types";
import { getFullUrl } from "../utils/url";

export type UserRole = "admin" | "assinante" | "visitante";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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
      }
    });

    // Escutar mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
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

      // Se for o admin, redirecionar imediatamente
      if (email === "hbrcomercialssa@gmail.com") {
        console.log("Admin login detectado, redirecionando...");
        window.location.href = getFullUrl("/admin");
        return data;
      }

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
          window.location.href = getFullUrl("/admin");
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
              window.location.href = getFullUrl("/admin");
            }
          } else {
            // Se já for admin, redirecionar
            window.location.href = getFullUrl("/admin");
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
