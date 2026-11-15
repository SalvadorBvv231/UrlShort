export type UrlCheck = { ok: true; url: string } | { ok: false; error: string };

const MAX_LENGTH = 2048;

/** Valida con la clase URL integrada: solo http/https. Devuelve la URL normalizada. */
export function validateUrl(input: string): UrlCheck {
  const value = input.trim();

  if (!value) {
    return { ok: false, error: "Pega un enlace para poder acortarlo." };
  }
  if (value.length > MAX_LENGTH) {
    return { ok: false, error: "El enlace es demasiado largo (máximo 2048 caracteres)." };
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return {
      ok: false,
      error: "Ese texto no parece un enlace válido. Revisa que empiece con http:// o https://",
    };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Solo se pueden acortar enlaces que empiecen con http:// o https://" };
  }
  if (!parsed.hostname.includes(".")) {
    return { ok: false, error: "La dirección no es válida. Revisa el nombre del sitio (por ejemplo, ejemplo.com)." };
  }

  return { ok: true, url: parsed.href };
}
