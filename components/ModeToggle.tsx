"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { gtLg } from "@/lib/mediaQueries";
import { useMediaQuery } from "@/lib/hooks";

export function ModeToggle(props: { className?: string }) {
  const { className } = props;
  const { resolvedTheme, setTheme } = useTheme();
  const isLargerScreen = useMediaQuery(gtLg);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      className={cn("p-2", className)}
      onClick={toggleTheme}
    >
      {!isLargerScreen && (
        <span className="inline-flex mr-2 lg:hidden lg:mr-0">Thème</span>
      )}
      {resolvedTheme === "light" && (
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      )}
      {resolvedTheme === "dark" && (
        <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
    </Button>
  );
}
