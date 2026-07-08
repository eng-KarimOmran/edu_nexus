import { useUserProfileState } from "@/store/UserDetailsState";
import { Outlet, Navigate } from "react-router-dom";

export default function AuthLayout() {
  const { userProfile } = useUserProfileState();

  if (userProfile) {
    return <Navigate to={"/dashboard"} replace={true} />;
  }

  return (
    <main className="w-full h-dvh flex justify-center items-center p-2">
      <Outlet />
    </main>
  );
}
