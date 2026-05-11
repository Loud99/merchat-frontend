import FAQAccordion from "./FAQAccordion";

export default function FAQSection() {
  return (
    <section id="faq" className="bg-white py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[24px] lg:text-[32px] font-bold text-brand-navy mb-12">
          Questions merchants ask
        </h2>
        <div className="max-w-3xl">
          <FAQAccordion />
        </div>
      </div>
    </section>
  );
}
