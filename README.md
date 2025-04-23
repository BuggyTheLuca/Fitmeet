# Luca Vidigal Santana 

## Activities with Friends

### Descrição
Activities with Friends é uma aplicação multiplataforma desenvolvida para facilitar a organização e participação em atividades entre amigos. A plataforma permite que usuários criem, gerenciem e participem de diferentes tipos de atividades, com recursos para compartilhamento de imagens, conquistas e preferências.

### Funcionalidades Principais
- Cadastro e autenticação de usuários
- Criação e gerenciamento de atividades
- Sistema de conquistas
- Upload e gerenciamento de imagens
- Preferências de tipos de atividades
- Sistema de participação em atividades

### Tecnologias
- **Backend**: Node.js com TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Armazenamento**: AWS S3 (simulado com LocalStack em desenvolvimento)
- **Containerização**: Docker
- **Frontend**: A ser feito
- **Mobile**: A ser feito

### Estrutura do Projeto
```
.
├── backend/           # API REST em Node.js
│   ├── src/          # Código fonte
│   ├── prisma/       # Configurações do Prisma
│   └── Dockerfile    # Configuração do container
├── frontend/         # Interface web (a ser feito)
├── mobile/          # Aplicativo mobile (a ser feito)
└── docker-compose.yml # Configuração dos serviços
```

### Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/Luca-Vidigal-Santana.git
cd Luca-Vidigal-Santana
```

2. Inicie os serviços com Docker:
```bash
docker-compose up
```

3. Acesse os serviços:
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432
- LocalStack: http://localhost:4566

### Documentação Detalhada
Para mais informações sobre o projeto Activities with Friends, consulte:
- [Documentação do Backend](./backend/README.md)

### Status do Projeto
- Backend: Em desenvolvimento
- Frontend: A ser feito
- Mobile: A ser feito


*Outros projetos serão adicionados a este repositório em breve.*