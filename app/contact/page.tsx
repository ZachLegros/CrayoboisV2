import CopyToClipboard from "@/components/CopyToClipboard";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <Card className="flex flex-col justify-start items-center px-3 py-6 w-full max-w-[400px] dark:bg-transparent">
      <h3 className="text-left text-xl font-semibold mb-5">
        Contacter notre équipe
      </h3>
      <div className="flex flex-col gap-5">
        <div>
          <h4 className="text-left font-semibold mb-1">
            Questions ou Problèmes liés aux Commandes
          </h4>
          <p className="text-left">
            Pour toute question concernant vos commandes ou en cas de problème,
            veuillez contacter notre équipe à l'adresse suivante :
          </p>
          <div className="flex items-center gap-1">
            <p className="text-primary font-semibold">dv.crayobois@gmail.com</p>
            <CopyToClipboard text="dv.crayobois@gmail.com" />
          </div>
        </div>
        <div>
          <h4 className="text-left font-semibold mb-1">Problèmes techniques</h4>
          <p className="text-left">
            Pour toute question technique, veuillez contacter notre développeur à
            l'adresse suivante :
          </p>
          <div className="flex items-center gap-2">
            <p className="text-primary font-semibold">contact@zacharylegros.dev</p>
            <CopyToClipboard text="contact@zacharylegros.dev" />
          </div>
        </div>
      </div>
    </Card>
  );
}
