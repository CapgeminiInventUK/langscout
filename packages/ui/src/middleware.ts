import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default function middleware(req: NextRequestWithAuth) {
  const isAuthEnabled = process.env.NEXTAUTH_ENABLE === 'true';

  if (isAuthEnabled) {
    return (withAuth(req));
  } else {
    console.warn('Auth is disabled');
    return NextResponse.next();
  }
}


export const config = {
  matcher: ['/:path*'],
};
