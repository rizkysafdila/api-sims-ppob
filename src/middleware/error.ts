import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types";
import z, { success, ZodError } from "zod";

const errorMiddleware = (err: CustomError, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: z.treeifyError(err),
    });
  } else {
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      errors: err.errors,
    });
  }
};

export default errorMiddleware