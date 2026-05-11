export default function PrivacyPolicyPage() {
  return (
    <main className="pt-16">
      <section className="bg-brand-navy py-12 lg:py-16">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-[30px] lg:text-[40px] font-extrabold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/60 text-[15px]">Effective date: 1 May 2026</p>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-[800px] mx-auto px-6 prose-custom">
          <div className="space-y-10 text-[15px] text-[#374151] leading-relaxed">

            <p className="text-[16px] text-[#6B7280]">
              Merchat.io (&ldquo;Merchat&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) provides an AI-powered WhatsApp commerce platform for merchants. This Privacy Policy explains what personal data we collect, why we collect it, how we use it, and your rights in relation to it. By using Merchat you agree to this policy.
            </p>

            {[
              {
                n: "1",
                title: "Data we collect",
                body: (
                  <div className="space-y-3">
                    <p><strong>Merchant account data:</strong> name, business name, email address, phone number, and WhatsApp Business number provided during onboarding.</p>
                    <p><strong>Product and inventory data:</strong> product names, descriptions, prices, images, and stock levels that you upload to Merchat.</p>
                    <p><strong>Customer data:</strong> names, phone numbers, delivery addresses, and order history of your customers, collected when they interact with your AI agent.</p>
                    <p><strong>Conversation data:</strong> the content of WhatsApp conversations between your AI agent and your customers, used to power AI responses and provide you with conversation history.</p>
                    <p><strong>Payment data:</strong> we do not store card numbers or bank account details. Payment processing is handled by Paystack or Flutterwave, subject to their privacy policies.</p>
                    <p><strong>Usage data:</strong> log data, device information, IP address, pages visited, and actions taken within the Merchat dashboard, collected automatically.</p>
                  </div>
                ),
              },
              {
                n: "2",
                title: "How we use your data",
                body: (
                  <ul className="space-y-2 list-disc pl-5">
                    <li>To operate and improve the Merchat platform and AI agent</li>
                    <li>To process and display orders in your merchant dashboard</li>
                    <li>To send notifications about orders, payments, and escalations</li>
                    <li>To generate analytics and performance reports for your account</li>
                    <li>To communicate with you about your account, updates, and support requests</li>
                    <li>To comply with legal obligations and enforce our Terms of Service</li>
                  </ul>
                ),
              },
              {
                n: "3",
                title: "Legal basis for processing",
                body: (
                  <p>
                    We process personal data on the basis of: (a) contractual necessity — to deliver the services you signed up for; (b) legitimate interests — to improve our platform, prevent fraud, and ensure security; and (c) legal obligation — where required by applicable law. Where required, we obtain your consent before processing.
                  </p>
                ),
              },
              {
                n: "4",
                title: "Data sharing",
                body: (
                  <div className="space-y-3">
                    <p>We do not sell your personal data. We share data only with:</p>
                    <ul className="space-y-2 list-disc pl-5">
                      <li><strong>Service providers:</strong> Supabase (database hosting), Vercel (application hosting), OpenAI or Anthropic (AI processing), and payment processors (Paystack, Flutterwave) — all bound by data processing agreements.</li>
                      <li><strong>Meta Platforms:</strong> conversation data is transmitted through the WhatsApp Business API and subject to Meta&apos;s data use policies.</li>
                      <li><strong>Legal authorities:</strong> if required by law, regulation, or court order.</li>
                    </ul>
                  </div>
                ),
              },
              {
                n: "5",
                title: "Data retention",
                body: (
                  <p>
                    Merchant account data is retained for the duration of your subscription and for 12 months after account closure. Conversation history is retained according to your plan (7 days on Starter, 90 days on Growth). Customer order data is retained for 3 years for legal and accounting purposes. You may request earlier deletion by contacting us.
                  </p>
                ),
              },
              {
                n: "6",
                title: "Security",
                body: (
                  <p>
                    All data is encrypted in transit using TLS 1.2 or higher and encrypted at rest. We use role-based access controls within our infrastructure and review security practices regularly. No system is perfectly secure; if you suspect unauthorised access to your account, contact support@merchat.io immediately.
                  </p>
                ),
              },
              {
                n: "7",
                title: "Your rights",
                body: (
                  <div className="space-y-3">
                    <p>Depending on your jurisdiction, you may have the right to:</p>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Access the personal data we hold about you</li>
                      <li>Correct inaccurate or incomplete data</li>
                      <li>Request deletion of your personal data</li>
                      <li>Object to or restrict certain types of processing</li>
                      <li>Port your data to another service in a machine-readable format</li>
                    </ul>
                    <p>To exercise any of these rights, email <a href="mailto:privacy@merchat.io" className="text-brand-orange hover:underline">privacy@merchat.io</a>. We will respond within 30 days.</p>
                  </div>
                ),
              },
              {
                n: "8",
                title: "Cookies",
                body: (
                  <p>
                    We use essential session cookies to keep you logged in to the merchant dashboard. We do not use advertising cookies or third-party tracking cookies. Analytics are collected server-side and do not require client-side cookies.
                  </p>
                ),
              },
              {
                n: "9",
                title: "Children",
                body: (
                  <p>
                    Merchat is not intended for use by individuals under 18 years of age. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.
                  </p>
                ),
              },
              {
                n: "10",
                title: "Changes to this policy",
                body: (
                  <p>
                    We may update this policy from time to time. If we make material changes, we will notify you by email and by posting a notice in your dashboard at least 14 days before the changes take effect. Your continued use of Merchat after the effective date constitutes acceptance of the updated policy.
                  </p>
                ),
              },
              {
                n: "11",
                title: "Contact",
                body: (
                  <p>
                    For privacy-related questions or requests, contact us at <a href="mailto:privacy@merchat.io" className="text-brand-orange hover:underline">privacy@merchat.io</a>. Our registered address is Lagos, Nigeria.
                  </p>
                ),
              },
            ].map(({ n, title, body }) => (
              <div key={n}>
                <h2 className="text-[19px] font-bold text-brand-navy mb-3">{n}. {title}</h2>
                {body}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
