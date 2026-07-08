import type { ReactNode } from "react";
import { create } from "zustand";

export interface ConfigDialog {
  title: string;
  description: string;
  children: ReactNode;
}

interface DialogState {
  configDialog: ConfigDialog | null;
  setConfigDialog: (data: ConfigDialog | null) => void;
}

export const useDialogState = create<DialogState>((set) => ({
  configDialog: null,
  setConfigDialog: (data) => set({ configDialog: data }),
}));
