# iPitStop

SaaS MVP para oficinas mecânicas brasileiras. Multi-tenant por URL slug.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma v7 + SQLite (via better-sqlite3)
- JWT (jose) + bcryptjs

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Rodar migrações (cria o banco SQLite)
npx prisma migrate dev --name init

# 3. Popular o banco com dados de exemplo
npx prisma db seed

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse em: <http://localhost:3000>

## Acesso de demonstração

Após o seed, acesse a oficina demo:

- **URL de login:** <http://localhost:3000/demo/login>
- **E-mail:** `dono@demo.com`
- **Senha:** `demo1234`

## Criar nova oficina

Acesse <http://localhost:3000/signup> para cadastrar uma nova oficina.

## Estrutura de rotas

| Rota | Descrição |
| ---- | --------- |
| `/signup` | Cadastrar nova oficina |
| `/{slug}/login` | Login contextual da oficina |
| `/{slug}/app` | Dashboard |
| `/{slug}/app/clients` | Lista de clientes |
| `/{slug}/app/clients/new` | Novo cliente |
| `/{slug}/app/clients/:id` | Detalhe do cliente + veículos |
| `/{slug}/app/clients/:id/cars/new` | Adicionar veículo |
| `/{slug}/app/clients/:id/cars/:carId` | Veículo + histórico de OS |
| `/{slug}/app/clients/:id/cars/:carId/maintenance/new` | Nova OS |
| `/{slug}/app/clients/:id/cars/:carId/maintenance/:mId` | OS + itens |
| `/{slug}/app/clients/:id/cars/:carId/maintenance/:mId/print` | Impressão A4 |

## Variáveis de ambiente (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="troque-em-producao"
```

## Roles

- `admin` — acesso global à plataforma
- `owner` — dono da oficina (criado no signup)
- `collaborator` — usuário convidado (futuro)
