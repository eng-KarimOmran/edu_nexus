import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import LoginForm from "../components/authForm/LoginForm";

export default function LoginPage() {
  return (
    <Card className="mx-auto w-full max-w-sm text-right mt-10 shadow">
      <CardHeader>
        <CardTitle className="text-yellow-500">
          تسجيل الدخول إلى النظام
        </CardTitle>
        <CardDescription>
          ادخل رقم الهاتف و كلمة المرور للمتابعة
        </CardDescription>

        <CardAction>
          <Button variant="link">
            <Link to="/sign-up">تسجيل اول مستخدم</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <LoginForm />
        <Button variant={"link"} disabled={true}>
          <Link to={"/forget-password"}>هل نسيت كلمة المرور؟</Link>
        </Button>
      </CardContent>
    </Card>
  );
}