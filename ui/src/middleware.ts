import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const enableAuth = process.env.NEXTAUTH_ENABLE === 'true';

  if (!enableAuth) {
    return NextResponse.next()
  }


  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const { pathname } = req.nextUrl

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  if (!token && pathname !== '/api/auth/signin') {
    const url = req.nextUrl.clone()
    url.pathname = '/api/auth/signin'
    return NextResponse.redirect(url)
  }
}
