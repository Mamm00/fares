"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-16 md:px-10 md:pt-24">
        <Link href="/" className="group block">
          <h2 className="display-tight text-center text-[13.5vw] leading-none text-paper transition-colors duration-500 group-hover:text-ember md:text-[11vw]">
            FARES MASHOUR
          </h2>
        </Link>

        <div className="mt-16 grid grid-cols-2 gap-10 border-t border-line pt-12 md:grid-cols-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-smoke">SHOP</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["All Products", "/catalog"],
                ["T-Shirts", "/category/t-shirts"],
                ["Hoodies", "/category/hoodies"],
                ["Bottoms", "/category/bottoms"],
                ["Accessories", "/category/accessories"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="link-sweep text-paper/80 hover:text-paper">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-smoke">BRAND</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/#manifesto" className="link-sweep text-paper/80 hover:text-paper">
                  Manifesto
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="link-sweep text-paper/80 hover:text-paper">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/admin" className="link-sweep inline-flex items-center gap-1 text-paper/80 hover:text-paper">
                  Admin Panel <ArrowUpRight size={13} />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-smoke">SOCIAL</p>
            <ul className="mt-4 space-y-2.5 font-mono text-sm">
              {["INSTAGRAM", "TIKTOK", "YOUTUBE"].map((s) => (
                <li key={s}>
                  <a href="#" className="link-sweep inline-flex items-center gap-1 text-paper/80 hover:text-paper">
                    {s} <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="font-mono text-[10px] tracking-[0.3em] text-smoke">HQ</p>
            <p className="mt-4 font-mono text-xs leading-loose text-paper/70">
              CAIRO — DUBAI
              <br />
              WORLDWIDE SHIPPING
              <br />
              CASH ON DELIVERY
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[10px] tracking-[0.25em] text-smoke md:flex-row">
          <p>© 2026 FARES MASHOUR® — ALL RIGHTS RESERVED</p>
          <p>
            HEAVYWEIGHT ONLY<span className="text-ember">.</span> NO COMPROMISE
            <span className="text-ember">.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
