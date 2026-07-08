import { Navigate } from "react-router-dom";
import { useUserProfileState } from "@/store/UserDetailsState";
import type { Role } from "@/routes/roles";
import { getUserRoles } from "@/lib/getUserRoles";

interface RoleGuardProps {
  roles: Role[];
  children: React.ReactNode;
}

export default function RoleGuard({ roles, children }: RoleGuardProps) {
  const { userProfile } = useUserProfileState();

  if (!userProfile) {
    return <Navigate to="/" replace />;
  }

  const userRoles = getUserRoles(userProfile);

  const isAuthorized = roles.some((role) => userRoles.includes(role));

  if (!isAuthorized) {
    if (userRoles.includes("OWNER")) {
      return <Navigate to="/dashboard" replace />;
    } else if (userRoles.includes("CAPTAIN")) {
      return <Navigate to="/dashboard/my-lessons/today" replace />;
    } else if (userRoles.includes("SECRETARY")) {
      return <Navigate to="/dashboard/customer-management" replace />;
    } else if (userRoles.includes("MANAGER")) {
      return <Navigate to="/dashboard/lesson-schedule" replace />;
    } else if (userRoles.includes("ADMIN")) {
      return <Navigate to="/dashboard/user" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
