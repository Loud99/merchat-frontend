export default function TermsOfServicePage() {
  return (
    <main className="pt-16">
      <section className="bg-brand-navy py-12 lg:py-16">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-[30px] lg:text-[40px] font-extrabold text-white mb-2">Terms of Service</h1>
          <p className="text-white/60 text-[15px]">Effective date: 1 May 2026</p>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="space-y-10 text-[15px] text-[#374151] leading-relaxed">

            <p className="text-[16px] text-[#6B7280]">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Merchat.io platform, including the merchant dashboard, AI agent, WhatsApp Flows, and all related services (collectively the &ldquo;Service&rdquo;) provided by Merchat.io (&ldquo;Merchat&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or using the Service, you agree to these Terms.
            </p>

            {[
              {
                n: "1",
                title: "Eligibility",
                body: "You must be at least 18 years old and have legal capacity to enter into a binding agreement to use Merchat. By using the Service, you represent that you meet these requirements. The Service is intended for use by business owners and is not a consumer product.",
              },
              {
                n: "2",
                title: "Account registration",
                body: "You must provide accurate and complete information when creating your account. You are responsible for maintaining the security of your account credentials. You must not share your login credentials or allow unauthorised access to your account. You are responsible for all activity that occurs under your account.",
              },
              {
                n: "3",
                title: "Acceptable use",
                body: null,
                list: [
                  "You may only use Merchat for lawful commercial purposes in connection with your legitimate business.",
                  "You must not use the Service to sell prohibited goods (including but not limited to: illegal substances, counterfeit products, weapons, or content that violates intellectual property rights).",
                  "You must not attempt to reverse engineer, disrupt, or gain unauthorised access to any part of the Service.",
                  "You must not use the AI agent to send unsolicited messages, spam, or mislead customers.",
                  "You must comply with WhatsApp's Business Policy and Meta's terms when using the WhatsApp Business API through Merchat.",
                ],
              },
              {
                n: "4",
                title: "WhatsApp Business API",
                body: "The Service operates on top of the WhatsApp Business API provided by Meta Platforms. Your use of WhatsApp features through Merchat is also subject to Meta's WhatsApp Business Terms of Service and Messaging Policies. Merchat is not responsible for actions taken by Meta, including suspension or restriction of your WhatsApp Business Account.",
              },
              {
                n: "5",
                title: "Subscription and billing",
                body: "The Starter plan is free of charge. The Growth plan is billed monthly in Naira via Paystack. Subscriptions auto-renew each month unless cancelled before the renewal date. You may cancel at any time; cancellation takes effect at the end of the current billing period. We do not offer pro-rated refunds for partial months. Meta's WhatsApp conversation fees are separate and billed directly by Meta.",
              },
              {
                n: "6",
                title: "Intellectual property",
                body: "Merchat owns all rights in the Service, including the platform, AI models, dashboard, and branding. You retain ownership of all content you upload, including product data, images, and customer data. You grant Merchat a limited, non-exclusive licence to process your content solely to deliver the Service. We will never use your product data or customer data to train general-purpose AI models.",
              },
              {
                n: "7",
                title: "Your customers' data",
                body: "When your customers interact with your AI agent, their personal data is collected and processed on your behalf. As a merchant, you are the data controller for your customers' personal data. You are responsible for having a lawful basis to process that data and for informing your customers about how their data is used. Merchat acts as a data processor and will handle customer data in accordance with our Privacy Policy and any data processing agreement.",
              },
              {
                n: "8",
                title: "Disclaimers",
                body: "The Service is provided &ldquo;as is&rdquo;. We do not guarantee that the AI agent will respond perfectly in all cases, that the Service will be uninterrupted, or that all messages will be delivered. AI responses are generated automatically and may occasionally be inaccurate. You are responsible for reviewing and managing your AI agent's behaviour. Merchat is not a party to any transaction between you and your customers.",
              },
              {
                n: "9",
                title: "Limitation of liability",
                body: "To the maximum extent permitted by applicable law, Merchat's total liability to you for any claim arising out of or relating to the Service shall not exceed the amount you paid to Merchat in the three months preceding the claim. We shall not be liable for indirect, consequential, or incidental damages, including lost revenue or loss of customer data.",
              },
              {
                n: "10",
                title: "Termination",
                body: "You may close your account at any time from the dashboard settings. We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or cause harm to other users. On termination, your access to the Service will cease and your data will be retained and then deleted according to our Privacy Policy.",
              },
              {
                n: "11",
                title: "Changes to these Terms",
                body: "We may update these Terms from time to time. If we make material changes, we will notify you by email at least 14 days before the changes take effect. Your continued use of the Service after the effective date constitutes your acceptance of the updated Terms.",
              },
              {
                n: "12",
                title: "Governing law",
                body: "These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State, Nigeria. Both parties waive the right to jury trial where applicable.",
              },
              {
                n: "13",
                title: "Contact",
                body: null,
                contact: true,
              },
            ].map(({ n, title, body, list, contact }) => (
              <div key={n}>
                <h2 className="text-[19px] font-bold text-brand-navy mb-3">{n}. {title}</h2>
                {body && !contact && (
                  <p dangerouslySetInnerHTML={{ __html: body }} />
                )}
                {list && (
                  <ul className="space-y-2 list-disc pl-5">
                    {list.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
                {contact && (
                  <p>
                    For questions about these Terms, contact us at{" "}
                    <a href="mailto:legal@merchat.io" className="text-brand-orange hover:underline">legal@merchat.io</a>.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
