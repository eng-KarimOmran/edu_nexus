import { Sidebar } from "@/components/ui/sidebar";
import ContentSidebar from "./ContentSidebar";
import HeaderSidebar from "./HeaderSidebar";
import FooterSidebar from "./FooterSidebar/FooterSidebar";

export function AppSidebar() {
  return (
    <Sidebar side="right" collapsible="icon">
      <HeaderSidebar />
      <ContentSidebar />
      <FooterSidebar />
    </Sidebar>
  );
}
