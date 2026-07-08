import * as Dto from "../auth.dto";
import { axiosClient } from "@/lib/axios";

import type { SuccessfulResponse } from "@/types/axios";
import type { AuthLogin, AuthRefresh } from "../auth.type";

const authUrl = {
    base: "/auth",
    login: "/auth/login",
    refresh: "/auth/refresh",
    changePassword: "/auth/change-password",
    logout: "/auth/logout",
    signup: "/auth/first-user",
    newPassword: (userId: string) => `/auth/${userId}/new-password`
};

export const login = (data: Dto.LoginDto) => {
    const { body } = data
    return axiosClient.post<SuccessfulResponse<AuthLogin>>(
        authUrl.login,
        body
    );
};

export const refresh = () => {
    return axiosClient.get<SuccessfulResponse<AuthRefresh>>(authUrl.refresh);
};

export const changePassword = (data: Dto.ChangePasswordDto) => {
    const { body } = data;

    return axiosClient.patch<SuccessfulResponse<boolean>>(
        authUrl.changePassword,
        body
    );
};

export const logout = (data: Dto.LogoutDto) => {
    const { query } = data;

    return axiosClient.post<SuccessfulResponse<null>>(authUrl.logout, {}, { params: query });
};

export const signup = (data: Dto.createFirstUserDto) => {
    const { body } = data
    return axiosClient.post<SuccessfulResponse<null>>(
        authUrl.signup,
        body
    );
};