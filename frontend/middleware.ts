import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Por ahora no hacemos chequeos de auth en el edge.
  return NextResponse.next();
}

// Podés incluso comentar el matcher o dejarlo igual, ya no importa.
export const config = {
  matcher: ["/((?!_next|\..).)"],
};