export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getStorefrontData } from "@/lib/data/storefront";
import StorefrontNav from "@/components/storefront/StorefrontNav";
import StoreHeader from "@/components/storefront/StoreHeader";
import ProductGrid from "@/components/storefront/ProductGrid";
import StorefrontFooter from "@/components/storefront/StorefrontFooter";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { merchant } = await getStorefrontData(params.slug);
  return {
    title: `${merchant.displayName} — Shop on WhatsApp | Merchat.io`,
    description: merchant.description,
    openGraph: {
      title: `${merchant.displayName} — Shop on WhatsApp | Merchat.io`,
      description: merchant.description,
    },
    alternates: {
      canonical: `https://merchat.io/${params.slug}`,
    },
  };
}

export default async function StorefrontPage({
  params,
}: {
  params: { slug: string };
}) {
  const { merchant, products } = await getStorefrontData(params.slug);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <StorefrontNav merchant={merchant} />
      <StoreHeader merchant={merchant} />
      <div className="flex-1">
        <ProductGrid merchant={merchant} products={products} />
      </div>
      <StorefrontFooter />
    </div>
  );
}
