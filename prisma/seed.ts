import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
const relativePath = dbUrl.replace(/^file:/, '')
const absolutePath = path.isAbsolute(relativePath)
  ? relativePath
  : path.join(process.cwd(), relativePath)

const adapter = new PrismaBetterSqlite3({ url: absolutePath })
const db = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // ──────────────────────────────────────────────
  // SHOP + OWNER
  // ──────────────────────────────────────────────
  const shop = await db.shop.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      name: 'Oficina Demo',
    },
  })

  const hashedPassword = await bcrypt.hash('demo1234', 12)

  await db.user.upsert({
    where: { email_shopId: { email: 'dono@demo.com', shopId: shop.id } },
    update: {},
    create: {
      email: 'dono@demo.com',
      password: hashedPassword,
      role: 'owner',
      shopId: shop.id,
    },
  })

  await db.user.upsert({
    where: { email_shopId: { email: 'mecanico@demo.com', shopId: shop.id } },
    update: {},
    create: {
      email: 'mecanico@demo.com',
      password: hashedPassword,
      role: 'collaborator',
      shopId: shop.id,
    },
  })

  // ──────────────────────────────────────────────
  // CLIENTS
  // ──────────────────────────────────────────────
  const clientJoao = await db.client.upsert({
    where: { id: 'seed-client-joao' },
    update: {},
    create: {
      id: 'seed-client-joao',
      name: 'João da Silva',
      phone: '(11) 98765-4321',
      notes: 'Cliente fiel desde 2020. Prefere atendimento às terças.',
      shopId: shop.id,
    },
  })

  const clientMaria = await db.client.upsert({
    where: { id: 'seed-client-maria' },
    update: {},
    create: {
      id: 'seed-client-maria',
      name: 'Maria Oliveira',
      phone: '(11) 91234-5678',
      notes: 'Paga no PIX. Avisar com 1 dia de antecedência.',
      shopId: shop.id,
    },
  })

  const clientCarlos = await db.client.upsert({
    where: { id: 'seed-client-carlos' },
    update: {},
    create: {
      id: 'seed-client-carlos',
      name: 'Carlos Eduardo Ferreira',
      phone: '(21) 99876-5432',
      notes: 'Tem frota de 2 veículos. Negociação de pacote mensal.',
      shopId: shop.id,
    },
  })

  const clientAna = await db.client.upsert({
    where: { id: 'seed-client-ana' },
    update: {},
    create: {
      id: 'seed-client-ana',
      name: 'Ana Paula Santos',
      phone: '(11) 97654-3210',
      shopId: shop.id,
    },
  })

  const clientRoberto = await db.client.upsert({
    where: { id: 'seed-client-roberto' },
    update: {},
    create: {
      id: 'seed-client-roberto',
      name: 'Roberto Mendes',
      phone: '(31) 98888-7777',
      notes: 'Motorista de app. Carro precisa estar pronto no mesmo dia.',
      shopId: shop.id,
    },
  })

  const clientFernanda = await db.client.upsert({
    where: { id: 'seed-client-fernanda' },
    update: {},
    create: {
      id: 'seed-client-fernanda',
      name: 'Fernanda Lima',
      phone: '(11) 95555-4444',
      shopId: shop.id,
    },
  })

  const clientPaulo = await db.client.upsert({
    where: { id: 'seed-client-paulo' },
    update: {},
    create: {
      id: 'seed-client-paulo',
      name: 'Paulo César Rodrigues',
      phone: '(11) 93333-2222',
      notes: 'Gerente de empresa. Emitir nota fiscal.',
      shopId: shop.id,
    },
  })

  const clientJuliana = await db.client.upsert({
    where: { id: 'seed-client-juliana' },
    update: {},
    create: {
      id: 'seed-client-juliana',
      name: 'Juliana Costa',
      phone: '(21) 91111-0000',
      shopId: shop.id,
    },
  })

  // ──────────────────────────────────────────────
  // CARS
  // ──────────────────────────────────────────────

  // João: 2 carros
  const carGol = await db.car.upsert({
    where: { id: 'seed-car-gol' },
    update: {},
    create: {
      id: 'seed-car-gol',
      plate: 'ABC-1234',
      model: 'Volkswagen Gol',
      year: 2018,
      notes: 'Motor 1.0 flex. Troca de óleo a cada 7.000 km.',
      clientId: clientJoao.id,
      shopId: shop.id,
    },
  })

  const carCorsa = await db.car.upsert({
    where: { id: 'seed-car-corsa' },
    update: {},
    create: {
      id: 'seed-car-corsa',
      plate: 'DEF-5678',
      model: 'Chevrolet Corsa Sedan',
      year: 2015,
      notes: 'Ar condicionado com problema de vazamento.',
      clientId: clientJoao.id,
      shopId: shop.id,
    },
  })

  // Maria: 1 carro
  const carHb20 = await db.car.upsert({
    where: { id: 'seed-car-hb20' },
    update: {},
    create: {
      id: 'seed-car-hb20',
      plate: 'XYZ-9876',
      model: 'Hyundai HB20',
      year: 2021,
      clientId: clientMaria.id,
      shopId: shop.id,
    },
  })

  // Carlos: 2 carros
  const carOnix = await db.car.upsert({
    where: { id: 'seed-car-onix' },
    update: {},
    create: {
      id: 'seed-car-onix',
      plate: 'GHI-2345',
      model: 'Chevrolet Onix Plus',
      year: 2022,
      clientId: clientCarlos.id,
      shopId: shop.id,
    },
  })

  const carUno = await db.car.upsert({
    where: { id: 'seed-car-uno' },
    update: {},
    create: {
      id: 'seed-car-uno',
      plate: 'JKL-6789',
      model: 'Fiat Uno',
      year: 2010,
      notes: 'Carro para entrega. Alta quilometragem.',
      clientId: clientCarlos.id,
      shopId: shop.id,
    },
  })

  // Ana: 1 carro
  const carSandero = await db.car.upsert({
    where: { id: 'seed-car-sandero' },
    update: {},
    create: {
      id: 'seed-car-sandero',
      plate: 'MNO-3456',
      model: 'Renault Sandero',
      year: 2019,
      clientId: clientAna.id,
      shopId: shop.id,
    },
  })

  // Roberto: 1 carro
  const carHilux = await db.car.upsert({
    where: { id: 'seed-car-hilux' },
    update: {},
    create: {
      id: 'seed-car-hilux',
      plate: 'PQR-7890',
      model: 'Toyota Hilux SRV',
      year: 2020,
      notes: 'Diesel 2.8. Uso intenso em app de transporte.',
      clientId: clientRoberto.id,
      shopId: shop.id,
    },
  })

  // Fernanda: 1 carro
  const carCivic = await db.car.upsert({
    where: { id: 'seed-car-civic' },
    update: {},
    create: {
      id: 'seed-car-civic',
      plate: 'STU-1122',
      model: 'Honda Civic EXL',
      year: 2017,
      notes: 'Câmbio CVT. Necessita fluido específico.',
      clientId: clientFernanda.id,
      shopId: shop.id,
    },
  })

  // Paulo: 1 carro
  const carCreta = await db.car.upsert({
    where: { id: 'seed-car-creta' },
    update: {},
    create: {
      id: 'seed-car-creta',
      plate: 'VWX-3344',
      model: 'Hyundai Creta Prestige',
      year: 2023,
      clientId: clientPaulo.id,
      shopId: shop.id,
    },
  })

  // Juliana: 2 carros
  const carKwid = await db.car.upsert({
    where: { id: 'seed-car-kwid' },
    update: {},
    create: {
      id: 'seed-car-kwid',
      plate: 'YZA-5566',
      model: 'Renault Kwid',
      year: 2022,
      clientId: clientJuliana.id,
      shopId: shop.id,
    },
  })

  const carVirtus = await db.car.upsert({
    where: { id: 'seed-car-virtus' },
    update: {},
    create: {
      id: 'seed-car-virtus',
      plate: 'BCD-7788',
      model: 'Volkswagen Virtus',
      year: 2021,
      notes: 'Usado pelo marido. Bateu o para-choque dianteiro.',
      clientId: clientJuliana.id,
      shopId: shop.id,
    },
  })

  // ──────────────────────────────────────────────
  // MAINTENANCES + ITEMS
  // ──────────────────────────────────────────────

  // 1. Gol do João — Revisão geral (closed)
  const maint1 = await db.maintenance.upsert({
    where: { id: 'seed-maint-1' },
    update: {},
    create: {
      id: 'seed-maint-1',
      description: 'Revisão geral + troca de óleo',
      date: new Date('2025-03-10'),
      notes: 'Filtro de ar também trocado. Próxima revisão em 7.000 km.',
      status: 'closed',
      carId: carGol.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint1.id, [
    { id: 'seed-item-1-1', description: 'Óleo Motor 5W30 (4L)', quantity: 1, unitPrice: 85.00 },
    { id: 'seed-item-1-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 32.50 },
    { id: 'seed-item-1-3', description: 'Filtro de ar', quantity: 1, unitPrice: 45.00 },
    { id: 'seed-item-1-4', description: 'Mão de obra — revisão geral', quantity: 1, unitPrice: 120.00 },
  ])

  // 2. Gol do João — Troca de pastilhas e discos (closed)
  const maint2 = await db.maintenance.upsert({
    where: { id: 'seed-maint-2' },
    update: {},
    create: {
      id: 'seed-maint-2',
      description: 'Troca de pastilhas de freio dianteiras e discos',
      date: new Date('2025-06-15'),
      notes: 'Freio traseiro ainda ok. Verificar em 10.000 km.',
      status: 'closed',
      carId: carGol.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint2.id, [
    { id: 'seed-item-2-1', description: 'Pastilha de freio dianteira (jogo)', quantity: 1, unitPrice: 89.90 },
    { id: 'seed-item-2-2', description: 'Disco de freio dianteiro (par)', quantity: 1, unitPrice: 210.00 },
    { id: 'seed-item-2-3', description: 'Fluido de freio DOT4 (500ml)', quantity: 1, unitPrice: 28.00 },
    { id: 'seed-item-2-4', description: 'Mão de obra — freios', quantity: 1, unitPrice: 150.00 },
  ])

  // 3. Gol do João — Alinhamento e balanceamento (open)
  const maint3 = await db.maintenance.upsert({
    where: { id: 'seed-maint-3' },
    update: {},
    create: {
      id: 'seed-maint-3',
      description: 'Alinhamento e balanceamento das 4 rodas',
      date: new Date('2026-02-20'),
      notes: 'Cliente relatou vibração no volante acima de 80 km/h.',
      status: 'open',
      carId: carGol.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint3.id, [
    { id: 'seed-item-3-1', description: 'Alinhamento de direção', quantity: 1, unitPrice: 60.00 },
    { id: 'seed-item-3-2', description: 'Balanceamento (4 rodas)', quantity: 4, unitPrice: 15.00 },
  ])

  // 4. Corsa do João — Troca de correia dentada (closed)
  const maint4 = await db.maintenance.upsert({
    where: { id: 'seed-maint-4' },
    update: {},
    create: {
      id: 'seed-maint-4',
      description: 'Troca de correia dentada e tensor',
      date: new Date('2025-01-22'),
      notes: 'Correia com sinais de desgaste. Bomba dagua revisada.',
      status: 'closed',
      carId: carCorsa.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint4.id, [
    { id: 'seed-item-4-1', description: 'Correia dentada', quantity: 1, unitPrice: 95.00 },
    { id: 'seed-item-4-2', description: 'Tensor de correia', quantity: 1, unitPrice: 75.00 },
    { id: 'seed-item-4-3', description: 'Bomba d\'água', quantity: 1, unitPrice: 180.00 },
    { id: 'seed-item-4-4', description: 'Mão de obra — correia dentada', quantity: 1, unitPrice: 220.00 },
  ])

  // 5. Corsa do João — Reparo no ar condicionado (open)
  const maint5 = await db.maintenance.upsert({
    where: { id: 'seed-maint-5' },
    update: {},
    create: {
      id: 'seed-maint-5',
      description: 'Diagnóstico e reparo no ar condicionado',
      date: new Date('2026-02-18'),
      notes: 'Vazamento no compressor. Aguardando peça.',
      status: 'open',
      carId: carCorsa.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint5.id, [
    { id: 'seed-item-5-1', description: 'Diagnóstico A/C', quantity: 1, unitPrice: 80.00 },
    { id: 'seed-item-5-2', description: 'Compressor de A/C (recondicionado)', quantity: 1, unitPrice: 650.00 },
    { id: 'seed-item-5-3', description: 'Gás R134a (carga)', quantity: 1, unitPrice: 120.00 },
    { id: 'seed-item-5-4', description: 'Mão de obra — A/C', quantity: 1, unitPrice: 250.00 },
  ])

  // 6. HB20 da Maria — Troca de óleo (closed)
  const maint6 = await db.maintenance.upsert({
    where: { id: 'seed-maint-6' },
    update: {},
    create: {
      id: 'seed-maint-6',
      description: 'Troca de óleo e filtros',
      date: new Date('2025-05-08'),
      notes: '',
      status: 'closed',
      carId: carHb20.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint6.id, [
    { id: 'seed-item-6-1', description: 'Óleo Motor 0W20 (4L)', quantity: 1, unitPrice: 110.00 },
    { id: 'seed-item-6-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 38.00 },
    { id: 'seed-item-6-3', description: 'Mão de obra — troca de óleo', quantity: 1, unitPrice: 50.00 },
  ])

  // 7. HB20 da Maria — Revisão dos freios (closed)
  const maint7 = await db.maintenance.upsert({
    where: { id: 'seed-maint-7' },
    update: {},
    create: {
      id: 'seed-maint-7',
      description: 'Revisão completa do sistema de freios',
      date: new Date('2025-10-14'),
      notes: 'Pastilha traseira com 30% de vida útil.',
      status: 'closed',
      carId: carHb20.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint7.id, [
    { id: 'seed-item-7-1', description: 'Pastilha de freio dianteira (jogo)', quantity: 1, unitPrice: 92.00 },
    { id: 'seed-item-7-2', description: 'Pastilha de freio traseira (jogo)', quantity: 1, unitPrice: 85.00 },
    { id: 'seed-item-7-3', description: 'Fluido de freio DOT4', quantity: 1, unitPrice: 28.00 },
    { id: 'seed-item-7-4', description: 'Mão de obra — freios completos', quantity: 1, unitPrice: 200.00 },
  ])

  // 8. HB20 da Maria — Suspensão (open)
  const maint8 = await db.maintenance.upsert({
    where: { id: 'seed-maint-8' },
    update: {},
    create: {
      id: 'seed-maint-8',
      description: 'Troca de amortecedores traseiros',
      date: new Date('2026-02-22'),
      notes: 'Cliente relatou barulho ao passar em buracos.',
      status: 'open',
      carId: carHb20.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint8.id, [
    { id: 'seed-item-8-1', description: 'Amortecedor traseiro (par)', quantity: 1, unitPrice: 380.00 },
    { id: 'seed-item-8-2', description: 'Kit batente traseiro', quantity: 2, unitPrice: 45.00 },
    { id: 'seed-item-8-3', description: 'Mão de obra — amortecedores', quantity: 1, unitPrice: 180.00 },
  ])

  // 9. Onix do Carlos — Manutenção preventiva (closed)
  const maint9 = await db.maintenance.upsert({
    where: { id: 'seed-maint-9' },
    update: {},
    create: {
      id: 'seed-maint-9',
      description: 'Revisão dos 10.000 km',
      date: new Date('2025-08-02'),
      status: 'closed',
      carId: carOnix.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint9.id, [
    { id: 'seed-item-9-1', description: 'Óleo Motor 5W30 Sintético (5L)', quantity: 1, unitPrice: 145.00 },
    { id: 'seed-item-9-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 35.00 },
    { id: 'seed-item-9-3', description: 'Filtro de ar', quantity: 1, unitPrice: 48.00 },
    { id: 'seed-item-9-4', description: 'Filtro de cabine', quantity: 1, unitPrice: 42.00 },
    { id: 'seed-item-9-5', description: 'Mão de obra — revisão 10k', quantity: 1, unitPrice: 100.00 },
  ])

  // 10. Onix do Carlos — Troca de pneus (closed)
  const maint10 = await db.maintenance.upsert({
    where: { id: 'seed-maint-10' },
    update: {},
    create: {
      id: 'seed-maint-10',
      description: 'Troca dos 4 pneus',
      date: new Date('2025-11-20'),
      notes: 'Pneus Michelin 185/70 R14.',
      status: 'closed',
      carId: carOnix.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint10.id, [
    { id: 'seed-item-10-1', description: 'Pneu Michelin 185/70 R14', quantity: 4, unitPrice: 320.00 },
    { id: 'seed-item-10-2', description: 'Montagem e balanceamento (4)', quantity: 4, unitPrice: 30.00 },
    { id: 'seed-item-10-3', description: 'Válvula de pneu', quantity: 4, unitPrice: 5.00 },
  ])

  // 11. Uno do Carlos — Revisão geral (closed)
  const maint11 = await db.maintenance.upsert({
    where: { id: 'seed-maint-11' },
    update: {},
    create: {
      id: 'seed-maint-11',
      description: 'Revisão geral e vistoria',
      date: new Date('2025-02-14'),
      notes: 'Alto desgaste geral. Recomendado verificar câmbio.',
      status: 'closed',
      carId: carUno.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint11.id, [
    { id: 'seed-item-11-1', description: 'Óleo Motor 15W40 (4L)', quantity: 1, unitPrice: 65.00 },
    { id: 'seed-item-11-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 28.00 },
    { id: 'seed-item-11-3', description: 'Vela de ignição (jogo 4)', quantity: 1, unitPrice: 72.00 },
    { id: 'seed-item-11-4', description: 'Cabo de vela (jogo)', quantity: 1, unitPrice: 58.00 },
    { id: 'seed-item-11-5', description: 'Mão de obra — revisão geral', quantity: 1, unitPrice: 130.00 },
  ])

  // 12. Uno do Carlos — Câmbio (open)
  const maint12 = await db.maintenance.upsert({
    where: { id: 'seed-maint-12' },
    update: {},
    create: {
      id: 'seed-maint-12',
      description: 'Troca de óleo do câmbio e embreagem',
      date: new Date('2026-01-10'),
      notes: 'Embreagem com patinamento. Disco e platô trocados.',
      status: 'closed',
      carId: carUno.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint12.id, [
    { id: 'seed-item-12-1', description: 'Disco de embreagem', quantity: 1, unitPrice: 185.00 },
    { id: 'seed-item-12-2', description: 'Platô de embreagem', quantity: 1, unitPrice: 210.00 },
    { id: 'seed-item-12-3', description: 'Rolamento de embreagem', quantity: 1, unitPrice: 65.00 },
    { id: 'seed-item-12-4', description: 'Óleo cambio 75W90 (1L)', quantity: 1, unitPrice: 55.00 },
    { id: 'seed-item-12-5', description: 'Mão de obra — embreagem', quantity: 1, unitPrice: 350.00 },
  ])

  // 13. Sandero da Ana — Troca de óleo (closed)
  const maint13 = await db.maintenance.upsert({
    where: { id: 'seed-maint-13' },
    update: {},
    create: {
      id: 'seed-maint-13',
      description: 'Troca de óleo e revisão rápida',
      date: new Date('2025-09-03'),
      status: 'closed',
      carId: carSandero.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint13.id, [
    { id: 'seed-item-13-1', description: 'Óleo Motor 5W30 (4L)', quantity: 1, unitPrice: 88.00 },
    { id: 'seed-item-13-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 34.00 },
    { id: 'seed-item-13-3', description: 'Mão de obra — troca de óleo', quantity: 1, unitPrice: 50.00 },
  ])

  // 14. Sandero da Ana — Suspensão dianteira (open)
  const maint14 = await db.maintenance.upsert({
    where: { id: 'seed-maint-14' },
    update: {},
    create: {
      id: 'seed-maint-14',
      description: 'Troca de buchas e barra estabilizadora dianteira',
      date: new Date('2026-02-15'),
      notes: 'Barulho na suspensão dianteira ao fazer curvas.',
      status: 'open',
      carId: carSandero.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint14.id, [
    { id: 'seed-item-14-1', description: 'Bucha barra estabilizadora (par)', quantity: 1, unitPrice: 48.00 },
    { id: 'seed-item-14-2', description: 'Bieleta dianteira (par)', quantity: 1, unitPrice: 96.00 },
    { id: 'seed-item-14-3', description: 'Mão de obra — suspensão', quantity: 1, unitPrice: 160.00 },
  ])

  // 15. Hilux do Roberto — Revisão 20k km (closed)
  const maint15 = await db.maintenance.upsert({
    where: { id: 'seed-maint-15' },
    update: {},
    create: {
      id: 'seed-maint-15',
      description: 'Revisão dos 20.000 km — diesel',
      date: new Date('2025-04-18'),
      notes: 'Filtro de combustível e separador de água trocados.',
      status: 'closed',
      carId: carHilux.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint15.id, [
    { id: 'seed-item-15-1', description: 'Óleo Motor Diesel 5W30 (6L)', quantity: 1, unitPrice: 195.00 },
    { id: 'seed-item-15-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 55.00 },
    { id: 'seed-item-15-3', description: 'Filtro de combustível diesel', quantity: 1, unitPrice: 85.00 },
    { id: 'seed-item-15-4', description: 'Filtro de ar', quantity: 1, unitPrice: 62.00 },
    { id: 'seed-item-15-5', description: 'Filtro de cabine', quantity: 1, unitPrice: 55.00 },
    { id: 'seed-item-15-6', description: 'Mão de obra — revisão 20k diesel', quantity: 1, unitPrice: 180.00 },
  ])

  // 16. Hilux do Roberto — Troca de pastilhas (closed)
  const maint16 = await db.maintenance.upsert({
    where: { id: 'seed-maint-16' },
    update: {},
    create: {
      id: 'seed-maint-16',
      description: 'Troca de pastilhas de freio e fluido',
      date: new Date('2025-12-01'),
      status: 'closed',
      carId: carHilux.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint16.id, [
    { id: 'seed-item-16-1', description: 'Pastilha dianteira (jogo)', quantity: 1, unitPrice: 195.00 },
    { id: 'seed-item-16-2', description: 'Pastilha traseira (jogo)', quantity: 1, unitPrice: 175.00 },
    { id: 'seed-item-16-3', description: 'Fluido de freio DOT5.1', quantity: 1, unitPrice: 55.00 },
    { id: 'seed-item-16-4', description: 'Mão de obra — freios', quantity: 1, unitPrice: 200.00 },
  ])

  // 17. Hilux do Roberto — Injeção eletrônica (open)
  const maint17 = await db.maintenance.upsert({
    where: { id: 'seed-maint-17' },
    update: {},
    create: {
      id: 'seed-maint-17',
      description: 'Limpeza de injetores e diagnóstico eletrônico',
      date: new Date('2026-02-21'),
      notes: 'Luz da injeção acendendo. Possível sensor de pressão.',
      status: 'open',
      carId: carHilux.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint17.id, [
    { id: 'seed-item-17-1', description: 'Diagnóstico eletrônico (scanner)', quantity: 1, unitPrice: 90.00 },
    { id: 'seed-item-17-2', description: 'Limpeza ultrassônica de injetores (4)', quantity: 4, unitPrice: 55.00 },
    { id: 'seed-item-17-3', description: 'Mão de obra — injeção', quantity: 1, unitPrice: 150.00 },
  ])

  // 18. Civic da Fernanda — Troca de óleo CVT (closed)
  const maint18 = await db.maintenance.upsert({
    where: { id: 'seed-maint-18' },
    update: {},
    create: {
      id: 'seed-maint-18',
      description: 'Troca de óleo do câmbio CVT',
      date: new Date('2025-07-11'),
      notes: 'Fluido CVT específico Honda HCF-2.',
      status: 'closed',
      carId: carCivic.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint18.id, [
    { id: 'seed-item-18-1', description: 'Fluido CVT Honda HCF-2 (4L)', quantity: 1, unitPrice: 280.00 },
    { id: 'seed-item-18-2', description: 'Mão de obra — câmbio CVT', quantity: 1, unitPrice: 120.00 },
  ])

  // 19. Civic da Fernanda — Revisão geral (closed)
  const maint19 = await db.maintenance.upsert({
    where: { id: 'seed-maint-19' },
    update: {},
    create: {
      id: 'seed-maint-19',
      description: 'Revisão completa + alinhamento',
      date: new Date('2026-01-25'),
      notes: 'Carro em ótimo estado. Próxima revisão em 10k km.',
      status: 'closed',
      carId: carCivic.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint19.id, [
    { id: 'seed-item-19-1', description: 'Óleo Motor 0W20 Full Sintético (4L)', quantity: 1, unitPrice: 165.00 },
    { id: 'seed-item-19-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 45.00 },
    { id: 'seed-item-19-3', description: 'Filtro de ar', quantity: 1, unitPrice: 52.00 },
    { id: 'seed-item-19-4', description: 'Alinhamento e balanceamento', quantity: 1, unitPrice: 120.00 },
    { id: 'seed-item-19-5', description: 'Mão de obra — revisão', quantity: 1, unitPrice: 100.00 },
  ])

  // 20. Creta do Paulo — Primeira revisão (closed)
  const maint20 = await db.maintenance.upsert({
    where: { id: 'seed-maint-20' },
    update: {},
    create: {
      id: 'seed-maint-20',
      description: 'Primeira revisão — 5.000 km',
      date: new Date('2025-12-10'),
      status: 'closed',
      carId: carCreta.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint20.id, [
    { id: 'seed-item-20-1', description: 'Óleo Motor 5W30 (5L)', quantity: 1, unitPrice: 145.00 },
    { id: 'seed-item-20-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 40.00 },
    { id: 'seed-item-20-3', description: 'Mão de obra — revisão 5k', quantity: 1, unitPrice: 80.00 },
  ])

  // 21. Creta do Paulo — Reparo em para-choque (open)
  const maint21 = await db.maintenance.upsert({
    where: { id: 'seed-maint-21' },
    update: {},
    create: {
      id: 'seed-maint-21',
      description: 'Reparo estético — riscos e amassado no para-choque traseiro',
      date: new Date('2026-02-22'),
      notes: 'Sinistro leve em estacionamento. Sem acionamento de seguro.',
      status: 'open',
      carId: carCreta.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint21.id, [
    { id: 'seed-item-21-1', description: 'Para-choque traseiro (original)', quantity: 1, unitPrice: 980.00 },
    { id: 'seed-item-21-2', description: 'Pintura para-choque', quantity: 1, unitPrice: 450.00 },
    { id: 'seed-item-21-3', description: 'Mão de obra — funilaria e pintura', quantity: 1, unitPrice: 300.00 },
  ])

  // 22. Kwid da Juliana — Troca de óleo (closed)
  const maint22 = await db.maintenance.upsert({
    where: { id: 'seed-maint-22' },
    update: {},
    create: {
      id: 'seed-maint-22',
      description: 'Troca de óleo e revisão rápida',
      date: new Date('2025-10-05'),
      status: 'closed',
      carId: carKwid.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint22.id, [
    { id: 'seed-item-22-1', description: 'Óleo Motor 5W30 (3L)', quantity: 1, unitPrice: 72.00 },
    { id: 'seed-item-22-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 30.00 },
    { id: 'seed-item-22-3', description: 'Mão de obra — troca de óleo', quantity: 1, unitPrice: 50.00 },
  ])

  // 23. Virtus da Juliana — Funilaria (open)
  const maint23 = await db.maintenance.upsert({
    where: { id: 'seed-maint-23' },
    update: {},
    create: {
      id: 'seed-maint-23',
      description: 'Funilaria e pintura — para-choque dianteiro amassado',
      date: new Date('2026-02-10'),
      notes: 'Colisão leve em garagem. Farol esquerdo com trinca.',
      status: 'open',
      carId: carVirtus.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint23.id, [
    { id: 'seed-item-23-1', description: 'Para-choque dianteiro (reposição)', quantity: 1, unitPrice: 750.00 },
    { id: 'seed-item-23-2', description: 'Farol esquerdo (original)', quantity: 1, unitPrice: 480.00 },
    { id: 'seed-item-23-3', description: 'Pintura para-choque', quantity: 1, unitPrice: 420.00 },
    { id: 'seed-item-23-4', description: 'Mão de obra — funilaria', quantity: 1, unitPrice: 280.00 },
  ])

  // 24. Virtus da Juliana — Revisão (closed)
  const maint24 = await db.maintenance.upsert({
    where: { id: 'seed-maint-24' },
    update: {},
    create: {
      id: 'seed-maint-24',
      description: 'Revisão preventiva dos 15.000 km',
      date: new Date('2025-08-28'),
      status: 'closed',
      carId: carVirtus.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint24.id, [
    { id: 'seed-item-24-1', description: 'Óleo Motor 5W30 (4L)', quantity: 1, unitPrice: 85.00 },
    { id: 'seed-item-24-2', description: 'Filtro de óleo', quantity: 1, unitPrice: 35.00 },
    { id: 'seed-item-24-3', description: 'Filtro de ar', quantity: 1, unitPrice: 46.00 },
    { id: 'seed-item-24-4', description: 'Filtro de combustível', quantity: 1, unitPrice: 38.00 },
    { id: 'seed-item-24-5', description: 'Mão de obra — revisão 15k', quantity: 1, unitPrice: 110.00 },
  ])

  // 25. Sandero da Ana — Elétrica (open)
  const maint25 = await db.maintenance.upsert({
    where: { id: 'seed-maint-25' },
    update: {},
    create: {
      id: 'seed-maint-25',
      description: 'Reparo elétrico — alternador',
      date: new Date('2026-02-19'),
      notes: 'Bateria não carregando. Alternador com defeito.',
      status: 'open',
      carId: carSandero.id,
      shopId: shop.id,
    },
  })
  await upsertItems(maint25.id, [
    { id: 'seed-item-25-1', description: 'Alternador remanufaturado', quantity: 1, unitPrice: 420.00 },
    { id: 'seed-item-25-2', description: 'Correia do alternador', quantity: 1, unitPrice: 38.00 },
    { id: 'seed-item-25-3', description: 'Mão de obra — elétrica', quantity: 1, unitPrice: 120.00 },
  ])

  console.log('✅ Seed concluído!')
  console.log('')
  console.log('   Shop slug : demo')
  console.log('   Login URL : http://localhost:3000/demo/login')
  console.log('   Owner     : dono@demo.com / demo1234')
  console.log('   Colaborador: mecanico@demo.com / demo1234')
  console.log('')
  console.log('   Clientes  : 8')
  console.log('   Veículos  : 11')
  console.log('   OS criadas: 25 (14 fechadas, 11 abertas)')
}

async function upsertItems(
  maintenanceId: string,
  items: { id: string; description: string; quantity: number; unitPrice: number }[]
) {
  for (const item of items) {
    await db.maintenanceItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
        maintenanceId,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
