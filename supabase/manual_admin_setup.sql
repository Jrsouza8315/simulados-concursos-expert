-- Habilitar a extensão pgcrypto se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar tabelas necessárias
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'visitante' CHECK (role IN ('admin', 'assinante', 'visitante')),
    subscription_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enunciado TEXT NOT NULL,
    alternativas JSONB NOT NULL,
    resposta_correta INTEGER NOT NULL,
    materia TEXT NOT NULL,
    nivel TEXT NOT NULL CHECK (nivel IN ('facil', 'medio', 'dificil')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.concursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    orgao TEXT NOT NULL,
    cargo TEXT NOT NULL,
    nivel TEXT NOT NULL,
    estado TEXT,
    data_prova DATE,
    status TEXT NOT NULL CHECK (status IN ('aberto', 'em_andamento', 'encerrado')),
    link_edital TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.apostilas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    materia TEXT NOT NULL,
    nivel TEXT NOT NULL CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
    url_download TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Função auxiliar para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS nas tabelas
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apostilas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver seu próprio perfil"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
ON public.user_profiles FOR SELECT
USING (is_admin());

CREATE POLICY "Admins podem atualizar perfis"
ON public.user_profiles FOR UPDATE
USING (is_admin());

-- Transformar o usuário existente em admin
INSERT INTO public.user_profiles (id, email, role, subscription_active)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'hbrcomercialssa@gmail.com'),
  'hbrcomercialssa@gmail.com',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    subscription_active = true;

-- Registrar a ação no log
INSERT INTO public.activity_log (
  user_id,
  type,
  description,
  timestamp
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'hbrcomercialssa@gmail.com'),
  'ADMIN_CREATION',
  'Usuário transformado em administrador',
  NOW()
); 