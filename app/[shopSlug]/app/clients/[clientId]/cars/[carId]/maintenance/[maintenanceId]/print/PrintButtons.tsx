'use client'

export default function PrintButtons() {
  return (
    <div className="no-print" style={{ marginBottom: '16px' }}>
      <button
        onClick={() => window.print()}
        style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
      >
        Imprimir / Salvar PDF
      </button>
      <button
        onClick={() => window.close()}
        style={{ marginLeft: '8px', background: '#f3f4f6', color: '#374151', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
      >
        Fechar
      </button>
    </div>
  )
}
