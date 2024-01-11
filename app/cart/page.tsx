import Cart from "./cart";
import { headers } from "next/headers";

export default async function CartPage() {
  const headersList = headers();
  const referer = headersList.get("referer");

  if (referer === null) return <Cart />;

  const refererPathname = new URL(referer).pathname;

  return <Cart refererPathname={refererPathname} />;
}
