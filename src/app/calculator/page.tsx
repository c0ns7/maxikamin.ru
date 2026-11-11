import { Suspense } from "react";
import { connection } from "next/server";
import CalculatorWizard from "@/components/calculator/CalculatorWizard";
import { getSettings } from "@/lib/db/queries";

export const metadata = {
  title: "Калькулятор стоимости — MaxiKamin",
  description:
    "Рассчитайте предварительную стоимость камина, печи или изделия из камня с доставкой и монтажом",
};

export const instant = false;

async function CalculatorContent() {
  await connection();
  const phone = getSettings().contacts.phone;
  return <CalculatorWizard phone={phone} />;
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={null}>
      <CalculatorContent />
    </Suspense>
  );
}
