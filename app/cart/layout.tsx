import { FaShoppingCart } from "react-icons/fa";

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 h-8 mb-4 md:mb-8">
        <FaShoppingCart className="text-xl md:text-2xl" />
        <p className="text-2xl font-semibold">Mon panier</p>
      </div>
      <div className="animate-in flex flex-col lg:flex-row w-full h-full gap-4 lg:gap-12">
        {children}
      </div>
    </div>
  );
}
