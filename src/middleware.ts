import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) return NextResponse.next();

    // 1. Bloqueios de Segurança
    if (token.isBlocked && path !== "/blocked") {
      return NextResponse.redirect(new URL("/blocked?reason=account_suspended", req.url));
    }
    
    if (token.role === "STORE" && token.resellerBlockTree && path !== "/blocked") {
      return NextResponse.redirect(new URL("/blocked?reason=provider_suspended", req.url));
    }

    if (token.role === "STORE") {
      const expiresAt = token.expiresAt ? new Date(token.expiresAt as string) : null;
      if (expiresAt && expiresAt < new Date() && path !== "/blocked") {
        return NextResponse.redirect(new URL("/blocked?reason=license_expired", req.url));
      }
    }

    // 2. Redirecionamento Correto (AQUI ESTAVA O ERRO)
    if (path === "/dashboard") {
      if (token.role === "MASTER") 
        return NextResponse.redirect(new URL("/dashboard/master/resellers", req.url));
      
      // Correção: Envia para a raiz do revendedor
      if (token.role === "RESELLER") 
        return NextResponse.redirect(new URL("/dashboard/reseller", req.url));
      
      if (token.role === "STORE") 
        return NextResponse.redirect(new URL("/dashboard/store/pdv", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/blocked"],
};
