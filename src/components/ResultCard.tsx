"use client";

import type { ShortenResult } from "@/app/actions";
import { CopyButton } from "./CopyButton";

export function ResultCard({ result, onReset }: { result: ShortenResult; onReset: () => void }) {
  return (
    <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-14">
      <div className="min-w-0">
        <p className="text-sm text-muted">Enlace original</p>
        <p className="mt-1 break-all font-mono text-xs leading-relaxed text-muted/80 line-through">
          {result.original}
        </p>

        <div className="mt-6 flex items-center gap-3 text-sm text-muted">
          <span>Tu enlace corto</span>
          <span className="h-px flex-1 border-t border-dashed border-line" />
        </div>
        <p
          data-testid="short-link"
          className="marker mt-4 inline-block max-w-full break-all px-2 font-mono text-xl font-bold min-[400px]:text-2xl sm:text-4xl"
        >
          {result.display.slice(0, -(result.code.length + 1))}
          <span className="whitespace-nowrap">/{result.code}</span>
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CopyButton
            text={result.shortUrl}
            label="Copiar enlace"
            className="h-14 rounded-lg bg-teal px-8 text-base font-semibold text-white transition hover:bg-teal-dark sm:min-w-44"
          />
          <button
            type="button"
            onClick={onReset}
            className="h-14 rounded-lg border-2 border-line bg-white px-8 text-base font-semibold hover:border-teal"
          >
            Acortar otro
          </button>
        </div>
      </div>

      <figure className="mx-auto md:mx-0">
        {/* data URL generada en el servidor: next/image no aporta nada aquí */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.qr}
          alt={`Código QR del enlace ${result.display}`}
          width={180}
          height={180}
          className="rounded-lg border border-line p-2"
        />
        <figcaption className="mt-3 text-center text-sm text-muted">Escanea para abrir el enlace</figcaption>
      </figure>
    </div>
  );
}
