import z from "zod";
import {
  id,
  limit,
  boolean,
  transmission,
  entityName,
  price,
  booleanQuery,
  page,
  date,
} from "../../shared/utils/common.validation";

export const CreateCarSchema = {
  body: z.object({
    plateNumber: entityName,
    modelName: entityName,
    gearType: transmission,
    carSessionPrice: price,
  }),
};

export const UpdateCarSchema = {
  params: z.object({ carId: id }),
  body: z.object({
    plateNumber: entityName.optional(),
    modelName: entityName.optional(),
    gearType: transmission.optional(),
    carSessionPrice: price.optional(),
    isActive: boolean.optional(),
  }),
};

export const GetAllCarsSchema = {
  query: z.object({
    page,
    limit,
    search: z.string().optional(),
    isActive: booleanQuery.optional(),
    gearType: transmission.optional(),
  }),
};

export const GetCarDetailsSchema = {
  params: z.object({ carId: id }),
};

export const DeleteCarSchema = {
  params: z.object({ carId: id }),
};