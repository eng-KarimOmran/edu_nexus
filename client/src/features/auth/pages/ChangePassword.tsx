import { RiLockLine } from "@remixicon/react";
import ChangePasswordForm from "../components/authForm/ChangePasswordForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserProfileState } from "@/store/UserDetailsState";
import { Navigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const { userProfile } = useUserProfileState();

  const isPasswordChanged = userProfile?.isPasswordChanged;

  if (isPasswordChanged) {
    return <Navigate to={"/dashboard/change-password"} />;
  }

  return (
    <section className="w-full h-dvh flex justify-center items-center p-2">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col items-center gap-2">
              <RiLockLine className="text-yellow-500" />
              <span className="text-center">تغيير كلمة المرور</span>
            </div>
          </CardTitle>
          <CardDescription>
            <p className="text-center">يجب تغيير الباسورد للمتابعة في النظام</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </section>
  );
}