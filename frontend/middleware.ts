// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Dejamos pasar TODO, solo ignoramos assets estáticos si querés
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  // No hacemos ninguna redirección de auth aquí.
  return NextResponse.next();
}
