import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check authentication status
  const { data: { session } } = await supabase.auth.getSession();
  
  // Protected routes
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') && 
                      !req.nextUrl.pathname.startsWith('/admin/login');
  
  // If accessing admin routes and not authenticated, redirect to login
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  
  // For admin routes, check if user is admin
  if (isAdminRoute && session) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', session.user.email)
      .single();
      
    // If user is not an admin, redirect to login
    if (!adminUser) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};