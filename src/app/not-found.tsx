import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-[10px] tracking-[0.4em] text-ember">
        ERROR — 404
      </p>
      <h1 className="display-tight pt-6 text-[22vw] md:text-[14rem]">
        LOST<span className="text-ember">.</span>
      </h1>
      <p className="max-w-md pt-4 text-paper/60">
        This page walked off the rack. The catalog, however, is fully stocked.
      </p>
      <Link
        href="/catalog"
        className="btn-press mt-10 bg-ember px-8 py-4 font-mono text-xs font-bold tracking-[0.3em] text-ink hover:bg-paper"
      >
        BACK TO THE CATALOG
      </Link>
    </main>
  );
}
