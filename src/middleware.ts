import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isStore = token?.role === "STORE";
    const expiresAt = token?.expiresAt ? new Date(token.expiresAt as string) : null;
    const isGraceActive = token?.isGraceActive as boolean;

    // Se for LOJA e o plano venceu (e não está em modo alerta)
    if (isStore && expiresAt && expiresAt < new Date() && !isGraceActive) {
      // Permite apenas a página de bloqueio para o lojista pagar
      if (!req.nextUrl.pathname.startsWith("/blocked")) {
        return NextResponse.redirect(new URL("/blocked", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*"] };