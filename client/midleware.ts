import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
   console.log('Middleware cookies:', request.cookies.getAll());
   const { pathname } = request.nextUrl;
   console.log('Path:', pathname);

   const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
   const hasSession = request.cookies.has('vms.sid');

   // Unauthenticated → /login (includes /change-password now)
   if (!hasSession && !isPublic) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
   }

   // Authenticated → away from /login
   if (hasSession && pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
   ],
};
