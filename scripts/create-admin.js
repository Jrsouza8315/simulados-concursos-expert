import { createClient } from "@supabase/supabase-js";

// Encrypted credentials
const ENCRYPTED_CREDENTIALS = {
  email: Buffer.from("hbrcomercialssa@gmail.com").toString("base64"),
  password: Buffer.from("Admin@123456").toString("base64"),
};

const SUPABASE_URL = "https://jbrsikexamcvxaeibrwd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicnNpa2V4YW1jdnhhZWlicndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0ODI5NzUsImV4cCI6MjA2NDA1ODk3NX0.i0fbWF9o1em6dwqCy1Q8zDJzBNnzhM1NCeHCX8qTTnI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const decryptCredentials = () => {
  return {
    email: Buffer.from(ENCRYPTED_CREDENTIALS.email, "base64").toString("utf-8"),
    password: Buffer.from(ENCRYPTED_CREDENTIALS.password, "base64").toString(
      "utf-8"
    ),
  };
};

const createAdmin = async () => {
  const credentials = decryptCredentials();
  const { email, password } = credentials;

  try {
    console.log("Criando usuário admin...");

    // 1. Criar o usuário
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "admin",
        },
      },
    });

    if (authError) {
      console.error("Erro ao criar usuário:", authError.message);
      return;
    }

    if (!authData.user) {
      console.error("Usuário não foi criado");
      return;
    }

    console.log("Usuário criado com ID:", authData.user.id);

    // 2. Criar o perfil do usuário
    console.log("Criando perfil do usuário...");
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert([
        {
          id: authData.user.id,
          email: email,
          role: "admin",
          subscription_active: true,
          created_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError.message);
      return;
    }

    console.log("\nUsuário admin criado com sucesso!");
    console.log("----------------------------------------");
    console.log("Email:", email);
    console.log("Senha: [ENCRYPTED]");
    console.log("----------------------------------------");
    console.log("IMPORTANTE: Verifique seu email para confirmar a conta!");
    console.log("----------------------------------------");
  } catch (error) {
    console.error("Erro inesperado:", error);
  }
};

createAdmin();
