import { cn } from "@/lib/utils";
import { RiLoaderLine } from "@remixicon/react";

function Spinner({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <RiLoaderLine
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", className)}
      size={size}
    />
  );
}

export { Spinner };
