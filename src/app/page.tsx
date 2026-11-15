import { Shortener } from "@/components/Shortener";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-16 sm:px-8 sm:py-24 md:py-32">
      <Shortener />
    </main>
  );
}
