import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '../../../../../../../../../../lib/db'
import PrintButtons from './PrintButtons'

type Props = { params: Promise<{ shopSlug: string; clientId: string; carId: string; maintenanceId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shopSlug, carId, maintenanceId } = await params

  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) return { title: 'Impressao de Ordem de Servico' }

  const maintenance = await db.maintenance.findFirst({
    where: { id: maintenanceId, shopId: shop.id, carId },
    select: { description: true },
  })

  if (!maintenance) return { title: 'Impressao de Ordem de Servico' }

  return { title: `OS - ${maintenance.description}` }
}

export default async function PrintPage({ params }: Props) {
  const { shopSlug, carId, maintenanceId } = await params
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) notFound()

  const maintenance = await db.maintenance.findFirst({
    where: { id: maintenanceId, shopId: shop.id, carId },
    include: {
      car: { include: { client: true } },
      items: true,
    },
  })
  if (!maintenance) notFound()

  const total = maintenance.items.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <>
      <style>{`
          .app-shell {
            display: block !important;
            background: #e5e7eb !important;
            min-height: 100vh;
          }

          .app-sidebar {
            display: none !important;
          }

          .app-content {
            background: transparent !important;
            overflow: visible !important;
          }

          .os-print-root {
            color: #111827;
            font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
            padding: 24px;
          }

          .os-print-page {
            width: min(210mm, 100%);
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #d1d5db;
            box-shadow: 0 20px 35px -24px rgba(0, 0, 0, 0.35);
            padding: 16mm;
          }

          .os-header {
            border-bottom: 2px solid #111827;
            padding-bottom: 10px;
            margin-bottom: 14px;
          }

          .os-shop-name {
            font-size: 30px;
            line-height: 1.1;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #020617;
          }

          .os-shop-meta {
            font-size: 12px;
            margin-top: 4px;
            color: #334155;
          }

          .os-section {
            margin-bottom: 14px;
          }

          .os-title {
            font-size: 23px;
            font-weight: 800;
            color: #020617;
          }

          .os-subtitle {
            font-size: 13px;
            color: #374151;
            margin-top: 2px;
          }

          .os-head-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
          }

          .os-meta {
            text-align: right;
            font-size: 11px;
            color: #1f2937;
            line-height: 1.45;
          }

          .os-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.04em;
          }

          .os-badge-open {
            border: 1px solid #92400e;
            background: #fef3c7;
            color: #78350f;
          }

          .os-badge-closed {
            border: 1px solid #065f46;
            background: #d1fae5;
            color: #064e3b;
          }

          .os-section-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #334155;
            border-bottom: 1px solid #9ca3af;
            padding-bottom: 4px;
            margin-bottom: 8px;
          }

          .os-row {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
          }

          .os-field {
            min-width: 140px;
          }

          .os-field-label {
            font-size: 10px;
            color: #6b7280;
            display: block;
            margin-bottom: 1px;
          }

          .os-field-value {
            font-size: 13px;
            font-weight: 600;
            color: #111827;
          }

          .os-notes {
            font-size: 13px;
            color: #1f2937;
            font-style: italic;
          }

          .os-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }

          .os-table th {
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            color: #334155;
            border-bottom: 1px solid #9ca3af;
            padding: 6px 4px;
            letter-spacing: 0.04em;
          }

          .os-table td {
            font-size: 13px;
            color: #111827;
            padding: 7px 4px;
            border-bottom: 1px solid #d1d5db;
          }

          .os-text-right {
            text-align: right;
          }

          .os-total-row td {
            font-size: 14px;
            font-weight: 800;
            border-top: 2px solid #111827;
            border-bottom: none;
            padding-top: 10px;
          }

          .os-signatures {
            margin-top: 34px;
            display: flex;
            gap: 34px;
          }

          .os-signature {
            flex: 1;
            border-top: 1px solid #374151;
            text-align: center;
            font-size: 11px;
            color: #4b5563;
            padding-top: 6px;
          }

          .os-footer {
            margin-top: 18px;
            border-top: 1px solid #d1d5db;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            padding-top: 8px;
          }

          @page {
            size: A4;
            margin: 12mm;
          }

          @media print {
            .no-print {
              display: none !important;
            }

            .app-shell {
              background: #ffffff !important;
              min-height: auto !important;
            }

            .os-print-root {
              padding: 0;
            }

            .os-print-page {
              width: auto;
              border: none;
              box-shadow: none;
              margin: 0;
              padding: 0;
            }
          }
        `}
      </style>

      <div className="os-print-root">
        <div className="os-print-page">
          <PrintButtons />

          <div className="os-header">
            <div className="os-shop-name">{shop.name}</div>
            <div className="os-shop-meta">iPitStop · {shopSlug}</div>
          </div>

          <div className="os-section">
            <div className="os-head-row">
              <div>
                <div className="os-title">Ordem de Servico</div>
                <div className="os-subtitle">{maintenance.description}</div>
              </div>

              <div className="os-meta">
                <span className={`os-badge ${maintenance.status === 'open' ? 'os-badge-open' : 'os-badge-closed'}`}>
                  {maintenance.status === 'open' ? 'ABERTA' : 'FECHADA'}
                </span>
                <div>Data: {new Date(maintenance.date).toLocaleDateString('pt-BR')}</div>
                <div>Emissao: {new Date().toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
          </div>

          <div className="os-section">
            <div className="os-section-title">Cliente</div>
            <div className="os-row">
              <div className="os-field" style={{ flex: 1 }}>
                <span className="os-field-label">Nome</span>
                <span className="os-field-value">{maintenance.car.client.name}</span>
              </div>
              {maintenance.car.client.phone && (
                <div className="os-field">
                  <span className="os-field-label">Telefone</span>
                  <span className="os-field-value">{maintenance.car.client.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="os-section">
            <div className="os-section-title">Veiculo</div>
            <div className="os-row">
              <div className="os-field">
                <span className="os-field-label">Placa</span>
                <span className="os-field-value">{maintenance.car.plate}</span>
              </div>
              <div className="os-field" style={{ flex: 1 }}>
                <span className="os-field-label">Modelo</span>
                <span className="os-field-value">{maintenance.car.model}</span>
              </div>
              {maintenance.car.year && (
                <div className="os-field">
                  <span className="os-field-label">Ano</span>
                  <span className="os-field-value">{maintenance.car.year}</span>
                </div>
              )}
            </div>
          </div>

          {maintenance.notes && (
            <div className="os-section">
              <div className="os-section-title">Observacoes</div>
              <p className="os-notes">{maintenance.notes}</p>
            </div>
          )}

          <div className="os-section">
            <div className="os-section-title">Pecas / Servicos</div>
            <table className="os-table">
              <thead>
                <tr>
                  <th>Descricao</th>
                  <th className="os-text-right" style={{ width: '60px' }}>Qtd.</th>
                  <th className="os-text-right" style={{ width: '110px' }}>Vlr. Unit.</th>
                  <th className="os-text-right" style={{ width: '120px' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.items.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>
                      Nenhum item registrado.
                    </td>
                  </tr>
                ) : (
                  maintenance.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td className="os-text-right">{item.quantity}</td>
                      <td className="os-text-right">
                        {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="os-text-right">
                        {item.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="os-total-row">
                  <td colSpan={3} className="os-text-right">TOTAL</td>
                  <td className="os-text-right">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="os-signatures">
            <div className="os-signature">Assinatura do Cliente</div>
            <div className="os-signature">Assinatura da Oficina</div>
          </div>

          <div className="os-footer">Gerado por iPitStop</div>
        </div>
      </div>
    </>
  )
}
