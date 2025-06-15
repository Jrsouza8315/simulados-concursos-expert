import { getSupabaseClient } from "../src/lib/supabase";

const supabase = getSupabaseClient();

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
