import Link from "next/link";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl tracking-tight text-[#1a1714]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-[#6f675e]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[#ddd6cb] bg-white p-5 shadow-[0_1px_0_rgba(26,23,20,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "bg-[#1a1714] text-white hover:bg-[#a84f32]"
      : "border border-[#ddd6cb] bg-white text-[#1a1714] hover:border-[#1a1714]";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition ${styles}`}
    >
      {children}
    </Link>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  rows,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  const shared =
    "mt-1.5 w-full rounded-md border border-[#ddd6cb] bg-[#fbfaf8] px-3 py-2.5 text-sm outline-none transition focus:border-[#a84f32] focus:bg-white";
  return (
    <label className="block text-sm">
      <span className="font-medium text-[#1a1714]">{label}</span>
      {rows ? (
        <textarea
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={shared}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          required={required}
          placeholder={placeholder}
          className={shared}
        />
      )}
      {hint ? <span className="mt-1 block text-xs text-[#8a8176]">{hint}</span> : null}
    </label>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#1a1714]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[#a84f32]"
      />
      {label}
    </label>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex cursor-pointer items-center justify-center rounded-md bg-[#a84f32] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#8f4229]"
    >
      {children}
    </button>
  );
}

export function DangerButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
    >
      {children}
    </button>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#ddd6cb] bg-white/60 px-6 py-16 text-center text-sm text-[#6f675e]">
      {text}
    </div>
  );
}
