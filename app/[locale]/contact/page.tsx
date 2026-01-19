import CopyToClipboard from "@/components/CopyToClipboard";
import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <Card className="flex flex-col justify-start items-center px-3 py-6 w-full max-w-[400px] dark:bg-transparent">
      <h3 className="text-left text-xl font-semibold mb-5">{t("title")}</h3>
      <div className="flex flex-col gap-5">
        <div>
          <h4 className="text-left font-semibold mb-1">{t("orderQuestions")}</h4>
          <p className="text-left">{t("orderQuestionsDescription")}</p>
          <div className="flex items-center gap-1">
            <p className="text-primary font-semibold">dv.crayobois@gmail.com</p>
            <CopyToClipboard text="dv.crayobois@gmail.com" />
          </div>
        </div>
        <div>
          <h4 className="text-left font-semibold mb-1">{t("technicalIssues")}</h4>
          <p className="text-left">{t("technicalIssuesDescription")}</p>
          <div className="flex items-center gap-2">
            <p className="text-primary font-semibold">contact@zacharylegros.dev</p>
            <CopyToClipboard text="contact@zacharylegros.dev" />
          </div>
        </div>
      </div>
    </Card>
  );
}
