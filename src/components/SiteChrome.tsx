import { connection } from "next/server";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { getSettings } from "@/lib/db/queries";

export default async function SiteChrome() {
  await connection();
  const contacts = getSettings().contacts;
  return (
    <>
      <Footer contacts={contacts} />
      <CartDrawer />
    </>
  );
}
