import type { UserProfile } from "@/features/user/user.type";
import { create } from "zustand";

interface UserProfileState {
  userProfile: UserProfile | null;
  setUserProfile: (data: UserProfile | null) => void;
}

export const useUserProfileState = create<UserProfileState>((set) => ({
  userProfile: null,
  setUserProfile: (data) => set({ userProfile: data }),
}));
