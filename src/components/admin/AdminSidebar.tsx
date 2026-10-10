"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  Menu,
  Package,
  Tags,
  X,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/admin", label: "DASHBOARD", icon: LayoutDashboard },
  { href: "/admin/products", label: "PRODUCTS", icon: Package },
  { href: "/admin/categories", label: "CATEGORIES", icon: Tags },
  { href: "/admin/orders", label: "ORDERS", icon: ClipboardList },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 border-l-2 px-5 py-3.5 font-mono text-[11px] tracking-[0.25em] transition-colors ${
              active
                ? "border-ember bg-ink text-cream"
                : "border-transparent text-ink/60 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            <Icon size={15} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  const brand = (
    <div className="border-b border-ink/10 px-5 py-6">
      <p className="font-display text-xl uppercase leading-none">
        Fares Mashour<span className="text-ember">®</span>
      </p>
      <p className="pt-1.5 font-mono text-[9px] tracking-[0.35em] text-ink/40">
        BACK OFFICE — V1.0
      </p>
    </div>
  );

  const footer = (
    <div className="border-t border-ink/10">
      <Link
        href="/"
        className="flex items-center gap-3 px-5 py-3 font-mono text-[11px] tracking-[0.25em] text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
      >
        <ExternalLink size={15} />
        VIEW STORE
      </Link>
      <LogoutButton />
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-ink/10 bg-cream lg:flex">
        {brand}
        <NavLinks />
        {footer}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-cream px-5 py-4 lg:hidden">
        <p className="font-display text-lg uppercase">
          Fares Mashour<span className="text-ember">®</span>
        </p>
        <button onClick={() => setOpen(true)} aria-label="Open admin menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-64 flex-col bg-cream transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-ink/10 pr-4">
            {brand}
            <button onClick={() => setOpen(false)} aria-label="Close admin menu">
              <X size={20} />
            </button>
          </div>
          <NavLinks onNavigate={() => setOpen(false)} />
          {footer}
        </aside>
      </div>
    </>
  );
}
