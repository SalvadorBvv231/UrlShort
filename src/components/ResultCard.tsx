"use client";

import type { ShortenResult } from "@/app/actions";

export function ResultCard({ result, onReset }: { result: ShortenResult; onReset: () => void }) {
  return (
    <div className="max-w-3xl">
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
        className="marker mt-4 inline-block break-all px-2 font-mono text-3xl font-bold sm:text-4xl"
      >
        {result.display}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="h-14 rounded-lg border-2 border-line bg-white px-8 text-base font-semibold hover:border-teal"
        >
          Acortar otro
        </button>
      </div>
    </div>
  );
}
