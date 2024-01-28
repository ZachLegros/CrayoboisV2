import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex flex-auto items-center justify-center">
      <Spinner className="text-primary w-10 h-10" />
    </div>
  );
}
