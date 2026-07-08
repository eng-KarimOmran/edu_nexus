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
import SignUpForm from "../components/authForm/SignUpForm";

export default function SignUpPage() {
  return (
    <Card className="mx-auto w-full max-w-sm text-right mt-10 shadow">
      <CardHeader>
        <CardTitle className="text-yellow-500">تسجيل اول مستخدم</CardTitle>
        <CardDescription>ادخل رقم الهاتف و الأسم للمتابعة</CardDescription>

        <CardAction>
          <Button variant="link" asChild>
            <Link to="/">تسجيل الدخول</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  );
}