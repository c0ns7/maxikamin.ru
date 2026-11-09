import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { AdminLoading } from "@/components/admin/AdminSuspense";
import { isAdminAuthenticated } from "@/lib/auth/admin";

export const instant = false;

async function AuthedShell({ children }: { children: React.ReactNode }) {
  await connection();
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  return <AdminShell>{children}</AdminShell>;
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f4f2ee]">
          <AdminLoading label="Открываем админку…" />
        </div>
      }
    >
      <AuthedShell>{children}</AuthedShell>
    </Suspense>
  );
}
