import { Divider, Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-4 mb-4 w-full h-full">
          <Skeleton className="flex flex-col w-full h-[150px] rounded-md" />
          <Divider />
        </div>
        <div className="flex flex-col gap-4 mb-4 w-full h-full">
          <Skeleton className="flex flex-col w-full h-[150px] rounded-md" />
          <Divider />
        </div>
        <div className="flex flex-col gap-4 mb-4 w-full h-full">
          <Skeleton className="flex flex-col w-full h-[150px] rounded-md" />
        </div>
      </div>
      <Skeleton className="w-72 h-[440px] overflow-hidden rounded-md" />
    </>
  );
}
