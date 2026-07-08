import { Request, Response } from "express";
import ApiError from "../utils/ApiError";

export const notFoundRouter = (_: Request, __: Response) => {
  throw ApiError.NotFound("PATH_NOT_FOUND");
};