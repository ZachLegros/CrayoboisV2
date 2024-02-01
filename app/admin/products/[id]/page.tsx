import ProductDetails from "./product-details";

export default async function Product({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ProductDetails productId={id} />;
}
