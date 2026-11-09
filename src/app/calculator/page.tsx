import CalculatorWizard from "@/components/calculator/CalculatorWizard";

export const metadata = {
  title: "Калькулятор стоимости — Maxi-Kamin",
  description:
    "Рассчитайте предварительную стоимость камина, печи или изделия из камня с доставкой и монтажом",
};

export default function CalculatorPage() {
  return <CalculatorWizard />;
}
