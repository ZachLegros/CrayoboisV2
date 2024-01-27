// import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import ItemsGrid from "@/components/ItemsGrid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full h-full gap-4">
      <div className="flex flex-col w-full gap-4">
        <Breadcrumbs
          className="hidden sm:flex"
          steps={["Choix du bois", "Choix du matériel", "Ajouter au panier"]}
          currentStep={0}
        />
        <ItemsGrid className="w-full h-full">
          {[...Array(12).keys()].map((item) => (
            <Skeleton
              className="w-full h-[120px] sm:h-[129px] md:h-[154px] lg:h-[179px] p-3"
              key={item}
            />
          ))}
        </ItemsGrid>
      </div>
    </div>
  );
}
