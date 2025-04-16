import { Request, Response } from "express";

export function errorHandler(err: Error, req: Request, res: Response) {
  console.error(err);

  return res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
}
