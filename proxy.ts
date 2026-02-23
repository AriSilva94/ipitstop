import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from './lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Match /{shopSlug}/app and all sub-routes
  const appRouteMatch = pathname.match(/^\/([^/]+)\/app(\/.*)?$/)
  // Match /{shopSlug}/login
  const loginRouteMatch = pathname.match(/^\/([^/]+)\/login$/)

  const token = request.cookies.get(COOKIE_NAME)?.value
  const session = token ? await verifyToken(token) : null

  if (appRouteMatch) {
    const shopSlug = appRouteMatch[1]

    if (!session) {
      return NextResponse.redirect(new URL(`/${shopSlug}/login`, request.url))
    }

    // Tenant isolation: user must belong to this shop (unless admin)
    if (session.role !== 'admin' && session.shopSlug !== shopSlug) {
      return NextResponse.redirect(new URL(`/${shopSlug}/login`, request.url))
    }

    return NextResponse.next()
  }

  if (loginRouteMatch) {
    const shopSlug = loginRouteMatch[1]

    // If already authenticated for this shop, redirect to app
    if (session && (session.shopSlug === shopSlug || session.role === 'admin')) {
      return NextResponse.redirect(new URL(`/${shopSlug}/app`, request.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
}
