import useAppQuery from "@/hooks/useAppQuery";
import type { GetAllPayrollDto } from "../payroll.dto";
import { getAllPayrolls } from "./payroll.service";
import type { Payroll } from "../payroll.type";
import { queryKey } from "../payroll.constants";

export const usePayrolls = ({ jobProfileId, query }: { jobProfileId?: string, query?: GetAllPayrollDto["query"] }) => {
    return useAppQuery<GetAllPayrollDto, Payroll>({
        queryFn: (params) => {
            if (!jobProfileId) throw Error("معرف الملف الوظيفي مطلوب")
            return getAllPayrolls({
                params: { jobProfileId },
                query: { ...query, ...params.query },
            });
        },
        queryKey: queryKey,
        enabled: !!jobProfileId
    });
};