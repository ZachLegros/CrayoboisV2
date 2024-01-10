import { Card as NextUICard, CardProps } from "@nextui-org/react";

export default function Card(props: CardProps) {
  const { isHoverable, ...cardProps } = props;
  return (
    <NextUICard
      isHoverable={isHoverable}
      {...cardProps}
      className={
        isHoverable
          ? "!transition-card shadow-md border bg-background data-[hover=true]:bg-background dark:border-none dark:bg-slate-800/75 dark:data-[hover=true]:bg-slate-700/75 hover:translate-y-[-2px] data-[pressed=true]:opacity-60 dark:data-[pressed=true]:opacity-100"
          : "!transition-card shadow-md border bg-background dark:border-none dark:bg-slate-800/75"
      }
    />
  );
}
