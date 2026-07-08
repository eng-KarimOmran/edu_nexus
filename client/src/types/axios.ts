import { type AxiosError } from "axios";

export interface BaseResponse {
  message: string;
  success: boolean;
  statusCode: number;
}

export type ErrorResponse = AxiosError<BaseResponse>;

export type SuccessfulResponse<T> = BaseResponse & {
  data: T;
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}