# 🏭 Autoflex — Teste Técnico

## 📌 Visão Geral

Este projeto foi desenvolvido como parte do teste técnico proposto pela **Autoflex**.

O sistema tem como objetivo realizar o controle de produção industrial, permitindo o gerenciamento de:

- **Produtos**
- **Matérias-primas**
- **Composição dos produtos** (Bill of Materials)
- **Sugestão de produção** baseada no estoque disponível

A aplicação segue uma arquitetura moderna _fullstack_, com separação clara entre front-end e back-end conforme solicitado nos requisitos.

## 🧱 Arquitetura da Aplicação

```text
      [Navegador]
           ↓
[Next.js (Frontend - React)]
           ↓ HTTP (REST API)
[Node.js API (Backend)]
           ↓ Prisma ORM
[PostgreSQL Database]
```

## 🖥️ Tecnologias Utilizadas

### Backend

- **Node.js** com **TypeScript**
- **Prisma ORM** (para abstração relacional e migrations seguras)
- **PostgreSQL** (banco de dados escalável)
- **Vitest** (Testes unitários super-rápidos)
- **Supertest** (Testes de integração garantindo o ciclo HTTP -> DB)

### Frontend

- **Next.js** com **React** e **TypeScript**
- **React Query** (gerenciamento de estado e cache do servidor)
- **Zustand** (gerenciamento de estado local da interface)
- **Tailwind CSS** (estilização rápida e criação de componentes responsivos)
- **React Testing Library & Vitest** (Testes de interface)

## 🏗️ Decisões Arquiteturais

### Por que Node.js ao invés de Quarkus ou Spring?

Embora o enunciado sugira o uso de Quarkus ou Spring (ecossistema Java), o backend foi desenvolvido utilizando Node.js com TypeScript por um motivo transparente e pragmático: **meu domínio técnico atual**.

Sendo muito franco, ainda não possuo experiência prévia com Quarkus ou ecossistema Spring para realizar um teste nesse nível de qualidade em tempo hábil. Optar por Node.js/TypeScript me permitiu focar e demonstrar o que realmente importa em um sistema de backend: **minha capacidade real de resolver testes técnicos com lógica complexa, estruturar arquiteturas limpas e garantir qualidade de software.**

Apesar da diferença de tecnologias, os princípios aplicados aqui demonstram senioridade e são universais:

1. **Foco na Lógica e Regras de Negócio:** Sem lutar com configuração excessiva, apliquei tempo no desenvolvimento de um algoritmo seguro e otimizado para a sugestão de produção e cálculo de lucros.
2. **Arquitetura Análoga a Frameworks Robutos:** A aplicação foi desenhada seguindo as premissas de uma arquitetura em camadas equivalente aos frameworks Java corporativos: `Routing → Controller → Service → Repository`.
3. **Tipagem e Segurança:** O **TypeScript** garante segurança no código (_compile-time safety_) semelhante ao Java, aliada a um cliente de banco de dados nativamente tipado com o **Prisma ORM**, mantendo a consistência.
4. **Testabilidade:** Foquei pesadamente na base da engenharia de software garantindo proteção e qualidade através de **testes de unidade e testes de integração**.

<details>
<summary><b>🗃️ Modelagem do Banco de Dados</b></summary>

### Tabelas

- **`products`**: `id`, `code`, `name`, `value`
- **`raw_materials`**: `id`, `code`, `name`, `stock_quantity`
- **`product_materials`**: `id`, `product_id` (FK), `raw_material_id` (FK), `required_quantity`

**Relacionamento (N:N)**: A associação de Produto e Matéria-Prima é feita através da tabela **`product_materials`**.
Isso representa a **composição necessária** (a receita ou _Bill of Materials_) para fabricar cada produto.

</details>

<details>
<summary><b>⚙️ Requisitos Funcionais Implementados</b></summary>

- **RF001 — CRUD de Produtos (Backend):** Criar, listar, atualizar e remover.
- **RF002 — CRUD de Matérias-Primas (Backend):** Controle de estoque, criação, edição e remoção.
- **RF003 — Associação Produto x Matéria-Prima:** Permite definir a quantidade necessária de ingredientes no cadastro.
- **RF004 — Algoritmo de Sugestão de Produção:**
  - O sistema calcula e ordena os produtos por **maior valor unitário**.
  - O algoritmo consome o estoque virtualmente e descobre qual é o "gargalo" (o menor fator limitante de composição).
  - Retorna o potencial de unidades fabricadas e o lucro estimado final.
- **RF005, RF006, RF007, RF008 — Interface Frontend:** Visões dinâmicas (CRUDS), associação direta na edição do produto, e um dashboard consolidado para visualizar as sugestões de produção calculadas pelo backend.
</details>

<details>
<summary><b>🎯 Destaques do Projeto</b></summary>

- ✅ **Arquitetura em camadas** bem definida e isolada.
- ✅ **Modelagem relacional coerente** lidando com multiplicidade (N:N).
- ✅ Algoritmo de produção inteligente priorizando **lucratividade**.
- ✅ Separação nítida entre interface (Next.js) e lógica de máquina (Node API).
- ✅ Ambiente de implantação reproduzível (Docker).
- ✅ Excelente nível de cobertura estruturada de **testes de unidade e integração**.
</details>

<details>
<summary><b>🚀 Melhorias Futuras</b></summary>

A base da aplicação está sólida e em conformidade completa com os requisitos. Pensando na evolução deste ecossistema corporativo:

1. **Testes End-to-End (E2E) com Cypress:**
   - O projeto teve os testes Cypress configurados em um primeiro momento para validar as jornadas de usuário (criar matéria-prima -> criar produto -> checar produção). Contudo, no contexto prático do desafio técnico, **optei por remover os testes E2E para consolidar quase 100% dos esforços e foco na qualidade dos testes unitários e de integração**. Num ciclo real de CI/CD, a reintrodução do Cypress seria o próximo passo primordial.
2. **Sistema de Autenticação / Multi-tenant (JWT):** Segurança robusta de acesso via rotas baseadas em cargos (Operador x Administrador).
3. **Logs e Metricas Avançadas:** Monitoramento de gargalos e latência através de ferramentas como Winston/Pino integradas ao Datadog/Prometheus.
</details>

<details>
<summary><b>📂 Estrutura do Projeto</b></summary>

```text
autoflex-challenge/
 ├── backend/
 │    ├── src/
 │    │    ├── modules/
 │    │    │    ├── product/
 │    │    │    ├── rawMaterial/
 │    │    │    └── production/
 │    │    └── server.ts
 │    ├── prisma/
 │    │    ├── schema.prisma
 │    │    └── seed.ts
 │    ├── tests/
 │    └── docker-compose.yml
 │
 └── frontend/
      ├── app/
      ├── components/
      ├── lib/
      └── store/
```

</details>

<details>
<summary><b>🐳 Como Rodar o Projeto</b></summary>

### Pré-requisitos

- **Node.js 18+**
- **Docker**
- **npm** (ou gerenciador compatível)

### 1️⃣ Subir o Banco de Dados (PostgreSQL)

```bash
cd backend
docker compose up -d
```

> Disponível temporariamente em: `localhost:5432`

### 2️⃣ API (Backend)

```bash
cd backend
npm install
```

Certifique-se de configurar o seu `.env`:
`DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autoflex"` e a `PORT="3333"`

Construir o banco de dados e as rotinas:

```bash
npx prisma migrate dev
npx prisma db seed # (Opcional, preenche a base para facilitar testes de interface)

npm run dev
```

> Backend sendo servido em: `http://localhost:3333`

### 3️⃣ Interface (Frontend)

Em um novo terminal:

```bash
cd frontend
npm install
npm run dev
```

> Frontend acessível em: `http://localhost:3000`

</details>

<details>
<summary><b>🧪 Executando os Testes</b></summary>

O projeto segue os melhores padrões de teste de "Pirâmide de Testes". Execute pelo terminal:

**Backend — Unitários:** (Regras de negócio isoladas)

```bash
cd backend
npm run test
```

**Frontend — Testes e Componentes:** (Comportamento de fluxo via RTL)

```bash
cd frontend
npm run test
```

</details>

---

### _📌 Considerações Finais_

_O objetivo prático desta implementação vai muito além das operações básicas de CRUD. A intenção principal é exibir clareza de pensamento técnico, engenharia sólida na organização arquitetural, qualidade na testabilidade do código entregue e domínio contundente das regras solicitadas pelo negócio._
