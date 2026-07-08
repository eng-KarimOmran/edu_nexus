import { useUserProfileState } from "@/store/UserDetailsState";
import axios from "axios";
import env from "@/config/env"

export const axiosClient = axios.create({
  baseURL: env.BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        await axiosClient.get("/auth/refresh");
        return axiosClient(originalRequest);
      } catch {
        useUserProfileState.getState().setUserProfile(null);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);