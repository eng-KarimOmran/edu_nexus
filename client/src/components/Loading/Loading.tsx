import { Skeleton } from "@/components/ui/skeleton";
import { createDataWithKeys } from "@/lib/utils";

interface SkeletonGridProps {
  count: number;
  height: string;
  cols?: string;
}

export function SkeletonGrid({
  count,
  height,
  cols = "grid-cols-1",
}: SkeletonGridProps) {
  return (
    <div className={`grid gap-4 ${cols}`}>
      {createDataWithKeys(count).map((key) => (
        <Skeleton key={key} className={`${height} w-full`} />
      ))}
    </div>
  );
}

export function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <SkeletonGrid
      count={count}
      height="h-40"
      cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    />
  );
}

export function LoadingList({ count = 5 }: { count?: number }) {
  return <SkeletonGrid count={count} height="h-12" />;
}

export function LoadingCharts({ count = 4 }: { count?: number }) {
  return (
    <SkeletonGrid
      count={count}
      height="h-80"
      cols="grid-cols-1 lg:grid-cols-2"
    />
  );
}
