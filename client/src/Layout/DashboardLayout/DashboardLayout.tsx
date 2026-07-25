import NavTop from "@/components/NavTop/NavTop";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { axiosClient } from "@/lib/axios";
import { setServerTime } from "@/lib/time";
import { useUserProfileState } from "@/store/UserDetailsState";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const { userProfile } = useUserProfileState();

  useEffect(() => {
    const getTime = async () => {
      try {
        const res = await axiosClient.get("/time-now");

        setServerTime(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    getTime();
  }, []);

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