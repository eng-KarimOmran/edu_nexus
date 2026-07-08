import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./ModeToggle";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { RiArrowLeftLine } from "@remixicon/react";

export default function NavTop() {
  const navigate = useNavigate();
  return (
    <nav className="w-full flex justify-between items-center p-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-1">
        <ModeToggle />
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
          <RiArrowLeftLine className="size-7h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    </nav>
  );
}
