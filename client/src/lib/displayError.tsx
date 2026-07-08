import type { ErrorResponse } from "@/types/axios";
import { toast } from "sonner";

export default function displayError({
  error,
  mes,
}: {
  error: unknown;
  mes?: string;
}) {
  if (error && typeof error === "object") {
    if ("response" in error) {
      const err = error as ErrorResponse;
      const errorMessage = err?.response?.data.message ?? mes ?? "حدث خطأ غير متوقع";
      toast.error(errorMessage);
    } else {
      if ("message" in error && typeof error.message === "string") {
        toast.error(error.message);
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    }
  } else {
    toast.error("حدث خطأ غير متوقع");
  }
}
