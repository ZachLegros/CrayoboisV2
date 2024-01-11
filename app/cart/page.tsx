import { Suspense } from "react";
import Cart from "./cart";

export default async function CartPage() {
  return (
    <Suspense>
      <Cart />
    </Suspense>
  );
}
