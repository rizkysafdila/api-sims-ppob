import { ApiResponse } from "../types"

export const successResponse = <T>(
  status = 0,
  message = "Request successful",
  data: T,
): ApiResponse<T> => ({
  status,
  message,
  data,
})

export const errorResponse = <T>(
  status = 100,
  message = "Request failed",
  data = null,
): ApiResponse<T> => ({
  status,
  message,
  data,
})