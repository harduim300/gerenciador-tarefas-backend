# Sistema de Gerenciamento de Tarefas

## Descrição
Sistema de gerenciamento de tarefas com funcionalidades de compartilhamento entre usuários, desenvolvido com Node.js, Express, TypeScript e Prisma.

## Funcionalidades

### Autenticação
- Login com email e senha
- Autenticação via JWT em cookie httpOnly
- Proteção de rotas
- Validação de sessão

### Gerenciamento de Tarefas
- Criação de tarefas com:
  - Título
  - Categoria
  - Descrição (opcional)
  - Status (NOT_STARTED, IN_PROGRESS, COMPLETED)
- Listagem de tarefas
- Busca de tarefa por ID
- Atualização de tarefas
- Exclusão de tarefas
- Compartilhamento de tarefas com outros usuários

### Sistema de Permissões
- OWNER: Proprietário da tarefa
  - Pode editar, deletar e compartilhar a tarefa
- USER: Usuário com acesso compartilhado
  - Pode visualizar e editar a tarefa

### Validações
- Validação de dados com Zod
- Validação de status permitidos
- Validação de emails
- Verificação de permissões
- Proteção contra acessos não autorizados

## Tecnologias Utilizadas
- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Zod (Validação)
- JWT (Autenticação)
- Argon2 (Hash de senhas)

## Estrutura do Projeto
```
src/
  ├── components/
  │   ├── Auth/
  │   │   ├── controller/
  │   │   └── service/
  │   └── Tasks/
  │       ├── controller/
  │       └── service/
  ├── middleware/
  ├── routes/
  ├── schemas/
  ├── types/
  └── libs/
```

## Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="seu-secret-aqui"
```

4. Execute as migrações do Prisma
```bash
npx prisma migrate dev
```

5. Inicie o servidor
```bash
npm run dev
```

## Rotas da API

### Autenticação
- `POST /auth/signin` - Login
- `POST /auth/logout` - Logout
- `GET /auth/validate` - Validação de sessão

### Tarefas
- `POST /tasks` - Criar tarefa
- `GET /tasks` - Listar tarefas
- `GET /tasks/:id` - Buscar tarefa por ID
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `POST /tasks/:id/share` - Compartilhar tarefa

## Exemplos de Uso

### Criar Tarefa
```json
POST /tasks
{
  "title": "Implementar API",
  "category": "Desenvolvimento",
  "description": "Criar endpoints da API REST",
  "status": "NOT_STARTED"
}
```

### Compartilhar Tarefa
```json
POST /tasks/:id/share
{
  "targetEmail": "usuario@email.com"
}
```

## Segurança
- Senhas hasheadas com Argon2
- Autenticação via JWT em cookie httpOnly
- Proteção contra CSRF
- Validação de dados com Zod
- Verificação de permissões em todas as operações



