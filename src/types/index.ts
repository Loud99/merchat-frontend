// Storefront types
export interface Merchant {
  displayName: string;
  description: string;
  logoUrl: string | null;
  primaryColour: string;
  deliveryAreas: string;
  deliveryFee: number | null;
  whatsappDeepLink: string;
  slug: string;
}

export interface ProductVariant {
  label: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  inStock: boolean;
  variants: ProductVariant[];
}
