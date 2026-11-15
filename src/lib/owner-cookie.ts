// Constantes de la cookie anónima de dueño. Sin dependencias de next/headers
// para poder usarlas tanto en proxy.ts como en el resto del servidor.
export const OWNER_COOKIE = "recorta_owner";

export const ownerCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // en localhost (http) el navegador la rechazaría
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 año
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidOwnerId(value: string | undefined): value is string {
  return typeof value === "string" && UUID.test(value);
}
