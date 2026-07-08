import { axiosClient } from "@/lib/axios";
import * as Dto from "../employee.dto";

import type { SuccessfulResponse } from "@/types/axios";
import type { Client } from "@/features/client/client.type";
import type { EmployeeWithDebts, Lesson, wallets } from "../employee.type";

const employeeUrl = {
    base: "/employee",

    lessons: "/employee/lessons",

    allDebts: "/employee/all-debts",

    myDebts: "/employee/my-debts",

    getClient: "/employee/client",
};

export const getAllLessons = (
    data: Dto.GetAllLessonsDto
) => {
    const { query } = data;

    return axiosClient.get<SuccessfulResponse<Lesson[]>>(
        employeeUrl.lessons,
        {
            params: query,
        }
    );
};

export const getEmployeesWithDebts = () => {
    return axiosClient.get<
        SuccessfulResponse<EmployeeWithDebts[]>
    >(employeeUrl.allDebts);
};

export const getMyDebts = () => {
    return axiosClient.get<SuccessfulResponse<wallets[]>>(
        employeeUrl.myDebts
    );
};

export const getClient = (
    data: Dto.GetClientDto
) => {
    const { query } = data;

    return axiosClient.get<SuccessfulResponse<Client>>(
        employeeUrl.getClient,
        {
            params: query,
        }
    );
};