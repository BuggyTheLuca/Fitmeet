# Activities with Friends - Backend

## Descrição
Backend da aplicação Activities with Friends, desenvolvida para gerenciar atividades e interações entre amigos.

## Tecnologias Utilizadas
- Node.js
- TypeScript
- Prisma (ORM)
- PostgreSQL
- AWS S3 (via LocalStack para desenvolvimento)
- Docker

## Estrutura do Projeto
```
backend/
├── src/              # Código fonte
├── prisma/           # Configurações e schemas do Prisma
├── .env              # Variáveis de ambiente
└── Dockerfile        # Configuração do container Docker
```

## Configuração do Ambiente

### Pré-requisitos
- Docker
- Docker Compose
- Node.js (para desenvolvimento local)

### Executando com Docker no diretório raiz do repositório
```bash
# Iniciar todos os serviços
docker-compose up

# Parar todos os serviços
docker-compose down
```

## Serviços
O projeto utiliza os seguintes serviços Docker:
- PostgreSQL (porta 5432)
- LocalStack (porta 4566) - Simula serviços AWS
- Backend (porta 3000)

## Banco de Dados
O projeto utiliza PostgreSQL com Prisma como ORM. As principais entidades são:
- Users
- Activities
- ActivityTypes
- Achievements
- Preferences
- ActivityParticipants

## Armazenamento
O projeto utiliza o LocalStack para simular o serviço S3 da AWS em ambiente de desenvolvimento, com os seguintes buckets:
- user-avatars
- activity-images
- activity-type-images

## Desenvolvimento Local
Para desenvolvimento local sem Docker:
```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run dev
```

## Scripts Disponíveis
- `npm run build`: Compila o projeto
- `npm start`: Inicia o servidor em produção
- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run prisma:generate`: Gera o cliente Prisma
- `npm run prisma:migrate`: Executa as migrações do banco de dados