import ItemsGrid from "@/components/ItemsGrid";
import { Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex w-full h-full gap-4">
      <div className="flex flex-col w-full gap-4">
        <ItemsGrid className="md:grid-cols-2 lg:grid-cols-3">
          {[...Array(12).keys()].map((_, index) => (
            <Skeleton className="w-full h-[400px] rounded-md p-3" key={index} />
          ))}
        </ItemsGrid>
      </div>
    </div>
  );
}