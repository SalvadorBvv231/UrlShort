import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { isValidCode } from "@/lib/code";
import { prisma } from "@/lib/prisma";

// Un Route Handler responde con HTTP puro (307 real, 404 real). Para que el 404 sea
// amigable devolvemos una página HTML autocontenida en español con la identidad de Recorta.
const NOT_FOUND_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Enlace no encontrado — Recorta</title>
<style>
  body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#13203f;background:#fff}
  header{border-bottom:1px solid #e2e8f0}
  .bar{max-width:64rem;margin:0 auto;padding:0 1.25rem;height:4rem;display:flex;align-items:center;gap:.6rem}
  .bar span{font-size:1.5rem;font-weight:600;letter-spacing:-.02em}
  main{max-width:64rem;margin:0 auto;padding:5rem 1.25rem}
  .code{font-family:ui-monospace,monospace;font-weight:700;font-size:.875rem;color:#0e7c86;margin:0}
  h1{font-size:clamp(2.25rem,6vw,3rem);line-height:1.1;letter-spacing:-.02em;margin:.75rem 0 0;max-width:36rem}
  p.t{font-size:1.125rem;color:#6b7280;margin:1.25rem 0 0;max-width:36rem}
  a.b{display:inline-flex;align-items:center;height:3.5rem;margin-top:2rem;padding:0 2rem;border-radius:.5rem;background:#0e7c86;color:#fff;font-weight:600;text-decoration:none}
  a.b:hover{background:#0a636b}
</style>
</head>
<body>
<header><div class="bar">
  <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="#0E7C86"/><rect x="6" y="14" width="8" height="4" rx="1" fill="#fff"/><rect x="18" y="14" width="8" height="4" rx="1" fill="#fff"/></svg>
  <span>Recorta</span>
</div></header>
<main>
  <p class="code">Error 404</p>
  <h1>Este enlace no existe.</h1>
  <p class="t">Puede que se haya eliminado o que la dirección esté mal escrita. Revisa el enlace e inténtalo de nuevo.</p>
  <a class="b" href="/">Acortar un enlace</a>
</main>
</body>
</html>`;

function notFoundResponse() {
  return new Response(NOT_FOUND_HTML, {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function GET(_request: Request, { params }: RouteContext<"/[code]">) {
  const { code } = await params;

  // Códigos con formato inválido no necesitan ni consultar la base de datos.
  if (!isValidCode(code)) return notFoundResponse();

  try {
    // Un solo UPDATE atómico en SQL (clicks = clicks + 1) que además devuelve la URL.
    // Si el código no existe, Prisma lanza P2025.
    const { url } = await prisma.link.update({
      where: { code },
      data: { clicks: { increment: 1 } },
      select: { url: true },
    });
    return NextResponse.redirect(url, 307);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFoundResponse();
    }
    throw error;
  }
}
