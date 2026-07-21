import NavTop from "@/components/NavTop/NavTop";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUserProfileState } from "@/store/UserDetailsState";
import { Navigate, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const { userProfile } = useUserProfileState();

  if (!userProfile?.isPasswordChanged) {
    return <Navigate to={"/change-password"} />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-background overflow-x-auto">
        <NavTop />
        <section className="p-2">
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  );
}