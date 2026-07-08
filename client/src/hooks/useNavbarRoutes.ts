import { DASHBOARD_ROUTES } from "@/routes/dashboard.routes";
import { useUserProfileState } from "@/store/UserDetailsState";
import { getUserRoles } from "@/lib/getUserRoles";

export default function useNavbarRoutes() {
    const { userProfile } = useUserProfileState();

    if (!userProfile) return [];

    const userRoles = getUserRoles(userProfile);

    return DASHBOARD_ROUTES.filter((route) => {
        if (!route.nav) return false;

        return route.roles.some((role) => userRoles.includes(role));
    });
}