import { Response } from "express";
import httpStatus from "http-status";
import { TResponse } from "../interface/global.interface";
import {
  normalizePaginatedResponse,
  PaginatedListResult,
} from "./paginatedList";

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const payload = normalizePaginatedResponse(data);
  res.status(payload.statusCode).json({
    success: payload.success,
    statusCode: payload.statusCode,
    message: payload?.message,
    pagination: payload.pagination,
    data: payload.data,
  });
};

export const sendPaginatedList = <T>(
  res: Response,
  message: string,
  result: PaginatedListResult<T>,
  statusCode: number = httpStatus.OK
) => {
  sendResponse(res, {
    success: true,
    statusCode,
    message,
    pagination: result.pagination,
    data: result.data,
  });
};

export default sendResponse;
