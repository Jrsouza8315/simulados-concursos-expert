interface Config {
  admin: {
    email: string;
  };
  app: {
    env: string;
    url: string;
  };
}

const config: Config = {
  admin: {
    email: import.meta.env.VITE_ADMIN_EMAIL || "",
  },
  app: {
    env: import.meta.env.VITE_APP_ENV || "development",
    url: import.meta.env.VITE_APP_URL || "http://localhost:5173",
  },
};

// Validação das variáveis de ambiente obrigatórias
const requiredEnvVars = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
  "VITE_ADMIN_EMAIL",
];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(
      `Variável de ambiente obrigatória não encontrada: ${envVar}`
    );
  }
}

export default config;
