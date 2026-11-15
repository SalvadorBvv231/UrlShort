import { headers } from "next/headers";

/** Host real del despliegue (Vercel, localhost, dominio propio). Nada hardcodeado. */
export async function getOrigin(): Promise<{ origin: string; host: string }> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000").split(",")[0].trim();
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const proto = (h.get("x-forwarded-proto") ?? (isLocal ? "http" : "https")).split(",")[0].trim();
  return { origin: `${proto}://${host}`, host };
}
