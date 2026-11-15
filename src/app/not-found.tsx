import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-16 sm:px-8 sm:py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="font-mono text-sm font-bold text-teal">Error 404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Este enlace no existe.
        </h1>
        <p className="mt-5 text-lg text-muted">
          Puede que se haya eliminado o que la dirección esté mal escrita. Revisa el enlace e inténtalo de
          nuevo.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-14 items-center rounded-lg bg-teal px-8 text-base font-semibold text-white transition hover:bg-teal-dark"
        >
          Acortar un enlace
        </Link>
      </div>
    </main>
  );
}
