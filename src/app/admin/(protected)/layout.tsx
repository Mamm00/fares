import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AdminSidebar />
      <main className="lg:pl-60">
        <div className="mx-auto max-w-[1240px] px-5 py-10 md:px-10">{children}</div>
      </main>
    </div>
  );
}
