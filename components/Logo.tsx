"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Logo(props: { className?: string }) {
  const { className } = props;
  const { theme } = useTheme();
  return (
    <Link href="/" className={className}>
      <Image
        src="/images/logo-light.svg"
        width={100}
        height={50}
        className={`min-w-[100px] ${theme === "dark" ? "visible" : "hidden"}`}
        alt="crayobois-logo"
        loading="lazy"
      />
      <Image
        src="/images/logo-dark.svg"
        width={100}
        height={50}
        className={`min-w-[100px] ${theme === "dark" ? "hidden" : "visible"}`}
        alt="crayobois-logo"
        loading="lazy"
      />
    </Link>
  );
}
