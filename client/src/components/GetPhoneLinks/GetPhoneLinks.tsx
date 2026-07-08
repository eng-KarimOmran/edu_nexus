import { RiPhoneLine, RiWhatsappLine } from "@remixicon/react";
import { Button } from "../ui/button";

export function GetWhatsappLink({
  phone,
  variant,
}: {
  phone: string;
  variant?: "success" | "default" | "none" | "secondary" | "outline";
}) {
  return (
    <Button asChild variant={variant ?? "success"}>
      <a
        href={`https://wa.me/+2${phone}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <RiWhatsappLine className="size-4" />
        واتساب
      </a>
    </Button>
  );
}

export function GetContactLink({
  phone,
  variant,
}: {
  phone: string;
  variant?: "default" | "none" | "secondary" | "outline";
}) {
  return (
    <Button asChild variant={variant ?? "default"}>
      <a href={`tel:+2${phone}`}>
        <RiPhoneLine className="size-4" />
        اتصال هاتفي
      </a>
    </Button>
  );
}
