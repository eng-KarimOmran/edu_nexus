import { axiosClient } from "@/lib/axios";
import type { PaginatedResponse, SuccessfulResponse } from "@/types/axios";
import * as Dto from "../academy.dto"
import type { Academy, AcademyDetails } from "../academy.type";

type Entity = Academy
type EntityDetails = AcademyDetails

const academiesUrl = {
    base: "/academies",
    my: "/my-academics",

    byId: (academyId: string) => `/academies/${academyId}`,

    myAcademics: "/academies/my-academics",

    owner: (academyId: string, userId: string) =>
        `/academies/${academyId}/owner/${userId}`,

    phone: (academyId: string) =>
        `/academies/${academyId}/phone`,
    phoneById: (academyId: string, phoneId: string) =>
        `/academies/${academyId}/phone/${phoneId}`,

    address: (academyId: string) =>
        `/academies/${academyId}/address`,
    addressById: (academyId: string, addressId: string) =>
        `/academies/${academyId}/address/${addressId}`,

    socialMedia: (academyId: string) =>
        `/academies/${academyId}/social-media`,
    socialMediaById: (academyId: string, socialMediaId: string) =>
        `/academies/${academyId}/social-media/${socialMediaId}`,

    paymentLink: (academyId: string) =>
        `/academies/${academyId}/payment-link`,
    paymentLinkById: (academyId: string, paymentLinkId: string) =>
        `/academies/${academyId}/payment-link/${paymentLinkId}`,
};

export const getAllAcademies = (data: Dto.GetAllAcademiesDto) => {
    const { query } = data

    return axiosClient.get<PaginatedResponse<Entity>>(academiesUrl.base, { params: query });
};

export const getMyAcademies = () => {
    return axiosClient.get<SuccessfulResponse<Entity[]>>(academiesUrl.myAcademics);
};

export const getMyAcademics = () => {
    return axiosClient.get<SuccessfulResponse<Entity[]>>(academiesUrl.myAcademics);
};

export const createAcademy = (data: Dto.CreateAcademyDto) => {
    const { body } = data

    return axiosClient.post<SuccessfulResponse<Entity>>(academiesUrl.base, body);
};

export const deleteAcademy = (data: Dto.DeleteAcademyDto) => {
    const { params } = data
    const { academyId } = params

    return axiosClient.delete<SuccessfulResponse<EntityDetails>>(academiesUrl.byId(academyId));
}

export const updateAcademy = (data: Dto.UpdateAcademyDto) => {
    const { params, body } = data;
    const { academyId } = params

    return axiosClient.patch<SuccessfulResponse<Entity>>(academiesUrl.byId(academyId), body);
};

export const getAcademy = (data: Dto.GetAcademyDetailsDto) => {
    const { params } = data
    const { academyId } = params

    return axiosClient.get<SuccessfulResponse<EntityDetails>>(academiesUrl.byId(academyId));
}
export const addOwner = (data: Dto.AddOwnerDto) => {
    const { params } = data;
    const { academyId, userId } = params

    return axiosClient.post<SuccessfulResponse<Entity>>(academiesUrl.owner(academyId, userId));
};

export const deleteOwner = (data: Dto.DeleteOwnerDto) => {
    const { params } = data;
    const { academyId, userId } = params

    return axiosClient.delete<SuccessfulResponse<Entity>>(academiesUrl.owner(academyId, userId))
}

export const addSocialMedia = (data: Dto.AddSocialMediaDto) => {
    const { params, body } = data;
    const { academyId } = params

    return axiosClient.post<SuccessfulResponse<Entity>>(academiesUrl.socialMedia(academyId), body)
};

export const deleteSocialMedia = (data: Dto.DeleteSocialMediaDto) => {
    const { params } = data;
    const { academyId, socialMediaId } = params
    return axiosClient.delete<SuccessfulResponse<Entity>>(academiesUrl.socialMediaById(academyId, socialMediaId))
}

export const addPhone = (data: Dto.AddPhoneDto) => {
    const { params, body } = data;
    const { academyId } = params;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        academiesUrl.phone(academyId),
        body
    );
};

export const deletePhone = (data: Dto.DeletePhoneDto) => {
    const { params } = data;
    const { academyId, phoneId } = params;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        academiesUrl.phoneById(academyId, phoneId)
    );
};

export const addAddress = (data: Dto.AddAddressDto) => {
    const { params, body } = data;
    const { academyId } = params;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        academiesUrl.address(academyId),
        body
    );
};

export const deleteAddress = (data: Dto.DeleteAddressDto) => {
    const { params } = data;
    const { academyId, addressId } = params;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        academiesUrl.addressById(academyId, addressId)
    );
};

export const addPaymentLink = (data: Dto.AddPaymentLinkDto) => {
    const { params, body } = data;
    const { academyId } = params;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        academiesUrl.paymentLink(academyId),
        body
    );
};

export const deletePaymentLink = (data: Dto.DeletePaymentLinkDto) => {
    const { params } = data;
    const { academyId, paymentLinkId } = params;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        academiesUrl.paymentLinkById(academyId, paymentLinkId)
    );
};