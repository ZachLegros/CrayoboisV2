import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="animate-in flex flex-auto justify-center items-center">
      <Spinner className="text-primary size-10" />
    </div>
  );
}
