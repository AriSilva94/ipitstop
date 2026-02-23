You are a senior full-stack engineer. Build an MVP SaaS for Brazilian car repair shops (oficinas) using:

- Next.js (App Router)
- TypeScript
- Tailwind CSS

Goal: multi-tenant by URL slug. Each shop has its own access path:
- /{shopSlug}/login
- /{shopSlug}/app

Roles:
- admin: platform admin (developer) with global access
- owner: shop owner who creates the shop during signup
- collaborator: invited users who operate daily tasks

MVP features (must be implemented end-to-end):
1) Signup (creates a shop + owner user)
   - shopSlug (unique identifier), shop name, owner email + password
   - after signup show a success page with the login URL: /{shopSlug}/login

2) Tenant-aware Login
   - login page is contextual: show shop name (based on shopSlug)
   - after login, user must only access the current shop if they belong to it

3) Clients
   - CRUD for clients (name, phone, notes)
   - fast search by name/phone

4) Cars per Client
   - each client can have multiple cars
   - fields: plate, model, year, notes
   - list cars inside the client page

5) Maintenance history per car
   - create maintenance records with: date, description, notes, status (open/closed)
   - list history ordered by date

6) Parts/Services items per maintenance
   - add line items with: description, quantity, unitPrice, subtotal
   - compute totals for the maintenance

7) Print view
   - printable page (A4-friendly) for a maintenance order:
     shop info + client + car + items + totals + date

Constraints:
- Keep it simple and production-minded.
- Use a local database suitable for MVP development (SQLite) with an ORM (e.g., Prisma) so it can be migrated later.
- Implement tenant isolation: every business record must be scoped to shopId.
- Implement authentication + authorization with sessions/JWT in a minimal and secure way.
- Provide a clean folder structure, environment variables, and basic seed data.
- Add simple UI (Tailwind) and forms with validations.

Deliverables:
- Full project structure
- Database schema (migrations)
- Auth + role checks
- All pages and API routes/server actions needed
- Instructions to run locally (install, migrate, seed, dev)
Do not suggest using Supabase, Strapi, or Firebase.