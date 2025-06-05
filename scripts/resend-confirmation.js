import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jbrsikexamcvxaeibrwd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicnNpa2V4YW1jdnhhZWlicndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0ODI5NzUsImV4cCI6MjA2NDA1ODk3NX0.i0fbWF9o1em6dwqCy1Q8zDJzBNnzhM1NCeHCX8qTTnI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const resendConfirmation = async () => {
  try {
    console.log("Solicitando reenvio do email de confirmação...");

    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email: "hbrcomercialssa@gmail.com",
    });

    if (error) {
      console.error("Erro ao solicitar reenvio:", error.message);
      return;
    }

    console.log("\nSolicitação enviada com sucesso!");
    console.log("----------------------------------------");
    console.log("Por favor, verifique sua caixa de entrada e spam em:");
    console.log("Email: hbrcomercialssa@gmail.com");
    console.log("----------------------------------------");
  } catch (error) {
    console.error("Erro inesperado:", error);
  }
};

resendConfirmation();
