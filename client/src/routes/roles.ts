export const ROLES = {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    SECRETARY: "SECRETARY",
    CAPTAIN: "CAPTAIN",
    MANAGER: "MANAGER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];