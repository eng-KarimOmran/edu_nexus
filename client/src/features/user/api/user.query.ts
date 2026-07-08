import type { GetAllUsersDto } from "../user.dto";
import type { User } from "../user.type";
import { getAllUsers, getUserDetails } from "./user.service";
import { queryKey } from "../user.constants";
import { useQuery } from "@tanstack/react-query";
import useAppQuery from "@/hooks/useAppQuery";

export const useUsers = (query?: GetAllUsersDto["query"]) => {
    return useAppQuery<GetAllUsersDto, User>({
        queryFn: (params) => {
            return getAllUsers({
                query: { ...query, ...params.query }
            })
        },
        queryKey,
        keepPrevious: true,
        filters: ["isActive"],
    });
};

export const useUserDetails = (userId?: string) => {
    return useQuery({
        queryKey: [...queryKey, userId],
        queryFn: () => {
            if (!userId) throw Error("معرف المستخدم مطلوب")
            return getUserDetails({ params: { userId } })
        },
        select: (res) => res.data.data,
        enabled: !!userId,
    });
}