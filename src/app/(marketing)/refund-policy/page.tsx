export default function RefundPolicyPage() {
  return (
    <main className="pt-16">
      <section className="bg-brand-navy py-12 lg:py-16">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-[30px] lg:text-[40px] font-extrabold text-white mb-2">Refund Policy</h1>
          <p className="text-white/60 text-[15px]">Effective date: 1 May 2026</p>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="space-y-8 text-[15px] text-[#374151] leading-relaxed">

            <p className="text-[16px] text-[#6B7280]">
              This Refund Policy applies to all paid subscriptions to the Merchat.io platform. Please read it carefully before subscribing to a paid plan.
            </p>

            <div>
              <h2 className="text-[19px] font-bold text-brand-navy mb-3">1. Starter plan</h2>
              <p>
                The Starter plan is free of charge. There are no payments, and therefore no refunds apply to the Starter plan.
              </p>
            </div>

            <div>
              <h2 className="text-[19px] font-bold text-brand-navy mb-3">2. Growth plan — general policy</h2>
              <p>
                Growth plan subscriptions are billed monthly in advance. We do not offer pro-rated refunds for partial months of service. If you cancel your subscription, you will retain access to Growth plan features until the end of your current billing period, after which your account will revert to the Starter plan.
              </p>
            </div>

            <div>
              <h2 className="text-[19px] font-bold text-brand-navy mb-3">3. Exceptions</h2>
              <p className="mb-3">
                We will issue a full refund of your most recent payment in the following circumstances:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>You were charged in error (e.g., a duplicate payment or a technical billing fault on our side).</li>
                <li>You did not receive any meaningful access to Growth plan features during the billing period due to a platform outage or error caused by Merchat.</li>
                <li>You contact us within 7 days of being charged and have not made material use of Growth-only features during that period.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-[19px] font-bold text-brand-navy mb-3">4. What is not refundable</h2>
              <ul className="space-y-2 list-disc pl-5">
                <li>Monthly subscription fees where the service was made available and used.</li>
                <li>WhatsApp Business API conversation fees charged by Meta Platforms — these are outside Merchat&apos;s control and billed directly by Meta.</li>
                <li>Fees paid to Paystack or Flutterwave for payment processing on customer orders — those are governed by their respective refund and dispute policies.</li>
                <li>Any charges that result from your failure to cancel before the renewal date.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-[19px] font-bold text-brand-navy mb-3">5. How to request a refund</h2>
              <p>
                To request a refund, email <a href="mailto:billing@merchat.io" className="text-brand-orange hover:underline">billing@merchat.io</a> with your business name, the email address on your account, and a brief description of the reason for your request. We will respond within 3 business days. Approved refunds are processed within 5–10 business days to the original payment method.
              </p>
            </div>

            <div>
              <h2 className="text-[19px] font-bold text-brand-navy mb-3">6. Changes to this policy</h2>
              <p>
                We may update this policy at any time. Changes will be posted on this page with an updated effective date. Your continued use of the Service after a change constitutes acceptance of the updated policy.
              </p>
            </div>

            <div className="bg-[#F4EDE8] rounded-xl p-5">
              <p className="text-[14px] text-[#6B7280]">
                Questions about a specific charge? Email{" "}
                <a href="mailto:billing@merchat.io" className="text-brand-orange hover:underline font-semibold">billing@merchat.io</a>{" "}
                and we&apos;ll sort it out quickly.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
