# Ponto Simulado - Sistema de Simulados para Concursos

Sistema completo para gerenciamento de simulados, questões e apostilas para concursos públicos.

## 🚀 Funcionalidades

- Dashboard administrativo com estatísticas
- Cadastro de questões com suporte a HTML e LaTeX
- Upload de apostilas em PDF
- Geração de simulados personalizados
- Sistema de autenticação e autorização
- Interface responsiva e moderna

## 🛠️ Tecnologias Utilizadas

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- TinyMCE Editor
- Recharts (Gráficos)

## 📋 Pré-requisitos

- Node.js 16+
- NPM ou Yarn
- Conta no Supabase
- Chave de API do TinyMCE

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/ponto-simulado.git
cd ponto-simulado
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
VITE_TINYMCE_API_KEY=sua_chave_do_tinymce
```

4. Execute as migrações do Supabase:

```bash
npx supabase db push
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

## 📦 Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── lib/           # Configurações e utilitários
  ├── types/         # Definições de tipos
  ├── contexts/      # Contextos do React
  ├── hooks/         # Hooks personalizados
  └── styles/        # Estilos globais
```

## 🔐 Configuração do Supabase

1. Crie um novo projeto no Supabase
2. Execute o arquivo de migração em `supabase/migrations/20240320000000_create_tables.sql`
3. Configure as políticas de segurança (RLS) conforme definido no arquivo de migração
4. Crie um bucket de storage chamado 'apostilas' para armazenar os PDFs

## 👥 Papéis de Usuário

- **Admin**: Acesso completo ao sistema, incluindo cadastro de questões e apostilas
- **Usuário**: Acesso aos simulados e apostilas disponíveis

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📫 Contato

Para dúvidas, sugestões ou problemas, por favor abra uma issue no GitHub ou entre em contato através do email: [seu-email@exemplo.com]

---

Desenvolvido com ❤️ pela equipe Ponto Simulado
