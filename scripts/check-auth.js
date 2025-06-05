import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jbrsikexamcvxaeibrwd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicnNpa2V4YW1jdnhhZWlicndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0ODI5NzUsImV4cCI6MjA2NDA1ODk3NX0.i0fbWF9o1em6dwqCy1Q8zDJzBNnzhM1NCeHCX8qTTnI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const checkAuth = async () => {
  try {
    console.log("Verificando autenticação...");

    // Tentar fazer login
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: "hbrcomercialssa@gmail.com",
        password: "Admin@123456",
      });

    if (signInError) {
      console.error("\nErro ao fazer login:", signInError.message);
      console.log("\nTentando recuperar informações do usuário...");

      // Verificar se o usuário existe
      const {
        data: { users },
        error: getUserError,
      } = await supabase.auth.admin.listUsers();

      if (getUserError) {
        console.error("Erro ao buscar usuários:", getUserError.message);
      } else if (users) {
        const adminUser = users.find(
          (u) => u.email === "hbrcomercialssa@gmail.com"
        );
        if (adminUser) {
          console.log("\nStatus do usuário:");
          console.log("----------------------------------------");
          console.log("ID:", adminUser.id);
          console.log("Email:", adminUser.email);
          console.log(
            "Email confirmado:",
            adminUser.email_confirmed_at ? "Sim" : "Não"
          );
          console.log("Último login:", adminUser.last_sign_in_at || "Nunca");
          console.log("----------------------------------------");
        } else {
          console.log("\nUsuário não encontrado no sistema.");
        }
      }
    } else {
      console.log("\nLogin realizado com sucesso!");
      console.log("----------------------------------------");
      console.log("Usuário:", signInData.user.email);
      console.log("Role:", signInData.user.role);
      console.log("----------------------------------------");
    }
  } catch (error) {
    console.error("Erro inesperado:", error);
  }
};

checkAuth();
