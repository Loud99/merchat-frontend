import Link from "next/link";
import { MapPin, Wifi } from "lucide-react";

const roles = [
  {
    title: "Head of Growth",
    location: "Lagos",
    type: "Full-time · On-site",
    remote: false,
    description:
      "Own merchant acquisition from zero. You'll build and run our go-to-market motion — content, partnerships, paid, community. We need someone who understands WhatsApp commerce and Nigerian SMEs from the inside.",
    responsibilities: [
      "Define and execute merchant acquisition strategy across channels",
      "Run performance marketing campaigns (Meta, Google) and measure CAC",
      "Build referral and partnership programmes with complementary businesses",
      "Own content and social presence for Merchat across Twitter, Instagram, LinkedIn",
      "Work directly with the CEO to set and hit monthly merchant activation targets",
    ],
    requirements: [
      "3+ years growth or marketing at a Nigerian startup or SME-focused product",
      "Direct experience with WhatsApp business or informal commerce",
      "Strong analytical skills — you measure everything",
      "Excellent written communication in both formal English and Pidgin",
    ],
  },
  {
    title: "AI Engineer",
    location: "Remote",
    type: "Full-time · Remote",
    remote: true,
    description:
      "Build and improve the AI agent at the core of Merchat. You'll work on conversation quality, intent recognition, product retrieval, and the systems that make the agent feel like a real sales rep — not a bot.",
    responsibilities: [
      "Improve AI response quality across diverse Nigerian English and Pidgin inputs",
      "Build and maintain the RAG pipeline for real-time product catalogue access",
      "Design escalation detection and handover logic",
      "Evaluate and iterate on prompts, retrieval strategies, and model selection",
      "Instrument AI performance metrics and build feedback loops from merchant data",
    ],
    requirements: [
      "2+ years working with LLMs in production (OpenAI, Anthropic, or similar)",
      "Experience with RAG, embeddings, and vector stores",
      "Strong Python skills; TypeScript a plus",
      "Familiarity with WhatsApp Business API or conversational AI systems is a bonus",
    ],
  },
  {
    title: "Merchant Success Lead",
    location: "Lagos",
    type: "Full-time · On-site",
    remote: false,
    description:
      "Be the first person merchants talk to after signing up. You'll onboard new merchants, train them on the dashboard and AI, and make sure they get real results in their first 30 days.",
    responsibilities: [
      "Own merchant onboarding — from WhatsApp number setup to first AI conversation",
      "Run onboarding calls and walkthroughs (video and in-person in Lagos)",
      "Identify struggling merchants early and intervene before churn",
      "Collect product feedback and relay it clearly to the product team",
      "Build and maintain a library of onboarding guides, FAQs, and tutorials",
    ],
    requirements: [
      "Experience in a customer success or operations role at a Nigerian startup",
      "High empathy — you enjoy helping people and solving problems patiently",
      "Comfortable with WhatsApp, basic spreadsheets, and video calls",
      "Lagos-based and available for occasional in-person merchant visits",
    ],
  },
];

export default function CareersPage() {
  return (
    <main className="pt-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <span className="inline-block bg-white/10 text-white/80 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6">
            Careers
          </span>
          <h1 className="text-[32px] lg:text-[48px] font-extrabold text-white leading-tight mb-5">
            Help us build the commerce layer for Nigerian WhatsApp.
          </h1>
          <p className="text-[18px] text-white/70 leading-relaxed">
            We&apos;re a small team doing hard, important work. If you care about Nigerian SMEs and want to build something that actually matters — read on.
          </p>
        </div>
      </section>

      {/* ── Roles ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[860px] mx-auto px-6 space-y-10">
          <h2 className="text-[22px] font-bold text-brand-navy">Open roles</h2>
          {roles.map(({ title, location, type, remote, description, responsibilities, requirements }) => (
            <div key={title} className="border border-[#E5E7EB] rounded-2xl p-7 lg:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-[20px] font-bold text-brand-navy mb-1">{title}</h3>
                  <div className="flex items-center gap-3 text-[13px] text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      {remote ? <Wifi size={13} strokeWidth={2} /> : <MapPin size={13} strokeWidth={2} />}
                      {location}
                    </span>
                    <span>·</span>
                    <span>{type}</span>
                  </div>
                </div>
                <a
                  href={`mailto:careers@merchat.io?subject=Application: ${encodeURIComponent(title)}`}
                  className="shrink-0 inline-block bg-brand-orange text-white font-semibold text-[14px] px-5 py-2.5 rounded-lg hover:bg-[#B54E20] active:scale-[0.98] transition-all"
                >
                  Apply →
                </a>
              </div>

              <p className="text-[15px] text-[#4B5563] leading-relaxed mb-6">{description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[13px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">What you&apos;ll do</h4>
                  <ul className="space-y-2">
                    {responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-[14px] text-[#374151] leading-snug">
                        <span className="text-brand-orange font-bold shrink-0 mt-0.5">–</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-3">What we&apos;re looking for</h4>
                  <ul className="space-y-2">
                    {requirements.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-[14px] text-[#374151] leading-snug">
                        <span className="text-brand-orange font-bold shrink-0 mt-0.5">–</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── General application ───────────────────────────────────────────── */}
      <section className="bg-[#F4EDE8] py-16 lg:py-20">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <h2 className="text-[24px] lg:text-[30px] font-bold text-brand-navy mb-3">
            Don&apos;t see your role?
          </h2>
          <p className="text-[16px] text-[#6B7280] mb-7 leading-relaxed">
            We hire for character and capability as much as titles. If you care deeply about what we&apos;re building and think you&apos;d add something unique, email us anyway.
          </p>
          <a
            href="mailto:careers@merchat.io"
            className="inline-block bg-brand-navy text-white font-semibold text-[15px] px-8 py-[13px] rounded-lg hover:bg-[#1E3D5C] active:scale-[0.98] transition-all"
          >
            Email careers@merchat.io
          </a>
        </div>
      </section>

    </main>
  );
}
