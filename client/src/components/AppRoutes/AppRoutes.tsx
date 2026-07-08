import { Route, Routes } from "react-router-dom";

import AuthLayout from "@/Layout/AuthLayout/AuthLayout";
import ProtectedLayout from "@/Layout/ProtectedLayout/ProtectedLayout";
import DashboardLayout from "@/Layout/DashboardLayout/DashboardLayout";

import LoginPage from "@/features/auth/pages/Login";
import SignUpPage from "@/features/auth/pages/SignUp";
import ChangePasswordPage from "@/features/auth/pages/ChangePassword";

import { DASHBOARD_ROUTES } from "@/routes/dashboard.routes";
import RoleGuard from "@/Layout/RoleGuard/RoleGuard";
import NotFound from "../NotFound/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route path="dashboard" element={<DashboardLayout />}>
          {DASHBOARD_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <RoleGuard roles={route.roles}>{route.element}</RoleGuard>
              }
            />
          ))}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
