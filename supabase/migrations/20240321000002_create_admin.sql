-- Função para criar o primeiro admin
CREATE OR REPLACE FUNCTION public.create_first_admin(
  admin_email text,
  admin_password text
)
RETURNS void AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Criar o usuário na autenticação do Supabase
  user_id := (
    SELECT id FROM auth.users
    WHERE email = admin_email
    LIMIT 1
  );

  IF user_id IS NULL THEN
    user_id := (
      SELECT id FROM auth.users
      WHERE auth.create_user(
        admin_email,
        admin_password,
        '{
          "email": "' || admin_email || '",
          "email_confirmed_at": "' || now() || '"
        }'::jsonb
      ) RETURNING id
    );
  END IF;

  -- Criar ou atualizar o perfil do usuário como admin
  INSERT INTO public.user_profiles (id, email, role, subscription_active)
  VALUES (user_id, admin_email, 'admin', true)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      subscription_active = true;

  -- Registrar a criação do admin no log de atividades
  INSERT INTO public.activity_log (
    user_id,
    type,
    description,
    timestamp
  ) VALUES (
    user_id,
    'ADMIN_CREATION',
    'Criação do primeiro usuário administrador',
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revogar acesso público à função
REVOKE ALL ON FUNCTION public.create_first_admin FROM PUBLIC;

-- Comentário explicativo
COMMENT ON FUNCTION public.create_first_admin IS 'Função para criar o primeiro usuário administrador do sistema. Esta função só deve ser executada uma vez durante a configuração inicial.';

-- Exemplo de uso (descomente e substitua os valores para usar):
-- SELECT public.create_first_admin('admin@example.com', 'senha_segura_aqui');

-- Transformar usuário existente em admin
SELECT public.create_first_admin('hbrcomercialssa@gmail.com', '@Mp_323670'); 