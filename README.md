# 🏋️ GymPass Style App

API RESTful para gerenciamento de check-ins em academias, inspirada no modelo de negócio do GymPass. Desenvolvida com Node.js, TypeScript, Fastify e Prisma ORM.

## 📋 Sobre o Projeto

Esta aplicação permite que usuários se cadastrem, busquem academias próximas e realizem check-ins. Administradores podem cadastrar academias e validar check-ins dos usuários.

## ✨ Funcionalidades

### RFs (Requisitos Funcionais)
- ✅ Deve ser possível se cadastrar
- ✅ Deve ser possível se autenticar
- ✅ Deve ser possível obter o perfil de um usuário logado
- ✅ Deve ser possível obter o número de check-ins realizados pelo usuário logado
- ✅ Deve ser possível o usuário obter o seu histórico de check-ins
- ✅ Deve ser possível o usuário buscar academias próximas (até 10km)
- ✅ Deve ser possível o usuário buscar academias pelo nome
- ✅ Deve ser possível o usuário realizar check-in em uma academia
- ✅ Deve ser possível validar o check-in de um usuário
- ✅ Deve ser possível cadastrar uma academia

### RNs (Regras de Negócio)
- ✅ O usuário não deve poder se cadastrar com um e-mail duplicado
- ✅ O usuário não pode fazer 2 check-ins no mesmo dia
- ✅ O usuário não pode fazer check-in se não estiver perto (100m) da academia
- ✅ O check-in só pode ser validado até 20 minutos após ser criado
- ✅ O check-in só pode ser validado por administradores
- ✅ A academia só pode ser cadastrada por administradores

### RNFs (Requisitos Não-Funcionais)
- ✅ A senha do usuário precisa estar criptografada
- ✅ Os dados da aplicação precisam estar persistidos em um banco PostgreSQL
- ✅ Todas listas de dados precisam estar paginadas com 20 itens por página
- ✅ O usuário deve ser identificado por um JWT (JSON Web Token)

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Fastify** - Framework web rápido e de baixo overhead
- **Prisma ORM** - ORM moderno para Node.js e TypeScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **Bcrypt.js** - Hash de senhas
- **Zod** - Validação de schemas
- **Vitest** - Framework de testes unitários e E2E
- **Docker & Docker Compose** - Containerização da aplicação

## 📊 Modelo de Dados

### User (Usuário)
- `id`: UUID
- `name`: String
- `email`: String (único)
- `password_hash`: String
- `role`: Enum (MEMBER | ADMIN)
- `created_at`: DateTime
- `updated_at`: DateTime

### Gym (Academia)
- `id`: UUID
- `title`: String
- `description`: String (opcional)
- `phone`: String (opcional)
- `latitude`: Decimal
- `longitude`: Decimal

### CheckIn
- `id`: UUID
- `created_at`: DateTime
- `validated_at`: DateTime (opcional)
- `user_id`: UUID (FK → User)
- `gym_id`: UUID (FK → Gym)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/MarcosHHOshiro/Gym-pass-style-app-node.git
cd Gym-pass-style-app-node
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
NODE_ENV=dev
PORT=3333
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://docker:docker@localhost:5435/apisolid?schema=public
```

### Executando com Docker

1. Inicie os containers:
```bash
docker compose up -d --build
```

2. A API estará disponível em `http://localhost:3333`

3. Para visualizar os logs:
```bash
docker compose logs -f api
```

4. Para acessar o container da API:
```bash
docker compose exec api sh
```

5. Para parar os containers:
```bash
docker compose down
```

### Executando Localmente (sem Docker)

1. Inicie o banco de dados PostgreSQL (via Docker):
```bash
docker compose up db -d
```

2. Execute as migrations do Prisma:
```bash
npx prisma generate
npx prisma migrate deploy
```

3. Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento com hot reload
- `npm run build` - Gera o build de produção
- `npm start` - Inicia o servidor de produção
- `npm test` - Executa os testes unitários
- `npm run test:watch` - Executa os testes em modo watch
- `npm run test:e2e` - Executa os testes end-to-end
- `npm run test:e2e:watch` - Executa os testes E2E em modo watch
- `npm run test:coverage` - Gera relatório de cobertura de testes
- `npm run test:ui` - Abre interface visual do Vitest

## 🧪 Testes

O projeto possui cobertura de testes unitários e end-to-end utilizando Vitest.

### Executar testes unitários:
```bash
npm test
```

### Executar testes E2E:
```bash
npm run test:e2e
```

### Gerar relatório de cobertura:
```bash
npm run test:coverage
```

## 🗂️ Estrutura do Projeto

```
src/
├── @types/          # Definições de tipos TypeScript
├── env/             # Configuração e validação de variáveis de ambiente
├── http/            # Camada HTTP
│   ├── controllers/ # Controllers das rotas
│   └── middleware/  # Middlewares (autenticação, RBAC, etc.)
├── lib/             # Bibliotecas e configurações (Prisma, etc.)
├── repositories/    # Camada de acesso aos dados
├── use-cases/       # Regras de negócio da aplicação
├── utils/           # Funções utilitárias
├── app.ts           # Configuração do Fastify
└── server.ts        # Inicialização do servidor
```

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas:

1. Faça login através do endpoint de autenticação
2. Inclua o token retornado no header das requisições:
```
Authorization: Bearer {seu-token}
```

## 🔑 RBAC (Role-Based Access Control)

O sistema possui dois níveis de acesso:
- **MEMBER**: Usuário padrão (pode fazer check-ins, buscar academias)
- **ADMIN**: Administrador (pode cadastrar academias, validar check-ins)

## 📦 Docker

O projeto está totalmente containerizado com Docker:

- **db**: Container PostgreSQL 16
- **api**: Container da aplicação Node.js

### Portas
- API: `3333`
- PostgreSQL: `5435` (mapeado para 5432 internamente)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📄 Licença

Este projeto está sob a licença ISC.

## 👤 Autor

Desenvolvido por [MarcosHHOshiro](https://github.com/MarcosHHOshiro)

## 🔗 Links

- [Repositório](https://github.com/MarcosHHOshiro/Gym-pass-style-app-node)
- [Issues](https://github.com/MarcosHHOshiro/Gym-pass-style-app-node/issues)