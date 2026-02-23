'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef, useTransition } from 'react'

// ─── Constants ───────────────────────────────────────────────────────────────

const PRESETS = [
  { label: 'Todos os períodos', value: 'all'   },
  { label: 'Hoje',              value: 'today' },
  { label: 'Esta semana',       value: 'week'  },
  { label: 'Este mês',          value: 'month' },
  { label: 'Últimos 30 dias',   value: '30d'   },
  { label: 'Últimos 3 meses',   value: '3m'    },
  { label: 'Este ano',          value: 'year'  },
]

const WEEK_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const MONTHS_PT = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toISO(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function buildCalendarDays(year: number, month: number): Array<{ iso: string; inMonth: boolean }> {
  const firstWeekday = new Date(year, month, 1).getDay() // 0 = Sunday
  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const result: Array<{ iso: string; inMonth: boolean }> = []

  // Previous month padding
  const prevMonth   = month === 0 ? 11 : month - 1
  const prevYear    = month === 0 ? year - 1 : year
  const daysInPrev  = new Date(prevYear, prevMonth + 1, 0).getDate()
  for (let i = firstWeekday - 1; i >= 0; i--)
    result.push({ iso: toISO(new Date(prevYear, prevMonth, daysInPrev - i)), inMonth: false })

  // Current month
  for (let d = 1; d <= daysInMonth; d++)
    result.push({ iso: toISO(new Date(year, month, d)), inMonth: true })

  // Next month padding → 42 cells (6 rows)
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear  = month === 11 ? year + 1 : year
  let d = 1
  while (result.length < 42)
    result.push({ iso: toISO(new Date(nextYear, nextMonth, d++)), inMonth: false })

  return result
}

function formatShort(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function customRangeLabel(from: string, to: string): string {
  const fmt = (s: string) =>
    new Date(s + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  if (from && to) return `${fmt(from)} – ${fmt(to)}`
  if (from)       return `A partir de ${fmt(from)}`
  if (to)         return `Até ${fmt(to)}`
  return 'Personalizado'
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DateFilter() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentPreset = searchParams.get('datePreset') ?? ''
  const currentFrom   = searchParams.get('dateFrom')   ?? ''
  const currentTo     = searchParams.get('dateTo')     ?? ''

  // Calendar view
  const now = new Date()
  const [viewYear,  setViewYear]  = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  // Ephemeral selection (not yet applied to URL)
  const [selFrom,   setSelFrom]   = useState('')
  const [selTo,     setSelTo]     = useState('')
  const [picking,   setPicking]   = useState<'from' | 'to'>('from')
  const [hoverDate, setHoverDate] = useState('')

  // Sync selection state from URL whenever dropdown opens
  useEffect(() => {
    if (!open) return
    setSelFrom(currentFrom)
    setSelTo(currentTo)
    setPicking(currentFrom ? 'to' : 'from')
    if (currentFrom) {
      const d = new Date(currentFrom + 'T00:00:00')
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Outside click to close
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  // ── Navigation helpers ──

  function navigate(overrides: Record<string, string | null>) {
    const p = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(overrides)) {
      if (v === null) p.delete(k)
      else p.set(k, v)
    }
    setOpen(false)
    startTransition(() => router.replace(`${pathname}?${p.toString()}`))
  }

  function selectPreset(value: string) {
    value === 'all'
      ? navigate({ datePreset: null, dateFrom: null, dateTo: null })
      : navigate({ datePreset: value, dateFrom: null, dateTo: null })
  }

  function applyCustom() {
    if (!selFrom && !selTo) return
    navigate({ datePreset: null, dateFrom: selFrom || null, dateTo: selTo || null })
  }

  function clearCustom() {
    setSelFrom('')
    setSelTo('')
    setPicking('from')
  }

  // ── Calendar logic ──

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function handleDayClick(iso: string) {
    if (picking === 'from') {
      setSelFrom(iso)
      setSelTo('')
      setPicking('to')
    } else {
      if (iso >= selFrom) {
        setSelTo(iso)
        setPicking('from')
      } else {
        // Clicked before current from → restart
        setSelFrom(iso)
        setSelTo('')
        // keep picking === 'to'
      }
    }
  }

  // ── Derived state ──

  const today          = toISO(new Date())
  const days           = buildCalendarDays(viewYear, viewMonth)
  const effectiveEnd   = selTo || (picking === 'to' && hoverDate >= selFrom ? hoverDate : '')
  const isCustomActive = !currentPreset && (!!currentFrom || !!currentTo)
  const hasFilter      = !!currentPreset || !!currentFrom || !!currentTo
  const canApply       = !!selFrom || !!selTo

  const buttonLabel = isCustomActive
    ? customRangeLabel(currentFrom, currentTo)
    : (PRESETS.find(p => p.value === (currentPreset || 'all'))?.label ?? 'Todos os períodos')

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div ref={ref} className="relative shrink-0">

      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
          hasFilter
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/15'
            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
        <span className="max-w-37.5 truncate">{buttonLabel}</span>
        <svg className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden">

          {/* Preset list */}
          <div className="p-1.5">
            {PRESETS.map((preset) => {
              const isActive = !isCustomActive && (currentPreset || 'all') === preset.value
              return (
                <button
                  key={preset.value}
                  onClick={() => selectPreset(preset.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-amber-400' : 'bg-slate-700'}`} />
                  {preset.label}
                  {isActive && (
                    <svg className="w-3.5 h-3.5 ml-auto text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>

          <div className="h-px bg-slate-800 mx-2" />

          {/* Custom calendar section */}
          <div className="p-3">
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isCustomActive ? 'text-amber-400' : 'text-slate-500'}`}>
              Personalizado
            </p>

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={prevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-slate-200">
                {MONTHS_PT[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Week day labels */}
            <div className="grid grid-cols-7 mb-0.5">
              {WEEK_LABELS.map((label, i) => (
                <div key={i} className="h-7 flex items-center justify-center text-xs font-medium text-slate-600">
                  {label}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div
              className="grid grid-cols-7"
              onMouseLeave={() => setHoverDate('')}
            >
              {days.map(({ iso, inMonth }) => {
                const isFrom  = iso === selFrom
                const isTo    = iso === selTo
                const isHover = picking === 'to' && !selTo && iso === hoverDate && iso > selFrom
                const inRange = selFrom && effectiveEnd && iso > selFrom && iso < effectiveEnd
                const isToday = iso === today

                let cls = 'w-9 h-9 flex items-center justify-center text-xs font-medium rounded-lg transition-colors select-none '

                if (isFrom || isTo) {
                  cls += 'bg-amber-500 text-slate-900 font-bold cursor-pointer '
                } else if (isHover && selFrom) {
                  cls += 'bg-amber-500/50 text-slate-900 font-bold cursor-pointer '
                } else if (inRange) {
                  cls += 'bg-amber-500/15 text-amber-200 cursor-pointer hover:bg-amber-500/25 '
                } else if (!inMonth) {
                  cls += 'text-slate-700 cursor-pointer hover:text-slate-500 '
                } else if (isToday) {
                  cls += 'text-amber-400 ring-1 ring-inset ring-amber-500/40 cursor-pointer hover:bg-slate-800 '
                } else {
                  cls += 'text-slate-300 cursor-pointer hover:bg-slate-800 hover:text-white '
                }

                return (
                  <button
                    key={iso}
                    className={cls}
                    onClick={() => handleDayClick(iso)}
                    onMouseEnter={() => setHoverDate(iso)}
                  >
                    {parseInt(iso.slice(8), 10)}
                  </button>
                )
              })}
            </div>

            {/* Selected range display — clickable to switch picking mode */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => setPicking('from')}
                className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs border text-left transition-colors ${
                  selFrom
                    ? picking === 'from'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-amber-500/30 bg-amber-500/5 text-amber-300 hover:border-amber-500/50'
                    : 'border-slate-700 bg-slate-800 text-slate-500 hover:border-slate-600'
                }`}
              >
                {selFrom ? formatShort(selFrom) : 'De'}
              </button>

              <svg className="w-3 h-3 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>

              <button
                onClick={() => selFrom && setPicking('to')}
                className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs border text-left transition-colors ${
                  selTo
                    ? picking === 'to'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-amber-500/30 bg-amber-500/5 text-amber-300 hover:border-amber-500/50'
                    : 'border-slate-700 bg-slate-800 text-slate-500 hover:border-slate-600'
                }`}
              >
                {selTo ? formatShort(selTo) : 'Até'}
              </button>
            </div>

            {/* Hint */}
            <p className="text-xs text-slate-600 mt-1.5 text-center">
              {picking === 'from'
                ? 'Selecione a data inicial'
                : selFrom
                  ? 'Agora selecione a data final'
                  : ''}
            </p>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={clearCustom}
                className="flex-1 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={applyCustom}
                disabled={!canApply}
                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-900 text-xs font-bold py-2 rounded-lg transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
