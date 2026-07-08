import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";

export default function Pagination({ maxPage }: { maxPage: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const updatePage = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  return (
    <div className="w-full flex justify-between items-center p-4">
      <div className="text-muted-foreground">{`صفحة ${page} من ${maxPage}`}</div>
      <div className="flex items-center gap-2">
        <Button disabled={page <= 1} onClick={() => updatePage(page - 1)}>
          السابق
        </Button>
        <Button disabled={page >= maxPage} onClick={() => updatePage(page + 1)}>
          التالي
        </Button>
      </div>
    </div>
  );
}