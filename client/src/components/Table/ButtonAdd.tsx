import { Button } from "../ui/button";
import { RiAddLine } from "@remixicon/react";
import { useDialogState, type ConfigDialog } from "@/store/DialogState";

export interface ButtonAddProps {
  configDialog: ConfigDialog;
  textBtn?: string;
  className?: string;
  disabled?: boolean;
}

export default function ButtonAdd({
  configDialog,
  textBtn,
  className,
  disabled,
}: ButtonAddProps) {
  const { setConfigDialog } = useDialogState();

  return (
    <>
      <Button
        disabled={disabled}
        className={className}
        onClick={() => {
          setConfigDialog(configDialog);
        }}
      >
        <RiAddLine />
        {textBtn ? textBtn : "إضافة"}
      </Button>
    </>
  );
}
