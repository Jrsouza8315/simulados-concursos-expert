import { supabase } from "../integrations/supabase/client";
import config from "../config/config";

// Rate limiting
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 100; // 100 requisições por minuto

// Função para verificar rate limit
export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (!userLimit) {
    rateLimits.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (now > userLimit.resetTime) {
    rateLimits.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count += 1;
  rateLimits.set(userId, userLimit);
  return true;
};

// Função para verificar se o usuário é admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.role === "admin";
  } catch (error) {
    console.error("Erro ao verificar permissão de admin:", error);
    return false;
  }
};

// Função para verificar se o ambiente é produção
export const isProduction = (): boolean => {
  return config.app.env === "production";
};

// Função para sanitizar input do usuário
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "") // Remove tags HTML
    .replace(/javascript:/gi, "") // Remove javascript:
    .trim(); // Remove espaços extras
};

// Função para validar token JWT
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    return !error && !!user;
  } catch {
    return false;
  }
};

// Função para registrar tentativas de acesso suspeitas
export const logSecurityEvent = async (
  userId: string,
  _action: string,
  _details: string
) => {
  try {
    await supabase.from("activity_log").insert([
      {
        user_id: userId,
        action: "login",
        details: "Login realizado com sucesso",
      },
    ]);
  } catch (error) {
    console.error("Erro ao registrar atividade suspeita:", error);
  }
};

// Função para verificar origem da requisição
export const isValidOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    config.app.url,
    "https://simulados-concursos-expert.vercel.app",
    "https://simulados-concursos-expert.netlify.app",
  ];
  return allowedOrigins.includes(origin);
};

// Função para verificar se a requisição é segura
export const isSecureRequest = (
  protocol: string,
  headers: Headers
): boolean => {
  if (isProduction()) {
    // Em produção, exigir HTTPS
    if (protocol !== "https") return false;

    // Verificar headers de segurança
    const securityHeaders = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    };

    for (const [header, value] of Object.entries(securityHeaders)) {
      if (headers.get(header) !== value) return false;
    }
  }

  return true;
};
