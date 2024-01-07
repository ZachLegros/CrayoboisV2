import { FaShoppingCart } from "react-icons/fa";

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex items-center gap-2 mb-8">
        <FaShoppingCart className="text-3xl" />
        <p className="text-3xl font-semibold">Mon panier</p>
      </div>
      <div className="flex w-full h-full gap-16">{children}</div>
    </div>
  );
}
