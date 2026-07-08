import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

type ShowMoreProps = {
  text?: string;
  columns?: number;
};

function getMaxByColumns(columns: number) {
  if (columns <= 2) return 20;
  if (columns <= 4) return 15;
  if (columns <= 6) return 10;
  return 8;
}

export default function ShowMore({ text = "", columns = 8 }: ShowMoreProps) {
  const isMobile = useIsMobile();
  const max = getMaxByColumns(columns);
  const isLong = text.length > max;
  const shortTextMax = 2;
  const shortText = isLong ? `${text.slice(0, shortTextMax)}...` : text;

  if (!isLong) return <span>{text}</span>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">{shortText}</Button>
      </PopoverTrigger>
      <PopoverContent align={isMobile ? "center" : "start"} className="text-sm">
        {text}
      </PopoverContent>
    </Popover>
  );
}
