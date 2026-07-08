import type { ReactNode } from "react";
import type { Role } from "./roles";

export interface RouteNav {
    label: string;
    icon: ReactNode;
}

export interface AppRoute {
    path: string;
    element: ReactNode;

    nav?: RouteNav;

    roles: Role[];
}