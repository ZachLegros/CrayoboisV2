"use client";

import { Link as NextUILink } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Logo(props: { className?: string }) {
  const { className } = props;
  const { theme } = useTheme();
  return (
    <NextUILink as={Link} href="/" className={className}>
      {theme === "dark" ? (
        <Image
          src="/images/logo-light.svg"
          width={100}
          height={50}
          className="min-w-[100px]"
          alt="crayobois-logo"
          priority={true}
        />
      ) : (
        <Image
          src="/images/logo-dark.svg"
          width={100}
          height={50}
          className="min-w-[100px]"
          alt="crayobois-logo"
          priority={true}
        />
      )}
    </NextUILink>
  );
}
