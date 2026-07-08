import { Separator } from "@/components/ui/separator";
import { SidebarFooter } from "@/components/ui/sidebar";
import NavUser from "./NavUser";

export default function FooterSidebar() {
  return (
    <SidebarFooter>
      <Separator />
      <NavUser />
    </SidebarFooter>
  );
}