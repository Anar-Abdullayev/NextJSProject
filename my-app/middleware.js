import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await request.cookies.get('token')?.value;
  const isLoginOrRegister = pathname.startsWith('/login') || pathname.startsWith('/register');
  let valid = false;
  if (token) {
    try {
      const payload = await verifyToken(token);
      if (payload)
        valid = true;
    } catch (err) {
      console.log(err)
      valid = false;
    }
  }

  if (valid && isLoginOrRegister) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  const isApi = pathname.startsWith('/api');
  const isPublicPage = isLoginOrRegister || isApi || pathname.startsWith('/_next');
  if (!valid && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs',
};
