import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not set in environment variables.');
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const user = req.cookies.get('type')?.value;
  const { pathname } = req.nextUrl;

  const publicRoutes = ['/auth/login', '/auth/register', '/','/doctor', '/dashboard'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!token) {
    if (!isPublicRoute) {
      console.log('No token found, redirecting to login...');
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return NextResponse.next();
  }

  try {
    const secretKey = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(token, secretKey);
    console.log('Valid token:', payload);

   if (pathname === '/auth/login' || pathname === '/auth/register') {
      if (user === 'doctor') {
        return NextResponse.redirect(new URL('/doctor', req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url)); 
      }
    }

     if (user === 'doctor' && pathname.startsWith('/user')) {
      return NextResponse.redirect(new URL('/doctor', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    void err;
    console.log('Invalid token, clearing cookie and redirecting to login...');
    const res = NextResponse.redirect(new URL('/auth/login', req.url));
    res.cookies.delete('token');
    return res;
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/doctor',
  ],
};
