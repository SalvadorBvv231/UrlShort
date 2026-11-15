"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "copied" | "error";

export function CopyButton({
  text,
  label = "Copiar",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error"); // sin permiso o contexto no seguro
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button type="button" onClick={copy} className={className}>
      <span aria-live="polite">
        {status === "copied" ? "¡Copiado!" : status === "error" ? "No se pudo copiar" : label}
      </span>
    </button>
  );
}
