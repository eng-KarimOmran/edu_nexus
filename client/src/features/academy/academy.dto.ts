import z from "zod";
import { AcademySchema } from "./academy.schema";

export type CreateAcademyDto = {
    body: z.infer<typeof AcademySchema.create.body>;
};

export type UpdateAcademyDto = {
    params: z.infer<typeof AcademySchema.update.params>;
    body: z.infer<typeof AcademySchema.update.body>;
};

export type DeleteAcademyDto = {
    params: z.infer<typeof AcademySchema.delete.params>;
};

export type GetAllAcademiesDto = {
    query: z.infer<typeof AcademySchema.getAll.query>;
};

export type GetAcademyDetailsDto = {
    params: z.infer<typeof AcademySchema.get.params>;
};

export type AddPhoneDto = {
    params: z.infer<typeof AcademySchema.phone.add.params>;
    body: z.infer<typeof AcademySchema.phone.add.body>;
};

export type DeletePhoneDto = {
    params: z.infer<typeof AcademySchema.phone.delete.params>;
};

export type AddAddressDto = {
    params: z.infer<typeof AcademySchema.address.add.params>;
    body: z.infer<typeof AcademySchema.address.add.body>;
};

export type DeleteAddressDto = {
    params: z.infer<typeof AcademySchema.address.delete.params>;
};

export type AddSocialMediaDto = {
    params: z.infer<typeof AcademySchema.socialMedia.add.params>;
    body: z.infer<typeof AcademySchema.socialMedia.add.body>;
};

export type DeleteSocialMediaDto = {
    params: z.infer<typeof AcademySchema.socialMedia.delete.params>;
};

export type AddOwnerDto = {
    params: z.infer<typeof AcademySchema.owner.add.params>;
};

export type DeleteOwnerDto = {
    params: z.infer<typeof AcademySchema.owner.delete.params>;
};

export type AddPaymentLinkDto = {
    params: z.infer<typeof AcademySchema.paymentLink.add.params>;
    body: z.infer<typeof AcademySchema.paymentLink.add.body>;
};

export type DeletePaymentLinkDto = {
    params: z.infer<typeof AcademySchema.paymentLink.delete.params>;
};