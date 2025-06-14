-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create questoes table
CREATE TABLE questoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  enunciado TEXT NOT NULL,
  assunto TEXT NOT NULL,
  cargo TEXT NOT NULL,
  banca TEXT NOT NULL,
  ano TEXT NOT NULL,
  orgao TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('Fundamental', 'Médio', 'Superior')),
  alternativas JSONB NOT NULL,
  resposta_correta TEXT NOT NULL CHECK (resposta_correta IN ('a', 'b', 'c', 'd', 'e')),
  comentario TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create apostilas table
CREATE TABLE apostilas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  arquivo_url TEXT NOT NULL,
  arquivo_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create simulados table
CREATE TABLE simulados (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  questoes UUID[] NOT NULL,
  tempo_limite INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create configuracoes table
CREATE TABLE configuracoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  max_questoes_simulado INTEGER NOT NULL DEFAULT 50,
  tempo_padrao_simulado INTEGER NOT NULL DEFAULT 120,
  dias_acesso_apostilas INTEGER NOT NULL DEFAULT 30,
  email_suporte TEXT NOT NULL,
  manutencao BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE apostilas ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulados ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Questoes policies
CREATE POLICY "Questoes are viewable by authenticated users"
  ON questoes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert questoes"
  ON questoes FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update questoes"
  ON questoes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete questoes"
  ON questoes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Apostilas policies
CREATE POLICY "Apostilas are viewable by authenticated users"
  ON apostilas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert apostilas"
  ON apostilas FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update apostilas"
  ON apostilas FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete apostilas"
  ON apostilas FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Simulados policies
CREATE POLICY "Users can view their own simulados"
  ON simulados FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own simulados"
  ON simulados FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own simulados"
  ON simulados FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own simulados"
  ON simulados FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Configuracoes policies
CREATE POLICY "Configuracoes are viewable by authenticated users"
  ON configuracoes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can update configuracoes"
  ON configuracoes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create storage bucket for apostilas
INSERT INTO storage.buckets (id, name, public) VALUES ('apostilas', 'apostilas', true);

-- Create storage policy for apostilas
CREATE POLICY "Apostilas are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'apostilas');

CREATE POLICY "Only admins can upload apostilas"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'apostilas' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user(); 