import { useEffect, useState } from "react";
import { refresh } from "@/features/auth/api/auth.service";
import { Spinner } from "@/components/ui/spinner";
import { useUserProfileState } from "@/store/UserDetailsState";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { setUserProfile } = useUserProfileState();

  useEffect(() => {
    if (initialized) return;

    const init = async () => {
      try {
        const res = await refresh();
        setUserProfile(res.data.data.user);
      } catch {
        setUserProfile(null);
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    init();
  }, [initialized, setLoading, setInitialized, setUserProfile]);

  if (loading) {
    return (
      <section className="flex h-dvh w-full flex-col items-center justify-center gap-4">
        <Spinner className="h-10 w-10" />
        <div className="space-y-1 text-center">
          <p className="text-lg font-semibold">جاري المصادقة...</p>
          <p className="text-sm text-muted-foreground">
            يرجى الانتظار، يتم التحقق من البيانات.
          </p>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
