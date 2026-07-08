import useAppQuery from "@/hooks/useAppQuery";
import type { GetAllAcademiesDto } from "../academy.dto";
import type { Academy } from "../academy.type";
import { getAcademy, getAllAcademies, getMyAcademics } from "./academy.service";
import { queryKey } from "../academy.constants"
import { useQuery } from "@tanstack/react-query";

export const useAcademy = () => {
    return useAppQuery<GetAllAcademiesDto, Academy>({
        queryFn: getAllAcademies,
        queryKey,
        keepPrevious: true,
    });
}

export const useAcademyDetails = ({ academyId }: { academyId?: string }) => {
    return useQuery({
        queryKey: [...queryKey, academyId],
        queryFn: () => {
            if (!academyId) throw Error("معرف الأكادمية غير موجود");
            return getAcademy({ params: { academyId: academyId } });
        },
        select: (res) => res.data.data,
    });
}

export const useMyAcademies = () => {
    return useQuery({
        queryFn: getMyAcademics,
        queryKey: [...queryKey, "my-academics"],
        select: (res) => res.data.data,
    });
}