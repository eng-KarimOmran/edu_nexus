import { useUserProfileState } from "@/store/UserDetailsState";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  const { userProfile } = useUserProfileState();

  if (!userProfile) {
    return <Navigate to={"/"} replace={true} />;
  }

  return <Outlet />;
}
