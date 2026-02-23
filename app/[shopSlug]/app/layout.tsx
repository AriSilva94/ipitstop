import { notFound } from 'next/navigation'
import { db } from '../../../lib/db'
import { getSession } from '../../../lib/auth'
import { logoutAction } from './logout/actions'
import { ThemeToggle } from '../../components/ThemeToggle'
import AppSidebarNav from './AppSidebarNav'

type Props = {
  children: React.ReactNode
  params: Promise<{ shopSlug: string }>
}

export default async function AppLayout({ children, params }: Props) {
  const { shopSlug } = await params
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) notFound()

  const session = await getSession()

  return (
    <div className="app-shell h-screen flex overflow-hidden bg-slate-900">
      {/* Sidebar */}
      <aside className="app-sidebar h-full w-60 bg-slate-950 border-r border-border/70 dark:border-border/40 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border/70 dark:border-border/40">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-tight leading-none">
                iPit<span className="text-amber-500">Stop</span>
              </span>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg px-3 py-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Oficina</p>
            <p className="text-sm font-semibold text-slate-200 truncate mt-0.5">{shop.name}</p>
          </div>
        </div>

        {/* Navigation */}
        <AppSidebarNav shopSlug={shopSlug} />

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border/70 dark:border-border/40">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{session?.role ?? ''}</span>
          </div>
          <div className="mb-3">
            <ThemeToggle />
          </div>
          <form
            action={async () => {
              'use server'
              await logoutAction(shopSlug)
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 w-full text-left text-sm text-slate-500 hover:text-red-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="app-content flex-1 overflow-auto bg-slate-900">
        {children}
      </main>
    </div>
  )
}
