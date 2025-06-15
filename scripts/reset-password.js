import { getSupabaseClient } from "../src/lib/supabase";

const supabase = getSupabaseClient();

const resetPassword = async () => {
  try {
    console.log("Solicitando redefinição de senha...");

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      "hbrcomercialssa@gmail.com",
      {
        redirectTo:
          "https://jrsouza8315.github.io/simulados-concursos-expert/#/reset-password",
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
    console.log("2. Se a página estiver em branco, limpe o cache do navegador");
    console.log(
      "3. Aguarde alguns segundos para a página carregar completamente"
    );
    console.log("----------------------------------------");
  } catch (error) {
    console.error("Erro inesperado:", error);
  }
};

resetPassword();
