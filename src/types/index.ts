export interface Merchant {
  displayName: string;
  description: string;
  logoUrl: string | null;
  primaryColour: string;
  deliveryAreas: string;
  deliveryFee: number | null;
  whatsappDeepLink: string;
  whatsappPhone: string;
  slug: string;
  isVerified: boolean;
  podEnabled: boolean;
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
  stockQuantity: number;
  variants: ProductVariant[];
  payOnDelivery: boolean;
  isNew: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}
