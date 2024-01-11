import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-4 mb-4 w-full h-full">
          <Skeleton className="w-full h-[150px]" />
          <Separator />
        </div>
        <div className="flex flex-col gap-4 mb-4 w-full h-full">
          <Skeleton className="w-full h-[150px]" />
          <Separator />
        </div>
        <div className="flex flex-col gap-4 mb-4 w-full h-full">
          <Skeleton className="w-full h-[150px]" />
        </div>
      </div>
      <Skeleton className="w-80 h-[440px]" />
    </>
  );
}
