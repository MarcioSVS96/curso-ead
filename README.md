# EduPlatform - Plataforma de Cursos Online

Uma plataforma completa de educação à distância (EAD) construída com Next.js e Node.js.

## 🚀 Funcionalidades

### Frontend (Next.js)
- ✅ Autenticação JWT e OAuth Google
- ✅ Dashboard personalizado por tipo de usuário
- ✅ Catálogo de cursos com filtros
- ✅ Player de vídeo com controle de progresso
- ✅ Sistema de matrículas
- ✅ Área do instrutor para criação de cursos
- ✅ Perfil de usuário
- ✅ Design responsivo com Tailwind CSS

### Backend (Node.js/Express)
- ✅ API RESTful completa
- ✅ Autenticação JWT e OAuth
- ✅ Sistema de roles (Admin, Instrutor, Aluno)
- ✅ CRUD de cursos, módulos e aulas
- ✅ Sistema de matrículas e progresso
- ✅ Sistema de avaliações e certificados
- ✅ Testes automatizados com Jest

## 📋 Pré-requisitos

- Node.js 18+ 
- MySQL 8+
- npm ou yarn
- XAMPP (para configuração local do banco de dados)

## 🔧 Configuração do Projeto

### 1. Clone o repositório
\`\`\`bash
git clone <repository-url>
cd online-courses-platform
\`\`\`

### 2. Configuração do Backend com XAMPP

#### Instalar dependências
\`\`\`bash
npm install
\`\`\`

#### Configurar banco de dados no XAMPP
1. **Iniciar XAMPP:**
   - Abra o XAMPP Control Panel
   - Inicie os serviços **Apache** e **MySQL**

2. **Criar banco de dados:**
   \`\`\`bash
   # Acesse: http://localhost/phpmyadmin
   # Ou use o terminal MySQL do XAMPP:
   
   # Windows:
   cd C:\xampp\mysql\bin
   mysql.exe -u root -p
   
   # Mac:
   /Applications/XAMPP/xamppfiles/bin/mysql -u root -p
   
   # Criar banco:
   CREATE DATABASE online_courses;
   exit
   \`\`\`

3. **Executar script de criação das tabelas:**
   \`\`\`bash
   # Windows:
   cd C:\xampp\mysql\bin
   mysql.exe -u root -p online_courses < caminho/para/scripts/database-setup.sql
   
   # Mac:
   /Applications/XAMPP/xamppfiles/bin/mysql -u root -p online_courses < scripts/database-setup.sql
   
   # Ou importe via phpMyAdmin:
   # 1. Acesse http://localhost/phpmyadmin
   # 2. Selecione o banco 'online_courses'
   # 3. Clique em 'Importar'
   # 4. Selecione o arquivo 'scripts/database-setup.sql'
   # 5. Clique em 'Executar'
   \`\`\`

#### Configurar variáveis de ambiente para XAMPP
Crie um arquivo `.env` na raiz com as configurações do XAMPP:
\`\`\`env
# Database XAMPP (padrão)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=online_courses

# Porta MySQL do XAMPP (padrão é 3306)
DB_PORT=3306

# JWT
JWT_SECRET=meu_jwt_secret_super_seguro_123456
JWT_EXPIRES_IN=7d

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
\`\`\`

**Nota importante:** Por padrão, o MySQL do XAMPP não tem senha para o usuário root, por isso `DB_PASSWORD=` fica vazio.

### 3. Configuração do Frontend

#### Configurar variáveis de ambiente
Crie um arquivo \`.env.local\`:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_google_client_id
\`\`\`

#### Iniciar o frontend
\`\`\`bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
\`\`\`

## 🌐 Deploy na Vercel

### 1. Deploy do Frontend
1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente:
   - \`NEXT_PUBLIC_API_URL\`: URL da sua API backend
   - \`NEXT_PUBLIC_GOOGLE_CLIENT_ID\`: ID do cliente Google OAuth

### 2. Deploy do Backend
Você pode usar serviços como:
- **Railway**: Para deploy automático
- **Heroku**: Para aplicações Node.js
- **DigitalOcean**: Para VPS
- **AWS**: Para infraestrutura completa

### 3. Banco de Dados
Configure um banco MySQL em:
- **PlanetScale**: MySQL serverless
- **Railway**: PostgreSQL/MySQL
- **AWS RDS**: Banco gerenciado
- **DigitalOcean**: Banco gerenciado

## 📱 Uso da Aplicação

### Tipos de Usuário

#### Aluno (Student)
- Navegar e filtrar cursos
- Matricular-se em cursos
- Assistir aulas e acompanhar progresso
- Fazer avaliações
- Baixar certificados

#### Instrutor (Instructor)
- Criar e gerenciar cursos
- Adicionar módulos e aulas
- Acompanhar estatísticas dos cursos
- Gerenciar alunos matriculados

#### Administrador (Admin)
- Aprovar cursos
- Gerenciar usuários
- Visualizar relatórios
- Configurações da plataforma

### Fluxo Principal

1. **Registro/Login**: Usuário se cadastra ou faz login
2. **Explorar Cursos**: Navega pelo catálogo
3. **Matrícula**: Se matricula em cursos de interesse
4. **Aprendizado**: Assiste aulas e acompanha progresso
5. **Avaliação**: Faz provas e recebe feedback
6. **Certificação**: Recebe certificado ao concluir

## 🧪 Testes

\`\`\`bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
\`\`\`

## 📊 Estrutura do Projeto

\`\`\`
├── app/                    # Páginas Next.js (App Router)
├── components/             # Componentes React reutilizáveis
├── contexts/              # Context API (Auth, etc.)
├── lib/                   # Utilitários e configurações
├── src/                   # Backend Node.js
│   ├── config/           # Configurações (DB, Passport)
│   ├── controllers/      # Controladores da API
│   ├── middleware/       # Middlewares (Auth, etc.)
│   ├── routes/          # Rotas da API
│   └── validation/      # Validações
├── scripts/              # Scripts SQL
└── __tests__/           # Testes automatizados
\`\`\`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@eduplatform.com ou abra uma issue no GitHub.

## 🔗 Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Express.js](https://expressjs.com/)
- [Documentação MySQL](https://dev.mysql.com/doc/)
- [Documentação Vercel](https://vercel.com/docs)
