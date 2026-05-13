import { redirect } from "next/navigation";

export default function OldSlugRedirect({ params }: { params: { slug: string } }) {
  redirect(`/store/${params.slug}`);
}
