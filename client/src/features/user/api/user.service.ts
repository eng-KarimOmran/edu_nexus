import { axiosClient } from "@/lib/axios";
import * as Dto from "../user.dto";

import type { PaginatedResponse, SuccessfulResponse } from "@/types/axios";
import type { User, UserProfile } from "../user.type";

type Entity = User;
type EntityDetails = UserProfile;

const usersUrl = {
    base: "/admin/users",
    byId: (userId: string) => `/admin/users/${userId}`,
};

export const createUser = (data: Dto.CreateUserDto) => {
    const { body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        usersUrl.base,
        body
    );
};

export const updateUser = (data: Dto.UpdateUserDto) => {
    const { params, body } = data;
    const { userId } = params;

    return axiosClient.patch<SuccessfulResponse<Entity>>(
        usersUrl.byId(userId),
        body
    );
};

export const deleteUser = (data: Dto.DeleteUserDto) => {
    const { params } = data;
    const { userId } = params;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        usersUrl.byId(userId)
    );
};

export const getAllUsers = (data: Dto.GetAllUsersDto) => {
    const { query } = data;

    return axiosClient.get<PaginatedResponse<Entity>>(
        usersUrl.base,
        {
            params: query,
        }
    );
};

export const getUserDetails = (data: Dto.GetUserDetailsDto) => {
    const { params } = data;
    const { userId } = params;

    return axiosClient.get<SuccessfulResponse<EntityDetails>>(
        usersUrl.byId(userId)
    );
};

export const setNewPassword = (data: Dto.NewPasswordDto) => {
    const { params, body } = data
    const { userId } = params
    return axiosClient.patch<SuccessfulResponse<UserProfile>>(`${usersUrl.byId(userId)}/new-password`, body);
};