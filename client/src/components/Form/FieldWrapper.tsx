import React from "react";
import { Label } from "../ui/label";
import ErrorMessageForm from "./ErrorMessageForm";
import type { FormCol } from "./Form";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
  col?: FormCol;
}

const colSpanMap: Record<FormCol, string> = {
  full: "col-span-12",
  half: "col-span-6",
  third: "col-span-4",
  fourth: "col-span-3",
};

export default function FieldWrapper({
  label,
  error,
  htmlFor,
  children,
  col,
}: FieldWrapperProps) {
  const colClass = col ? colSpanMap[col] : "col-span-12";

  return (
    <div className={`flex flex-col gap-1 ${colClass}`}>
      {label && (
        <Label htmlFor={htmlFor} className="font-medium">
          {label}
        </Label>
      )}
      {children}
      {error && <ErrorMessageForm message={error} />}
    </div>
  );
}
