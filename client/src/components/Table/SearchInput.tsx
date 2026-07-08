import type { SetURLSearchParams } from "react-router-dom";
import { Input } from "../ui/input";

export default function SearchInput({
  searchParams,
  setSearchParams,
}: {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}) {
  const search = searchParams.get("search") ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Input
      type="text"
      className="w-full md:max-w-xs"
      placeholder="بحث..."
      value={search}
      onChange={handleChange}
    />
  );
}
