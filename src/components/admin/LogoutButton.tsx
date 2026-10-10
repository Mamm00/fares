"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="flex w-full items-center gap-3 px-5 py-3 font-mono text-[11px] tracking-[0.25em] text-ink/50 transition-colors hover:bg-ink hover:text-cream disabled:opacity-50"
    >
      <LogOut size={15} />
      {loading ? "LEAVING…" : "LOG OUT"}
    </button>
  );
}
