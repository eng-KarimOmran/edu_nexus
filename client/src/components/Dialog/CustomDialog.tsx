import { useDialogState } from "@/store/DialogState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function CustomDialog() {
  const { configDialog, setConfigDialog } = useDialogState();

  return (
    <Dialog
      open={!!configDialog}
      onOpenChange={(open) => {
        if (!open) setConfigDialog(null);
      }}
    >
      <DialogContent
        dir="rtl"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-h-11/12 overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-lg">{configDialog?.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {configDialog?.description}
          </DialogDescription>
        </DialogHeader>
        <main className="my-2">{configDialog?.children}</main>
      </DialogContent>
    </Dialog>
  );
}
