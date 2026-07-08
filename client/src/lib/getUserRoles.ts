import type { UserProfile } from "@/features/user/user.type";
import { ROLES, type Role } from "@/routes/roles";

export function getUserRoles(user: UserProfile): Role[] {
    const roles: Role[] = [];

    if (user.isAdmin) roles.push(ROLES.ADMIN);

    if (user.academies.length) roles.push(ROLES.OWNER);

    switch (user.jobProfile?.[0]?.jobProfileType) {
        case "SECRETARY":
            roles.push(ROLES.SECRETARY);
            break;

        case "CAPTAIN":
            roles.push(ROLES.CAPTAIN);
            break;

        case "MANAGER":
            roles.push(ROLES.MANAGER);
            break;
    }

    return roles;
}