interface CustomError extends Error {
  status?: number;
  errors?: Record<string, string> | null;
}

export interface ApiResponse<T> {
  status: number
  message: string
  data?: T | null
}

export interface QueryParams {
  limit?: number
  offset?: number
}