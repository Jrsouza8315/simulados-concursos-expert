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

-- Políticas de segurança para user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
ON public.user_profiles FOR SELECT
USING (is_admin());

CREATE POLICY "Admins podem atualizar perfis"
ON public.user_profiles FOR UPDATE
USING (is_admin());

-- Políticas de segurança para questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver questões"
ON public.questions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Apenas admins podem criar questões"
ON public.questions FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Apenas admins podem atualizar questões"
ON public.questions FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Apenas admins podem deletar questões"
ON public.questions FOR DELETE
TO authenticated
USING (is_admin());

-- Políticas de segurança para concursos
ALTER TABLE public.concursos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver concursos"
ON public.concursos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Apenas admins podem criar concursos"
ON public.concursos FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Apenas admins podem atualizar concursos"
ON public.concursos FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Apenas admins podem deletar concursos"
ON public.concursos FOR DELETE
TO authenticated
USING (is_admin());

-- Políticas de segurança para apostilas
ALTER TABLE public.apostilas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver apostilas"
ON public.apostilas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Apenas admins podem criar apostilas"
ON public.apostilas FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Apenas admins podem atualizar apostilas"
ON public.apostilas FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Apenas admins podem deletar apostilas"
ON public.apostilas FOR DELETE
TO authenticated
USING (is_admin());

-- Políticas de segurança para activity_log
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas admins podem ver logs de atividade"
ON public.activity_log FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Sistema pode criar logs de atividade"
ON public.activity_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- Trigger para registrar atividades administrativas
CREATE OR REPLACE FUNCTION public.log_admin_activity()
RETURNS trigger AS $$
BEGIN
  IF is_admin() THEN
    INSERT INTO public.activity_log (
      user_id,
      type,
      description,
      timestamp
    ) VALUES (
      auth.uid(),
      TG_OP,
      'Ação ' || TG_OP || ' em ' || TG_TABLE_NAME || ' ID: ' || COALESCE(NEW.id::text, OLD.id::text),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger nas tabelas principais
CREATE TRIGGER log_questions_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_activity();

CREATE TRIGGER log_concursos_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.concursos
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_activity();

CREATE TRIGGER log_apostilas_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.apostilas
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_activity();

CREATE TRIGGER log_user_profiles_changes
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_activity(); 