import { Suspense } from "react";
import Checkout from "./checkout";

export default function CheckoutPage() {
  return (
    <Suspense>
      <Checkout />
    </Suspense>
  );
}
