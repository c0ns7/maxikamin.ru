import type { SiteContacts } from "@/lib/types";

export function contactPhones(contacts: SiteContacts): string[] {
  return [contacts.phone, contacts.phone2, contacts.phone3]
    .map((p) => p.trim())
    .filter(Boolean);
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function copyrightYears(from = 2015): string {
  const year = new Date().getFullYear();
  return year > from ? `${from}–${year}` : String(from);
}
