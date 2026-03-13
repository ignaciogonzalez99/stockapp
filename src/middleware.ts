import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    const session = request.cookies.get('session');
    const { pathname } = request.nextUrl;

    // 1. If user is on login page and HAS session -> Redirect to Dashboard
    if (pathname === '/login' && session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If user is on protected route (Dashboard) and NO session -> Redirect to Login
    // We exclude /login, static files, and api routes from this check
    if (pathname !== '/login' && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
