import { supabase } from "../src/integrations/supabase/client";

const createAdmin = async () => {
  const email = "admin@pontosimulado.com";
  const password = "Admin@123456";

  try {
    // 1. Criar o usuário
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Erro ao criar usuário:", authError.message);
      return;
    }

    if (!authData.user) {
      console.error("Usuário não foi criado");
      return;
    }

    // 2. Criar o perfil do usuário
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert([
        {
          id: authData.user.id,
          email: email,
          role: "admin",
          subscription_active: true,
        },
      ]);

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError.message);
      return;
    }

    console.log("Usuário admin criado com sucesso!");
    console.log("Email:", email);
    console.log("Senha:", password);
  } catch (error) {
    console.error("Erro inesperado:", error);
  }
};

createAdmin();
