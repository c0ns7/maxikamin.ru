import { Suspense } from "react";

export function AdminLoading({ label = "Загрузка…" }: { label?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#ddd6cb] bg-white/70 px-6 py-16 text-center text-sm text-[#6f675e]">
      {label}
    </div>
  );
}

export default function AdminSuspense({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return <Suspense fallback={<AdminLoading label={label} />}>{children}</Suspense>;
}
