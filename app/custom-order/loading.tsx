import { Breadcrumbs } from "@/components/Breadcrumbs";
import ItemsGrid from "@/components/ItemsGrid";
import { Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex w-full h-full gap-4">
      <div className="flex flex-col w-full gap-4">
        <Breadcrumbs
          steps={["Choix du bois", "Choix du matériel", "Ajouter au panier"]}
          currentStep={0}
        />
        <ItemsGrid className="w-full h-full">
          {[...Array(12).keys()].map((_, index) => (
            <Skeleton className="w-full h-[149px] rounded-md p-3" key={index} />
          ))}
        </ItemsGrid>
      </div>
    </div>
  );
}