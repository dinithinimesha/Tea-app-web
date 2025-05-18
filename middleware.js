import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
    // Create a Supabase client configured for middleware
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    
    // Get the session using the updated method
    const { data: { session } } = await supabase.auth.getSession();
    
    // If there's no session and trying to access protected routes, redirect to login
    if (!session && req.nextUrl.pathname === '/admindashboard') {
        return NextResponse.redirect(new URL('/', req.url));
    }
    
    return res;
}

export const config = {
    matcher: ['/admindashboard'],
};