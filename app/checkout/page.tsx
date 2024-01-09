import { Suspense } from "react";
import Checkout from "./checkout";

export default function CheckoutPage(props: { searchParams?: { session_id?: string } }) {
  const { searchParams } = props;
  const sessionId = searchParams?.session_id;

  return (
    <Suspense>
      <Checkout sessionId={sessionId} />
    </Suspense>
  );
}
