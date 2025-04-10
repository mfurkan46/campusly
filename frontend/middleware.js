import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token'); // Çerezden token’i al
  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url)); // Token yoksa /auth'a yönlendir
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/settings', '/profile','/messages','/notifications','/explore', '/'], // Hangi sayfalar korunacak
};
