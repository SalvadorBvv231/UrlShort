import type { Metadata } from "next";
import { Suspense } from "react";
import { LinksTable, type LinkRow } from "@/components/LinksTable";
import { getOrigin } from "@/lib/origin";
import { getOwnerId } from "@/lib/owner";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Mis enlaces — Recorta" };

// Fecha en es-MX ("22 sep 2026"). Se formatea en el servidor con zona fija para evitar diferencias al hidratar.
const dateFormat = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "America/Mexico_City",
});

async function MyLinks() {
  const ownerId = await getOwnerId();
  const { origin, host } = await getOrigin();

  const links = ownerId
    ? await prisma.link.findMany({
        where: { ownerId },
        orderBy: { createdAt: "desc" },
        select: { id: true, code: true, url: true, clicks: true, createdAt: true },
      })
    : [];

  const rows: LinkRow[] = links.map((l) => ({
    id: l.id,
    code: l.code,
    url: l.url,
    clicks: l.clicks,
    created: dateFormat.format(l.createdAt).replace(/\./g, ""),
  }));

  return <LinksTable links={rows} origin={origin} host={host} />;
}

function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando tus enlaces" className="animate-pulse">
      <div className="h-5 w-40 rounded bg-line/50" />
      <div className="mt-8 h-12 w-80 rounded bg-line/40" />
      <div className="mt-8 space-y-3">
        <div className="h-12 rounded bg-line/30" />
        <div className="h-12 rounded bg-line/30" />
        <div className="h-12 rounded bg-line/30" />
      </div>
    </div>
  );
}

export default function MisEnlacesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Mis enlaces</h1>
      <Suspense fallback={<Skeleton />}>
        <MyLinks />
      </Suspense>
    </main>
  );
}
