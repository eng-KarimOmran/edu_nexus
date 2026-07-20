import { useUserProfileState } from "@/store/UserDetailsState";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  RiArrowDownSLine,
  RiDoorLockLine,
  RiLogoutBoxLine,
  RiUserLine,
} from "@remixicon/react";

import { useDialogState } from "@/store/DialogState";

import { Link } from "react-router-dom";

import LogoutForm from "@/features/auth/components/authForm/LogoutForm";

import { PATHS } from "@/routes/paths";

export default function NavUser() {
  const { isMobile } = useSidebar();
  const { userProfile } = useUserProfileState();
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const handelLogout = () => {
    setConfigDialog({
      title: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      description: "سيؤدي هذا الإجراء إلى إغلاق جلستك وتسجيل خروجك من حسابك.",
      children: <LogoutForm />,
    });
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    <RiUserLine />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userProfile?.name || "غير معروف"}
                  </span>
                  <span className="truncate text-xs">
                    {userProfile?.phone || "غير معروف"}
                  </span>
                </div>
                <RiArrowDownSLine className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal" dir="rtl">
                <div className="flex items-center gap-2 px-1 py-1.5 text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      <RiUserLine />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">
                      {userProfile?.name || "غير معروف"}
                    </span>
                    <span className="truncate text-xs">
                      {userProfile?.phone || "غير معروف"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="default" asChild>
                  <Link to={`/dashboard/${PATHS.changePassword}`}>
                    <RiDoorLockLine />
                    تغير كلمة المرور
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="default" asChild>
                  <Link to={`/dashboard/${PATHS.myDebts}`}>
                    <RiLogoutBoxLine />
                    مديونيتي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={handelLogout}>
                  <RiLogoutBoxLine />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
