# Módulo Tasks (desafio TreeUnfe)

API NestJS com **Clean Architecture** (domínio, aplicação, infraestrutura, apresentação), **Either** para erros de negócio e persistência **SQLite** via TypeORM.

## Pré-requisitos

- Node.js 18+
- npm

## Instalação

```bash
npm install
```

## Executar a API

```bash
npm run start:dev
```

- Base URL: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/docs`
- Contexto de organização: envie o header **`x-organization-id`** com um UUID válido em todas as requisições aos endpoints de tarefas.

### Exemplo: criar tarefa

```bash
curl -s -X POST http://localhost:3000/api/v1/tasks ^
  -H "Content-Type: application/json" ^
  -H "x-organization-id: 22222222-2222-4222-8222-222222222222" ^
  -d "{\"title\":\"Minha tarefa\",\"assigneeId\":\"11111111-1111-4111-8111-111111111111\",\"dueDate\":\"2027-01-01T00:00:00.000Z\",\"priority\":\"HIGH\"}"
```

(PowerShell: use `` ` `` em vez de `^` para continuação de linha, ou um único JSON em uma linha.)

## Testes unitários

```bash
npm test
```

Cobertura opcional:

```bash
npm run test:cov
```

## Build de produção

```bash
npm run build
npm run start:prod
```

O banco SQLite é criado em `data/tasks.sqlite` (pasta `data/` gerada na subida da aplicação).
