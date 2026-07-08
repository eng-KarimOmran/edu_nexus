import { Checkbox } from "../ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "../ui/label";
import type { SetURLSearchParams } from "react-router-dom";

export interface TableFilterProps {
  data: {
    group: string;
    option: {
      label: string;
      key: string;
      val: string;
    }[];
  }[];
}

export default function TableFilter({
  searchParams,
  setSearchParams,
  data,
}: {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  data: TableFilterProps["data"];
}) {
  const handleCheckedChange = (
    key: string,
    val: string,
    isChecked: boolean,
  ) => {
    const params = new URLSearchParams(searchParams);
    if (isChecked) {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="outline">فلاتر</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        {data.map((g) => (
          <DropdownMenuGroup>
            <DropdownMenuLabel key={g.group}>{g.group}</DropdownMenuLabel>
            {g.option.map((o) => (
              <DropdownMenuItem key={`${o.key}-${o.val}`}>
                <Checkbox
                  id={`${o.key}-${o.val}`}
                  name={o.key}
                  checked={searchParams.get(o.key) === o.val}
                  onCheckedChange={(isChecked) =>
                    handleCheckedChange(o.key, o.val, !!isChecked)
                  }
                />
                <Label htmlFor={`${o.key}-${o.val}`}>{o.label}</Label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
