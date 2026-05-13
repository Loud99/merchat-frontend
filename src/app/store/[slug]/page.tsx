export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getStorefrontData } from "@/lib/data/storefront";
import StorefrontShell from "@/components/storefront/StorefrontShell";
import StorefrontFooter from "@/components/storefront/StorefrontFooter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { merchant } = await getStorefrontData(slug);
  return {
    title: `${merchant.displayName} — Shop on WhatsApp | Merchat`,
    description: `Browse and order from ${merchant.displayName}. ${merchant.description} Powered by Merchat.io`,
    openGraph: {
      title: `${merchant.displayName} — Shop on WhatsApp | Merchat`,
      description: merchant.description,
      images: merchant.logoUrl ? [{ url: merchant.logoUrl }] : [],
    },
    alternates: {
      canonical: `https://merchat.io/store/${slug}`,
    },
  };
}

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { merchant, products } = await getStorefrontData(slug);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <StorefrontShell merchant={merchant} products={products} />
      <StorefrontFooter />
    </div>
  );
}
