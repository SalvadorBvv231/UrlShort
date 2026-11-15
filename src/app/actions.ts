"use server";

import { Prisma } from "@/generated/prisma/client";
import { generateCode } from "@/lib/code";
import { getOrigin } from "@/lib/origin";
import { getOrCreateOwnerId } from "@/lib/owner";
import { prisma } from "@/lib/prisma";
import { validateUrl } from "@/lib/url";

export type ShortenResult = {
  code: string;
  original: string;
  /** Enlace completo para copiar y para el QR, con el host real del despliegue. */
  shortUrl: string;
  /** Enlace para mostrar, sin protocolo (host/código). */
  display: string;
};

export type ShortenState = {
  error?: string;
  value?: string;
  result?: ShortenResult;
};

const MAX_ATTEMPTS = 5;

export async function createLink(_prev: ShortenState, formData: FormData): Promise<ShortenState> {
  const raw = String(formData.get("url") ?? "");

  const check = validateUrl(raw);
  if (!check.ok) return { error: check.error, value: raw };

  const { origin, host } = await getOrigin();

  // Evita crear enlaces que apunten a Recorta mismo (cadenas/bucles de redirección).
  if (new URL(check.url).host === host) {
    return { error: "Ese enlace ya es de Recorta. Pega la dirección original.", value: raw };
  }

  const ownerId = await getOrCreateOwnerId();

  // Reintenta si el código aleatorio choca con uno existente (restricción unique).
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateCode();
    try {
      await prisma.link.create({ data: { code, url: check.url, ownerId } });
      return {
        result: {
          code,
          original: check.url,
          shortUrl: `${origin}/${code}`,
          display: `${host}/${code}`,
        },
      };
    } catch (error) {
      const collision =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
      if (!collision) {
        console.error("createLink falló:", error);
        return { error: "No pudimos crear el enlace. Intenta de nuevo en un momento.", value: raw };
      }
    }
  }

  return { error: "No pudimos generar un código único. Intenta de nuevo.", value: raw };
}
