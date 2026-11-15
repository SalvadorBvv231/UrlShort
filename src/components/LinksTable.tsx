"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { deleteLink } from "@/app/actions";
import { CopyButton } from "./CopyButton";

export type LinkRow = { id: string; code: string; url: string; clicks: number; created: string };

const btn = "h-9 rounded-md border px-3 text-sm transition";

/** "https://www.sitio.com/a" -> "sitio.com/a" (como en el mockup). */
function shortDestination(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

function DeleteButton({ id, onError }: { id: string; onError: (message: string) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteLink(id);
      if (!result.ok) {
        onError(result.error ?? "No pudimos eliminar el enlace.");
        setConfirming(false);
      }
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`${btn} border-danger/30 text-danger hover:bg-danger/5`}
      >
        Eliminar
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5" role="group" aria-label="Confirmar eliminación">
      <button
        type="button"
        onClick={confirmDelete}
        disabled={pending}
        className={`${btn} border-danger bg-danger text-white hover:opacity-90 disabled:opacity-60`}
      >
        {pending ? "Eliminando…" : "Sí, eliminar"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={pending}
        className={`${btn} border-line bg-white hover:border-teal`}
      >
        Cancelar
      </button>
    </span>
  );
}

export function LinksTable({ links, origin, host }: { links: LinkRow[]; origin: string; host: string }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter((l) => l.code.toLowerCase().includes(q) || l.url.toLowerCase().includes(q));
  }, [links, query]);

  const count = links.length;

  return (
    <div>
      <p className="mt-1 text-muted" data-testid="count">
        {count === 0 ? "Aún no has creado enlaces" : `${count} ${count === 1 ? "enlace creado" : "enlaces creados"}`}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="search" className="sr-only">
          Buscar enlace
        </label>
        <input
          id="search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar enlace"
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-lg border-2 border-line bg-white px-4 text-sm placeholder:text-muted/70 focus:border-teal focus:outline-none sm:max-w-80"
        />
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-teal px-6 text-sm font-semibold text-white transition hover:bg-teal-dark"
        >
          Nuevo enlace
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      {count === 0 ? (
        <p className="mt-12 text-muted">
          Cuando acortes un enlace aparecerá aquí, con el número de veces que se ha abierto.
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-12 text-muted">No hay enlaces que coincidan con «{query.trim()}».</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-line text-muted">
                <th className="px-3 pb-3 font-normal">Enlace corto</th>
                <th className="w-full px-3 pb-3 font-normal">Destino</th>
                <th className="px-3 pb-3 text-right font-normal">Clics</th>
                <th className="px-3 pb-3 font-normal">Creado</th>
                <th className="px-3 pb-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-line/70 align-middle" data-testid="row">
                  <td className="whitespace-nowrap px-3 py-4 font-mono text-[13px] font-medium">
                    <a href={`/${l.code}`} target="_blank" rel="noopener noreferrer" className="hover:text-teal">
                      {host}/{l.code}
                    </a>
                  </td>
                  <td className="w-full max-w-0 px-3 py-4 text-muted">
                    <span className="block truncate" title={l.url}>
                      {shortDestination(l.url)}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right font-bold">{l.clicks}</td>
                  <td className="whitespace-nowrap px-3 py-4">{l.created}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-right">
                    <span className="inline-flex items-center gap-2">
                      <CopyButton
                        text={`${origin}/${l.code}`}
                        className={`${btn} min-w-[4.5rem] border-line bg-white hover:border-teal`}
                      />
                      <DeleteButton id={l.id} onError={setError} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
