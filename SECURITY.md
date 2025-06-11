# Diretrizes de Segurança

## Configuração do Ambiente

1. Nunca comite arquivos `.env` ou arquivos de configuração com credenciais
2. Use o arquivo `.env.example` como template e crie seu próprio `.env` local
3. Mantenha as chaves do Supabase e outras credenciais em um local seguro
4. Não compartilhe variáveis de ambiente em chats, e-mails ou mensagens

## Arquivos Sensíveis

Os seguintes arquivos contêm informações sensíveis e NUNCA devem ser commitados:

- `.env` (variáveis de ambiente)
- `supabase/manual_admin_setup.sql` (configuração do admin)
- `supabase/credentials.json` (credenciais do Supabase)
- Quaisquer arquivos com sufixo `.private.*`

## Boas Práticas

1. Sempre use HTTPS em produção
2. Não armazene senhas em texto puro
3. Use tokens de acesso com escopo limitado
4. Implemente rate limiting em APIs
5. Mantenha as dependências atualizadas
6. Faça backup regular do banco de dados
7. Use autenticação de dois fatores quando disponível

## Configuração do Admin

1. O acesso admin é controlado por Row Level Security (RLS) no Supabase
2. Apenas usuários com role="admin" podem acessar funcionalidades administrativas
3. A rota /admin é protegida e não aparece na navegação pública
4. Todas as ações admin são registradas no log de atividades

## Em Caso de Incidente

Se você descobrir uma vulnerabilidade de segurança:

1. NÃO a divulgue publicamente
2. Entre em contato imediatamente com a equipe de desenvolvimento
3. Documente o problema com detalhes
4. Não explore a vulnerabilidade

## Contato

Para reportar problemas de segurança, entre em contato através de:

- Email: [INSERIR EMAIL SEGURO]
- Telegram: [INSERIR CONTATO]
