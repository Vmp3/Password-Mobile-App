# Backend do Password-Mobile-App

Este é o backend da aplicação Password-Mobile-App, desenvolvido em Go.

## Tecnologias Utilizadas

- Go (Golang)
- Gin (Framework Web)
- GORM (ORM)
- PostgreSQL (Banco de Dados)
- JWT (Autenticação)
- Docker (Containerização)

## Configuração do Ambiente

### Opção 1: Instalação Local

1. Instale o Go: https://golang.org/dl/
2. Instale o PostgreSQL: https://www.postgresql.org/download/
3. Clone este repositório

#### Configuração do Banco de Dados

1. Crie um banco de dados PostgreSQL:
```sql
CREATE DATABASE password_app;
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto backend com o seguinte conteúdo:
```
# Configurações do Servidor
PORT=8080

# Configurações do Banco de Dados
DATABASE_URL=host=localhost user=postgres password=postgres dbname=password_app port=5432 sslmode=disable

# Configurações de JWT
JWT_SECRET=seu_segredo_jwt_aqui
JWT_EXPIRY=24h
```

#### Executando o Projeto Localmente

1. Instale as dependências:
```bash
go mod download
```

2. Execute o servidor:
```bash
go run main.go
```

O servidor estará disponível em: http://localhost:8080

### Opção 2: Usando Docker

1. Certifique-se de ter o Docker e o Docker Compose instalados.

2. Execute o comando abaixo na raiz do projeto (onde está o arquivo docker-compose.yml):
```bash
docker-compose up -d
```

Isso iniciará tanto o banco de dados PostgreSQL quanto o backend da aplicação.

O servidor estará disponível em: http://localhost:8080
O PostgreSQL estará disponível em: localhost:5432

Para parar os containers:
```bash
docker-compose down
```

## Endpoints da API

### Autenticação

#### Cadastro de Usuário
- **URL**: `/api/auth/signup`
- **Método**: `POST`
- **Corpo da Requisição**:
```json
{
    "nome": "Nome do Usuário",
    "dataNascimento": "1990-01-01T00:00:00Z",
    "email": "usuario@exemplo.com",
    "senha": "senha123"
}
```
- **Resposta de Sucesso**:
```json
{
    "token": "jwt_token_aqui",
    "user": {
        "id": 1,
        "nome": "Nome do Usuário",
        "dataNascimento": "1990-01-01T00:00:00Z",
        "email": "usuario@exemplo.com"
    }
}
``` 