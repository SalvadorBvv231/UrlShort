"use server";

import { revalidatePath } from "next/cache";
import QRCode from "qrcode";
import { Prisma } from "@/generated/prisma/client";
import { generateCode } from "@/lib/code";
import { getOrigin } from "@/lib/origin";
import { getOrCreateOwnerId, getOwnerId } from "@/lib/owner";
import { prisma } from "@/lib/prisma";
import { validateUrl } from "@/lib/url";

export type ShortenResult = {
  code: string;
  original: string;
  /** Enlace completo para copiar y para el QR, con el host real del despliegue. */
  shortUrl: string;
  /** Enlace para mostrar, sin protocolo (host/código). */
  display: string;
  /** Código QR del enlace corto, como data URL (PNG). */
  qr: string;
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
      const shortUrl = `${origin}/${code}`;
      const qr = await QRCode.toDataURL(shortUrl, {
        width: 320,
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#13203f", light: "#ffffff" },
      });
      return {
        result: { code, original: check.url, shortUrl, display: `${host}/${code}`, qr },
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

export type DeleteState = { ok: boolean; error?: string };

/** Elimina un enlace solo si pertenece al dueño de la cookie (verificado en el servidor, en la propia consulta). */
export async function deleteLink(id: string): Promise<DeleteState> {
  const ownerId = await getOwnerId();
  if (!ownerId || typeof id !== "string") {
    return { ok: false, error: "No pudimos verificar que este enlace sea tuyo." };
  }

  try {
    // El filtro por ownerId va dentro del DELETE: si no es tuyo, no borra nada.
    const { count } = await prisma.link.deleteMany({ where: { id, ownerId } });
    if (count === 0) return { ok: false, error: "No se encontró el enlace o no te pertenece." };
  } catch (error) {
    console.error("deleteLink falló:", error);
    return { ok: false, error: "No pudimos eliminar el enlace. Intenta de nuevo." };
  }

  revalidatePath("/mis-enlaces");
  return { ok: true };
}
