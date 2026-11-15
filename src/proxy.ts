import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { OWNER_COOKIE, isValidOwnerId, ownerCookieOptions } from "@/lib/owner-cookie";

// Primera visita: asigna una cookie anónima con un id de dueño aleatorio.
export function proxy(request: NextRequest) {
  if (isValidOwnerId(request.cookies.get(OWNER_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const id = crypto.randomUUID();
  // La fijamos también en la petición para que esta misma visita ya la vea al renderizar.
  request.cookies.set(OWNER_COOKIE, id);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(OWNER_COOKIE, id, ownerCookieOptions);
  return response;
}

export const config = {
  matcher: ["/", "/mis-enlaces"],
};
