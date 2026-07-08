import useNavbarRoutes from "@/hooks/useNavbarRoutes";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export default function ContentSidebar() {
  const currentPath = useLocation().pathname;

  const links = useNavbarRoutes();

  const getActiveLink = (currentPath: string, path: string): string => {
    let currentPathSafe = "";
    if (currentPath === "/dashboard") {
      currentPathSafe = currentPath.replace("/dashboard", "");
    } else {
      currentPathSafe = currentPath.replace("/dashboard/", "");
    }
    return currentPathSafe === path ? "bg-sidebar-accent" : "bg-sidebar";
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {links.map((link) => (
              <SidebarMenuItem key={link.path}>
                <SidebarMenuButton
                  className={getActiveLink(currentPath, link.path)}
                  tooltip={link.nav?.label}
                  asChild
                >
                  <Link to={link.path}>
                    {link.nav?.icon}
                    <span>{link.nav?.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
