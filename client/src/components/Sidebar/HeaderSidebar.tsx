import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import {
  RiArrowLeftDoubleLine,
  RiSchoolFill,
  RiStackFill,
} from "@remixicon/react";
import { useActiveAcademyState } from "@/store/ActiveAcademyState";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUserProfileState } from "@/store/UserDetailsState";

export default function HeaderSidebar() {
  const { isMobile } = useSidebar();
  const { activeAcademy, setActiveAcademy } = useActiveAcademyState();
  const { userProfile } = useUserProfileState();

  const isOwner = userProfile && userProfile.academies.length > 0;

  const data = userProfile?.academies;

  useEffect(() => {
    if (data && data.length > 0) {
      setActiveAcademy(data[0]);
    }
  }, [data, setActiveAcademy]);

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          {isOwner ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <RiStackFill className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-start">
                      {activeAcademy?.name ?? "اختر أكاديمية"}
                    </span>
                  </div>
                  <RiArrowLeftDoubleLine className="ms-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  الأكاديميات
                </DropdownMenuLabel>
                {data &&
                  data.map((academy) => (
                    <DropdownMenuItem
                      key={academy.id}
                      onClick={() => setActiveAcademy(academy)}
                      className={`gap-2 p-2 cursor-pointer ${
                        academy.id === activeAcademy?.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <RiSchoolFill className="size-3.5 shrink-0" />
                      </div>
                      {academy.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <RiSchoolFill className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-start">
                    إدارة الأكاديميات
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
      <Separator />
    </SidebarHeader>
  );
}
