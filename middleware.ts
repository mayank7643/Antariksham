import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PREFIX   = '/admin'
const LOGIN_PATH     = '/admin/login'
const AUTH_COOKIE    = 'antariksham_admin'
const LOCK_COOKIE    = 'antariksham_lock'
const MAX_ATTEMPTS   = 5
const LOCK_DURATION  = 15 * 60 * 1000 // 15 minutes in ms

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run on /admin routes
  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next()
  }

  // Set security headers on all admin routes
  const response = NextResponse.next()
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Allow login page through — but still set security headers
  if (pathname === LOGIN_PATH) {
    // If already authenticated, redirect to dashboard
    const authCookie = request.cookies.get(AUTH_COOKIE)
    if (authCookie?.value === process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  // Check brute force lock
  const lockCookie = request.cookies.get(LOCK_COOKIE)
  if (lockCookie) {
    const lockData = JSON.parse(lockCookie.value || '{}')
    const now = Date.now()
    if (lockData.lockedUntil && now < lockData.lockedUntil) {
      // Still locked — redirect to login with locked param
      return NextResponse.redirect(new URL(`${LOGIN_PATH}?locked=1`, request.url))
    }
  }

  // Check auth cookie
  const authCookie = request.cookies.get(AUTH_COOKIE)
  if (!authCookie || authCookie.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
