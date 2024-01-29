"use client";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";

export default function CopyToClipboard(props: { text: string }) {
  const { text } = props;
  const [copied, setCopied] = useState(false);
  const [_, copy] = useCopyToClipboard();

  const handleCopy = () => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Button variant="outline" size="icon" className="w-7 h-7" onClick={handleCopy}>
      {copied ? <FaCheck /> : <FaCopy />}
    </Button>
  );
}
