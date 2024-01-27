import OrderDetails from "./order-details";

export default async function Order({ params }: { params: { id: string } }) {
  const { id } = params;
  return <OrderDetails orderId={id} />;
}
