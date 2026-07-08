import { RiErrorWarningFill } from "@remixicon/react";

export default function ErrorMessageForm({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 text-red-700 text-sm mt-1">
      <span>
        <RiErrorWarningFill size={16} />
      </span>
      <span>{message}</span>
    </div>
  );
}
