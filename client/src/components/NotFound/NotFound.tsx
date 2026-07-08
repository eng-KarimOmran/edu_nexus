import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function NotFound() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-background text-foreground gap-4">
      <h2 className="text-6xl font-bold tracking-tight">404</h2>
      <p className="text-muted-foreground">
        الصفحة غير موجودة (Not Found)
      </p>
      <Button>
        <Link to={"/"}>العودة للصفحة الرئيسية</Link>
      </Button>
    </div>
  );
}