# Desafio Técnico - Desenvolvedor Backend Sênior

## 📋 Visão Geral

Bem-vindo ao desafio técnico para a vaga de **Desenvolvedor Backend Sênior** na TreeUnfe!

Este desafio avalia suas habilidades em:
- Clean Architecture e Domain-Driven Design
- NestJS e TypeScript
- Padrões de projeto e boas práticas
- Testes unitários

- Modelagem de domínio

**Tempo estimado**: 2-3 horas

---

## 🎯 O Desafio

Implemente um **módulo de Tarefas (Tasks)** seguindo os padrões arquiteturais do projeto TreeUnfe.

### Contexto

O sistema precisa de um módulo para gerenciar tarefas internas de uma organização. Cada tarefa possui:
- Título e descrição
- Responsável (usuário)
- Status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- Prioridade (LOW, MEDIUM, HIGH, URGENT)
- Data de vencimento
- Organização à qual pertence

---

## 📋 Requisitos

### Endpoint 1: Criar Tarefa

**POST /api/v1/tasks**

**Regras de negócio:**
- Título obrigatório (máximo 200 caracteres)
- Data de vencimento deve ser futura
- Status inicial sempre PENDING
- Prioridade padrão é MEDIUM
- Deve pertencer a uma organização
- Deve ter um usuário responsável (assigneeId)

**Request:**
```json
{
  "title": "Implementar módulo de relatórios",
  "description": "Criar relatórios mensais de vendas",
  "assigneeId": "uuid-do-usuario",
  "priority": "HIGH",
  "dueDate": "2026-03-30T23:59:59Z"
}
```

**Response (201):**
```json
{
  "id": "uuid-da-tarefa",
  "title": "Implementar módulo de relatórios",
  "description": "Criar relatórios mensais de vendas",
  "status": "PENDING",
  "priority": "HIGH",
  "assigneeId": "uuid-do-usuario",
  "organizationId": "uuid-da-organizacao",
  "dueDate": "2026-03-30T23:59:59.000Z",
  "completedAt": null,
  "createdAt": "2026-03-23T10:00:00.000Z",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

---

### Endpoint 2: Mudar Status da Tarefa

**PATCH /api/v1/tasks/:id/status**

**Regras de negócio:**
- Deve validar se a tarefa existe
- Deve validar transições de status:
  - PENDING → IN_PROGRESS, CANCELLED
  - IN_PROGRESS → COMPLETED, CANCELLED
  - COMPLETED → não pode mudar (status final)
  - CANCELLED → não pode mudar (status final)
- Quando status = COMPLETED, deve preencher `completedAt` com a data atual
- Deve retornar erro se a transição for inválida

**Request:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Response (200):**
```json
{
  "id": "uuid-da-tarefa",
  "status": "IN_PROGRESS",
  "updatedAt": "2026-03-23T11:00:00.000Z"
}
```

**Response (400) - Transição inválida:**
```json
{
  "statusCode": 400,
  "message": "Cannot transition from COMPLETED to IN_PROGRESS"
}
```

**Response (404) - Tarefa não encontrada:**
```json
{
  "statusCode": 404,
  "message": "Task with ID uuid-da-tarefa not found"
}
```

---

## 🗄️ Modelo de Dados

A tarefa deve conter:

- **id**: UUID único
- **title**: String (máximo 200 caracteres)
- **description**: String opcional
- **status**: Enum (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- **priority**: Enum (LOW, MEDIUM, HIGH, URGENT)
- **assigneeId**: UUID do usuário responsável
- **organizationId**: UUID da organização
- **dueDate**: Data de vencimento
- **completedAt**: Data de conclusão (opcional, preenchida quando status = COMPLETED)
- **createdAt**: Data de criação
- **updatedAt**: Data de atualização

---

## 📝 O que será avaliado

### 1. Arquitetura e Padrões 
- Separação de responsabilidades (Domain, Application, Infrastructure, Presentation)
- Entidade rica com comportamentos de domínio
- Either pattern para tratamento de erros
- Validações de negócio adequadas
- Injeção de dependências

### 2. Qualidade de Código
- TypeScript sem uso de `any`
- Nomenclatura consistente
- Código limpo e legível
- Tratamento de erros apropriado

### 3. Testes 
- Testes da entidade (métodos de domínio)
- Testes de pelo menos 1 use case
- Cobertura de casos de sucesso e erro

---

## 📦 Entregáveis

1. **Código fonte** do módulo Task com os 2 endpoints funcionais
2. **Testes unitários** da entidade e de pelo menos 1 use case
3. **README.md** com instruções de como executar os testes

---

## 📤 Entrega

Envie o código fonte completo (ZIP ou link do repositório) para:
**Email**: a.scaloni@treeunfe.com.br

**Prazo**: 3 dias a partir do recebimento

---

## 🎓 Critérios de Avaliação

### Eliminatórios
- ❌ Uso de `any` no TypeScript
- ❌ Não implementar Either pattern
- ❌ Não implementar testes
- ❌ Endpoints não funcionais

### Diferenciais
- ✅ Documentação Swagger
- ✅ Validações robustas
- ✅ Código limpo e bem organizado
- ✅ Testes bem estruturados

---

## 🤝 Suporte

Se tiver dúvidas sobre o ambiente ou setup inicial, entre em contato:
- **Email**: a.scaloni@treeunfe.com.br
- **Prazo de resposta**: até 24h

---

## 🏆 Boa Sorte!

Estamos ansiosos para ver sua implementação. Este desafio reflete o dia a dia de desenvolvimento na TreeUnfe, onde valorizamos código limpo, arquitetura sólida e atenção aos detalhes.

---

**TreeUnfe** - Simplificando a emissão de notas fiscais eletrônicas no Brasil 🇧🇷
