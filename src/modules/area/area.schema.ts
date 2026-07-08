import z from "zod";
import {
  id,
  limit,
  boolean,
  entityName,
  booleanQuery,
  page,
  supportType,
} from "../../shared/utils/common.validation";

export const CreateAreaSchema = {
  body: z.object({
    name: entityName,
    supportType,
  }),
};

export const UpdateAreaSchema = {
  params: z.object({
    areaId: id,
  }),
  body: z.object({
    name: entityName.optional(),
    supportType: supportType.optional(),
    isActive: boolean.optional(),
  }),
};

export const GetAllAreasSchema = {
  query: z.object({
    page,
    limit,
    search: z.string().optional(),
    isActive: booleanQuery.optional(),
    supportType: supportType.optional(),
  }),
};

export const GetAreaDetailsSchema = {
  params: z.object({
    areaId: id,
  }),
};

export const DeleteAreaSchema = {
  params: z.object({
    areaId: id,
  }),
};