import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className="flex flex-col flex-auto w-full md:max-w-[725px] mx-auto gap-2">
      <Card className="animate-in flex flex-col flex-auto p-3 dark:bg-background">
        {children}
      </Card>
    </div>
  );
}
