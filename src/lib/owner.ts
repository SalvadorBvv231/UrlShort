import { cookies } from "next/headers";
import { OWNER_COOKIE, isValidOwnerId, ownerCookieOptions } from "./owner-cookie";

/** Lee el id del dueño (puede ser null si aún no hay cookie). Válido en Server Components y acciones. */
export async function getOwnerId(): Promise<string | null> {
  const value = (await cookies()).get(OWNER_COOKIE)?.value;
  return isValidOwnerId(value) ? value : null;
}

/** Solo para Server Actions / Route Handlers: si no hay cookie válida, la crea. */
export async function getOrCreateOwnerId(): Promise<string> {
  const store = await cookies();
  const current = store.get(OWNER_COOKIE)?.value;
  if (isValidOwnerId(current)) return current;
  const id = crypto.randomUUID();
  store.set(OWNER_COOKIE, id, ownerCookieOptions);
  return id;
}
