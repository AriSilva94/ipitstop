'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  shopSlug: string
}

type NavLink = {
  href: string
  label: string
  icon: React.ReactNode
}

function isActivePath(pathname: string, href: string) {
  if (href.endsWith('/app')) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AppSidebarNav({ shopSlug }: Props) {
  const pathname = usePathname()

  const navLinks: NavLink[] = [
    {
      href: `/${shopSlug}/app`,
      label: 'Dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      href: `/${shopSlug}/app/clients`,
      label: 'Clientes',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      href: `/${shopSlug}/app/maintenances`,
      label: 'Ordens de Serviço',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="px-3 py-3 lg:py-4 border-b border-border/70 dark:border-border/40 lg:border-b-0 lg:flex-1 lg:overflow-y-auto">
      <div className="flex gap-1.5 overflow-x-auto lg:flex-col lg:space-y-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navLinks.map((link) => {
          const isActive = isActivePath(pathname, link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={`shrink-0 whitespace-nowrap lg:w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-foreground text-background font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-amber-400'
              }`}
            >
              <span className={isActive ? 'text-background' : 'text-current'}>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
