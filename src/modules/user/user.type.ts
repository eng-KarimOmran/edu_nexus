import { Academy, JobProfile, User } from '@/prisma/generated/client';
import { PaginatedResponse } from '../../shared/types/types';
import { CreateUserDto, DeleteUserDto, GetAllUsersDto, GetUserDetailsDto, NewPasswordDto, UpdateUserDto } from './user.dto';

export type SafeUser = Omit<User, "password" | "logoutAt">;

export type MeUser = SafeUser & {
    academies: Academy[];
    jobProfile:JobProfile[];
};

export interface IUserService {
    createUser(data: CreateUserDto): Promise<SafeUser>;

    updateUser(data: UpdateUserDto, currentUser: User): Promise<SafeUser>;

    deleteUser(data: DeleteUserDto, currentUser: User): Promise<SafeUser>;

    getAllUsers(data: GetAllUsersDto): Promise<PaginatedResponse<SafeUser>>;

    getUserDetails(data: GetUserDetailsDto): Promise<SafeUser>;

    newPassword(data: NewPasswordDto, currentUser: User): Promise<SafeUser>;
}