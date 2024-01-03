"use client";

import { Link as NextUILink } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";

export default function Logo(props: { className?: string }) {
  const { className } = props;
  return (
    <NextUILink as={Link} href="/" className={className}>
      <Image
        src="/images/logo-light.svg"
        width={100}
        height={50}
        className="min-w-[100px]"
        alt="crayobois-logo"
      />
    </NextUILink>
  );
}
