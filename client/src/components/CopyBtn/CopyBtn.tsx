import { RiClipboardLine, RiCheckLine } from "@remixicon/react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text.trim().toLocaleLowerCase());
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <RiCheckLine className="text-green-500" />
      ) : (
        <RiClipboardLine />
      )}
    </Button>
  );
}
