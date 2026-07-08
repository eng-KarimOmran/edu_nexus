import type { Academy } from "@/features/academy/academy.type";
import { create } from "zustand";

interface ActiveAcademyState {
  activeAcademy: Academy | null;
  setActiveAcademy: (data: Academy | null) => void;
}

export const useActiveAcademyState = create<ActiveAcademyState>((set) => ({
  activeAcademy: null,

  setActiveAcademy: (data) => {
    set({ activeAcademy: data });
  },
}));