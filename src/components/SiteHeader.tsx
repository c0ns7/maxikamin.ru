import { connection } from "next/server";
import Header from "@/components/Header";
import { getSettings } from "@/lib/db/queries";

export default async function SiteHeader() {
  await connection();
  const contacts = getSettings().contacts;
  return <Header contacts={contacts} />;
}
