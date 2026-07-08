import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RiLockLine } from "@remixicon/react";
import ChangePasswordForm from "../components/authForm/ChangePasswordForm";

export default function ChangePasswordDashboardPage() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col items-center gap-2">
            <RiLockLine className="text-yellow-500" />
            <span className="text-center">تغيير كلمة المرور</span>
          </div>
        </CardTitle>
        <CardDescription>
          <p className="text-center">
            قم بإدخال كلمة المرور الحالية، ثم أدخل كلمة مرور جديدة وآمنة لتحديث
            حسابك.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}