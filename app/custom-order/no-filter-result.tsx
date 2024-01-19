import { useCustomOrderStore } from "./store";
import { Button } from "@/components/ui/button";

export default function NoFilterResult() {
  const { clearFilters } = useCustomOrderStore();

  return (
    <div className="flex flex-col items-center justify-start w-full h-full mt-11">
      <div className="flex flex-col">
        <p className="text-2xl lg:text-3xl font-bold text-center">
          Aucun item satisfait les critères de filtrage.
        </p>
        <div className="flex mt-8 gap-4 justify-center items-center flex-wrap">
          <Button onClick={() => clearFilters()}>Reinitialiser les filtres</Button>
        </div>
      </div>
    </div>
  );
}
