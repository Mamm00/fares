"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { BAG_EVENT, bagCount } from "@/lib/bag";
import BagDrawer from "./BagDrawer";

const NAV = [
  { href: "/catalog", label: "CATALOG" },
  { href: "/category/t-shirts", label: "T-SHIRTS" },
  { href: "/category/hoodies", label: "HOODIES" },
  { href: "/category/accessories", label: "ACCESSORIES" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState(0);
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sync = () => setCount(bagCount());
    sync();
    window.addEventListener(BAG_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(BAG_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setBagOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-ink/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
          <button
            className="btn-press text-paper md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`link-sweep font-mono text-[11px] tracking-[0.25em] text-smoke transition-colors hover:text-paper ${
                  pathname === item.href ? "is-active text-paper" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="btn-press absolute left-1/2 -translate-x-1/2 font-display text-xl tracking-wide md:text-2xl"
          >
            FARES MASHOUR<span className="text-ember">®</span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-8 md:flex">
              {NAV.slice(2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`link-sweep font-mono text-[11px] tracking-[0.25em] text-smoke transition-colors hover:text-paper ${
                    pathname === item.href ? "is-active text-paper" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={() => setBagOpen(true)}
              className="btn-press relative flex items-center gap-2 text-paper"
              aria-label="Open bag"
            >
              <ShoppingBag size={19} strokeWidth={1.75} />
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ember font-mono text-[9px] font-bold text-ink">
                {count}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[85] flex flex-col bg-ink transition-all duration-500 md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-display text-xl">FARES MASHOUR<span className="text-ember">®</span></span>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="btn-press">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
          {[{ href: "/", label: "HOME" }, ...NAV].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="display-tight border-b border-line py-4 text-5xl transition-colors hover:text-ember"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="px-6 pb-8 font-mono text-[10px] tracking-[0.3em] text-smoke">
          HEAVYWEIGHT STREETWEAR — EST. 2025
        </p>
      </div>

      <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} />
    </>
  );
}
