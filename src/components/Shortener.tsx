"use client";

import { useActionState, useState } from "react";
import { createLink, type ShortenState } from "@/app/actions";
import { ResultCard } from "./ResultCard";

const initial: ShortenState = {};

function ShortenerInner({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(createLink, initial);

  if (state.result) {
    return <ResultCard result={state.result} onReset={onReset} />;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-[3.4rem]">
        Convierte un enlace largo en uno corto y fácil de compartir.
      </h1>
      <p className="mt-5 text-lg text-muted">Pega la dirección completa y presiona Acortar.</p>

      <form action={formAction} className="mt-8" noValidate>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="url" className="sr-only">
            Enlace largo
          </label>
          <input
            id="url"
            name="url"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            defaultValue={state.value ?? ""}
            placeholder="https://ejemplo.com/una/direccion/muy/larga"
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "url-error" : undefined}
            className="h-14 w-full min-w-0 rounded-lg sm:flex-1 border-2 border-line bg-white px-4 font-mono text-sm placeholder:text-muted/60 focus:border-teal focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="h-14 rounded-lg bg-teal px-8 text-base font-semibold text-white transition hover:bg-teal-dark disabled:opacity-60 sm:min-w-36"
          >
            {pending ? "Acortando…" : "Acortar"}
          </button>
        </div>
        {state.error && (
          <p id="url-error" role="alert" className="mt-3 text-sm font-medium text-danger">
            {state.error}
          </p>
        )}
        <p className="mt-3 text-sm text-muted">Gratis y sin registro.</p>
      </form>
    </div>
  );
}

export function Shortener() {
  // Cambiar la key reinicia el formulario ("Acortar otro").
  const [round, setRound] = useState(0);
  return <ShortenerInner key={round} onReset={() => setRound((n) => n + 1)} />;
}
