import ItemsGrid from "@/components/ItemsGrid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full h-full gap-4">
      <div className="flex flex-col w-full gap-4">
        <ItemsGrid className="md:grid-cols-2 lg:grid-cols-3">
          {[...Array(12).keys()].map((item) => (
            <Skeleton className="w-full h-[400px] p-3" key={item} />
          ))}
        </ItemsGrid>
      </div>
    </div>
  );
}
