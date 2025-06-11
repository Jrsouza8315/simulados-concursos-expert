-- Criar tabela de questões
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enunciado TEXT NOT NULL,
  alternativas TEXT[] NOT NULL,
  resposta_correta INTEGER NOT NULL,
  materia TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('facil', 'medio', 'dificil')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de concursos
CREATE TABLE IF NOT EXISTS concursos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  organizadora TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('aberto', 'em_andamento', 'encerrado')),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  descricao TEXT,
  link_edital TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de apostilas
CREATE TABLE IF NOT EXISTS apostilas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  arquivo_url TEXT NOT NULL,
  tamanho_bytes BIGINT NOT NULL,
  downloads INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de simulados
CREATE TABLE IF NOT EXISTS simulados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  tempo_minutos INTEGER NOT NULL,
  questoes UUID[] NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('facil', 'medio', 'dificil')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT fk_questoes FOREIGN KEY (questoes) REFERENCES questions(id)
);

-- Criar tabela de log de atividades
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('user_signup', 'new_question', 'new_simulado', 'new_concurso', 'new_apostila')),
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Criar políticas de segurança
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE concursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE apostilas ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulados ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Políticas para questões
CREATE POLICY "Questões visíveis para todos" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem criar questões" ON questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem atualizar questões" ON questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Apenas admins podem deletar questões" ON questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Políticas para concursos
CREATE POLICY "Concursos visíveis para todos" ON concursos
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar concursos" ON concursos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Políticas para apostilas
CREATE POLICY "Apostilas visíveis para todos" ON apostilas
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar apostilas" ON apostilas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Políticas para simulados
CREATE POLICY "Simulados visíveis para todos" ON simulados
  FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem gerenciar simulados" ON simulados
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Políticas para log de atividades
CREATE POLICY "Apenas admins podem ver o log de atividades" ON activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Sistema pode inserir logs" ON activity_log
  FOR INSERT WITH CHECK (true);

-- Criar funções e triggers para atualização automática de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_concursos_updated_at
  BEFORE UPDATE ON concursos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apostilas_updated_at
  BEFORE UPDATE ON apostilas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_simulados_updated_at
  BEFORE UPDATE ON simulados
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 