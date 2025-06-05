import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jbrsikexamcvxaeibrwd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicnNpa2V4YW1jdnhhZWlicndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0ODI5NzUsImV4cCI6MjA2NDA1ODk3NX0.i0fbWF9o1em6dwqCy1Q8zDJzBNnzhM1NCeHCX8qTTnI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

const resetPassword = async () => {
  try {
    console.log("Solicitando redefinição de senha...");

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      "hbrcomercialssa@gmail.com",
      {
        redirectTo:
          "https://jrsouza8315.github.io/simulados-concursos-expert/reset-password",
      }
    );

    if (error) {
      console.error("\nErro ao solicitar redefinição de senha:", error.message);
      return;
    }

    console.log("\nSolicitação enviada com sucesso!");
    console.log("----------------------------------------");
    console.log("Por favor, verifique sua caixa de entrada e spam em:");
    console.log("Email: hbrcomercialssa@gmail.com");
    console.log("----------------------------------------");
    console.log("IMPORTANTE:");
    console.log(
      "1. O link no email irá redirecionar para a página de redefinição de senha"
    );
    console.log(
      "2. Se a página estiver em branco, aguarde alguns segundos para carregar"
    );
    console.log(
      "3. Em caso de erro, copie o token da URL e use a página /reset-password manualmente"
    );
    console.log("----------------------------------------");
  } catch (error) {
    console.error("Erro inesperado:", error);
  }
};

resetPassword();
